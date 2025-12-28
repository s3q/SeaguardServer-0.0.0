const net = require("net");
const http = require("http");
const express = require("express");
const aedes = require("aedes")();
const websocketStream = require("websocket-stream");
const { randomBytes, randomUUID } = require("crypto");
const BOATS_CONFIG = require("./boats");

const MQTT_TCP_PORT = 1883;
const MQTT_WS_PORT = 8888;
const API_PORT = 3000;

const HISTORY_LIMIT = 200;
const ACK_LIMIT = 200;
const ACK_MAX_AGE_MS = 5 * 60 * 1000;
const ONLINE_WINDOW_MS = 10 * 1000;
const CONTROL_COOLDOWN_MS = 100;

const DEFAULT_BOAT_ID = "default";
const ALLOWED_ACTIONS = new Set(["forward", "back", "left", "right", "stop"]);

const boatsState = {};
const controlCooldownByBoat = new Map();

const boatConfigs = Array.isArray(BOATS_CONFIG) ? BOATS_CONFIG : [];
if (!boatConfigs.find((boat) => boat.id === DEFAULT_BOAT_ID)) {
  boatConfigs.unshift({
    id: DEFAULT_BOAT_ID,
    name: "SeaGuard Default",
    description: "Legacy default boat",
  });
}

const boatConfigMap = new Map(boatConfigs.map((boat) => [boat.id, boat]));

const normalizeTimestamp = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return Date.now();
  }
  return numeric < 1e12 ? numeric * 1000 : numeric;
};

const getBoatState = (boatId) => {
  if (!boatsState[boatId]) {
    boatsState[boatId] = {
      sensors: null,
      gps: null,
      status: null,
      lastSeen: null,
      history: {
        sensors: [],
        gps: [],
      },
      pendingAcks: {},
    };
  }
  return boatsState[boatId];
};

const pushHistory = (history, entry) => {
  history.push(entry);
  if (history.length > HISTORY_LIMIT) {
    history.splice(0, history.length - HISTORY_LIMIT);
  }
};

const pruneAcks = (pendingAcks) => {
  const now = Date.now();
  for (const [cmdId, ack] of Object.entries(pendingAcks)) {
    const receivedAt = ack?.receivedAt || ack?.timestamp || ack?.ts;
    if (receivedAt && now - receivedAt > ACK_MAX_AGE_MS) {
      delete pendingAcks[cmdId];
    }
  }

  const keys = Object.keys(pendingAcks);
  if (keys.length > ACK_LIMIT) {
    keys
      .sort((a, b) => {
        const aTime = pendingAcks[a]?.receivedAt || 0;
        const bTime = pendingAcks[b]?.receivedAt || 0;
        return aTime - bTime;
      })
      .slice(0, keys.length - ACK_LIMIT)
      .forEach((cmdId) => {
        delete pendingAcks[cmdId];
      });
  }
};

const safeJsonParse = (payloadString) => {
  try {
    return JSON.parse(payloadString);
  } catch (error) {
    return null;
  }
};

const createCmdId = () => {
  if (typeof randomUUID === "function") {
    return randomUUID();
  }
  return randomBytes(16).toString("hex");
};

const isValidBoatId = (boatId) =>
  typeof boatId === "string" && /^[a-zA-Z0-9_-]+$/.test(boatId);

const computeOnline = (boatState) => {
  if (!boatState?.lastSeen) {
    return false;
  }
  return Date.now() - boatState.lastSeen < ONLINE_WINDOW_MS;
};

const publishControlCommand = (boatId, action, payload) => {
  const cmdId = createCmdId();
  const timestamp = Date.now();
  const messagePayload = {
    cmdId,
    action,
    payload: payload ?? null,
    ts: timestamp,
  };

  const topic = `seaguard/${boatId}/control/${action}`;
  const packet = {
    topic,
    payload: JSON.stringify(messagePayload),
    qos: 0,
    retain: false,
  };

  const boatState = getBoatState(boatId);
  boatState.pendingAcks[cmdId] = {
    cmdId,
    action,
    payload: payload ?? null,
    status: "pending",
    timestamp,
  };
  pruneAcks(boatState.pendingAcks);

  aedes.publish(packet, function (err) {
    if (err) {
      console.error("Control publish failed:", err.message);
    } else {
      console.log("Control sent:", topic, messagePayload);
    }
  });

  return cmdId;
};

// -----------------------------
// MQTT Broker (TCP on 1883)
// -----------------------------
const mqttTcpServer = net.createServer(aedes.handle);
mqttTcpServer.listen(MQTT_TCP_PORT, function () {
  console.log(`MQTT TCP broker listening on port ${MQTT_TCP_PORT}`);
});

// ----------------------------------------------
// MQTT Broker over WebSocket (WS on port 8888)
// ----------------------------------------------
const wsHttpServer = http.createServer();
websocketStream.createServer({ server: wsHttpServer }, aedes.handle);
wsHttpServer.listen(MQTT_WS_PORT, function () {
  console.log(`MQTT WebSocket broker listening on port ${MQTT_WS_PORT}`);
});

// ----------------------------------------------
// MQTT publish listener
// ----------------------------------------------
aedes.on("publish", function (packet) {
  const topic = packet.topic;
  const payloadString = packet.payload ? packet.payload.toString() : "";

  console.log("MQTT:", topic, payloadString);

  const parts = topic.split("/").filter(Boolean);
  if (parts.length < 3 || parts[0] !== "seaguard") {
    return;
  }

  const boatId = parts[1];
  const channel = parts[2];

  if (!["sensors", "gps", "status", "ack"].includes(channel)) {
    return;
  }

  const payload = safeJsonParse(payloadString);
  if (!payload || typeof payload !== "object") {
    console.warn(`Invalid JSON on ${topic}`);
    return;
  }

  const timestamp = normalizeTimestamp(payload.timestamp || payload.ts);
  payload.timestamp = timestamp;

  const boatState = getBoatState(boatId);
  boatState.lastSeen = timestamp;

  if (channel === "sensors") {
    boatState.sensors = payload;
    pushHistory(boatState.history.sensors, { ...payload });
  }

  if (channel === "gps") {
    boatState.gps = payload;
    pushHistory(boatState.history.gps, { ...payload });
  }

  if (channel === "status") {
    boatState.status = payload;
  }

  if (channel === "ack") {
    const cmdId = payload.cmdId;
    if (!cmdId) {
      console.warn(`ACK missing cmdId on ${topic}`);
      return;
    }
    boatState.pendingAcks[cmdId] = {
      ...payload,
      receivedAt: Date.now(),
    };
    pruneAcks(boatState.pendingAcks);
  }
});

// -----------------------------
// HTTP API (Express on 3000)
// -----------------------------
const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json({ limit: "256kb" }));

app.use(function (err, req, res, next) {
  if (err && err instanceof SyntaxError) {
    return res.status(400).json({ error: "Invalid JSON body" });
  }
  next(err);
});

app.get("/health", function (req, res) {
  res.json({
    ok: true,
    uptime: process.uptime(),
    mqtt: {
      clients: Object.keys(aedes.clients || {}).length,
    },
  });
});

app.get("/api/boats", function (req, res) {
  const knownBoatIds = new Set([
    ...boatConfigMap.keys(),
    ...Object.keys(boatsState),
  ]);

  const boats = Array.from(knownBoatIds).map((boatId) => {
    const config = boatConfigMap.get(boatId);
    const state = boatsState[boatId];
    return {
      boatId,
      name: config?.name || boatId,
      description: config?.description || "",
      online: computeOnline(state),
      lastSeen: state?.lastSeen || null,
    };
  });

  res.json({ boats });
});

app.get("/api/boats/:boatId/state", function (req, res) {
  const boatId = req.params.boatId;
  if (!isValidBoatId(boatId)) {
    return res.status(400).json({ error: "Invalid boatId" });
  }

  const state = getBoatState(boatId);
  res.json({
    sensors: state.sensors,
    gps: state.gps,
    status: state.status,
    lastSeen: state.lastSeen,
  });
});

app.get("/api/boats/:boatId/sensors/latest", function (req, res) {
  const boatId = req.params.boatId;
  if (!isValidBoatId(boatId)) {
    return res.status(400).json({ error: "Invalid boatId" });
  }
  const state = getBoatState(boatId);
  res.json(state.sensors);
});

app.get("/api/boats/:boatId/gps/latest", function (req, res) {
  const boatId = req.params.boatId;
  if (!isValidBoatId(boatId)) {
    return res.status(400).json({ error: "Invalid boatId" });
  }
  const state = getBoatState(boatId);
  res.json(state.gps);
});

app.get("/api/boats/:boatId/history", function (req, res) {
  const boatId = req.params.boatId;
  if (!isValidBoatId(boatId)) {
    return res.status(400).json({ error: "Invalid boatId" });
  }
  const state = getBoatState(boatId);
  const includeSensors = req.query.sensors !== "0";
  const includeGps = req.query.gps !== "0";
  const limit = Math.min(
    Number.parseInt(req.query.limit, 10) || HISTORY_LIMIT,
    HISTORY_LIMIT
  );

  const response = {};
  if (includeSensors) {
    response.sensors = state.history.sensors.slice(-limit);
  }
  if (includeGps) {
    response.gps = state.history.gps.slice(-limit);
  }
  response.limit = limit;

  res.json(response);
});

app.post("/api/boats/:boatId/control", function (req, res) {
  const boatId = req.params.boatId;
  if (!isValidBoatId(boatId)) {
    return res.status(400).json({ error: "Invalid boatId" });
  }

  const now = Date.now();
  const lastSent = controlCooldownByBoat.get(boatId) || 0;
  if (now - lastSent < CONTROL_COOLDOWN_MS) {
    return res.status(429).json({ error: "Command rate limited" });
  }

  const action = req.body?.action;
  if (!ALLOWED_ACTIONS.has(action)) {
    return res.status(400).json({ error: "Invalid action" });
  }

  const payload = req.body?.payload ?? null;
  const cmdId = publishControlCommand(boatId, action, payload);
  controlCooldownByBoat.set(boatId, now);

  res.json({ ok: true, cmdId });
});

app.get("/api/boats/:boatId/acks/:cmdId", function (req, res) {
  const { boatId, cmdId } = req.params;
  if (!isValidBoatId(boatId)) {
    return res.status(400).json({ error: "Invalid boatId" });
  }
  const state = getBoatState(boatId);
  const ack = state.pendingAcks[cmdId];

  if (!ack || ack.status === "pending") {
    return res.json({ status: "pending", cmdId });
  }

  if (ack.ok === true) {
    return res.json({ status: "ok", ...ack });
  }

  if (ack.ok === false) {
    return res.json({ status: "fail", ...ack });
  }

  return res.json({ status: "received", ...ack });
});

app.get("/api/boats/:boatId/video/info", function (req, res) {
  const boatId = req.params.boatId;
  if (!isValidBoatId(boatId)) {
    return res.status(400).json({ error: "Invalid boatId" });
  }
  const config = boatConfigMap.get(boatId);
  if (!config?.video?.url || !config?.video?.type) {
    return res.status(404).json({ error: "Video source not configured" });
  }

  res.json({
    type: config.video.type,
    url: config.video.url,
    mode: "redirect",
  });
});

app.get("/api/boats/:boatId/video/:type", function (req, res) {
  const boatId = req.params.boatId;
  const requestedType = req.params.type;
  if (!isValidBoatId(boatId)) {
    return res.status(400).json({ error: "Invalid boatId" });
  }
  const config = boatConfigMap.get(boatId);

  if (!config?.video?.url || !config?.video?.type) {
    return res.status(404).json({ error: "Video source not configured" });
  }

  if (requestedType !== config.video.type) {
    return res.status(400).json({ error: "Requested type does not match boat config" });
  }

  res.redirect(302, config.video.url);
});

// Legacy endpoints
app.get("/data", function (req, res) {
  const state = getBoatState(DEFAULT_BOAT_ID);
  if (!state.sensors) {
    return res.json({ error: "No sensor data received yet", sensorData: null });
  }
  res.json(state.sensors);
});

app.get(/^\/control\/(.+)/, function (req, res) {
  const pathPart = req.params[0] || "";
  const segments = pathPart.split("/").filter(Boolean);

  if (segments.length < 2) {
    return res.status(400).json({
      error:
        "Invalid control URL. Use /control/<topic>/<cmd>, e.g. /control/seaguard/control/forward/SLOW",
    });
  }

  const cmd = decodeURIComponent(segments.pop());
  const topic = segments.join("/");

  let boatId = DEFAULT_BOAT_ID;
  let action = segments[segments.length - 1];

  const match = topic.match(/^seaguard\/([^/]+)\/control\/([^/]+)$/);
  if (match) {
    boatId = match[1];
    action = match[2];
  } else if (topic.startsWith("seaguard/control/")) {
    boatId = DEFAULT_BOAT_ID;
    action = topic.split("/").pop();
  }

  if (!ALLOWED_ACTIONS.has(action)) {
    return res.status(400).json({ error: "Invalid action" });
  }

  const cmdId = publishControlCommand(boatId, action, cmd);
  res.json({ ok: true, cmdId, boatId, action });
});

app.listen(API_PORT, function () {
  console.log(`HTTP API server listening on port ${API_PORT}`);
});
