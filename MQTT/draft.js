// server.js
// Run with:
//   npm install aedes express websocket-stream
//   node server.js

const net = require('net');
const http = require('http');
const aedes = require('aedes')();
const express = require('express');
const websocketStream = require('websocket-stream');

// -----------------------------
// Global sensor data container
// -----------------------------
let sensorData = null;

// -----------------------------
// MQTT Broker (TCP on 1883)
// -----------------------------
const mqttTcpServer = net.createServer(aedes.handle);

mqttTcpServer.listen(1883, function () {
  console.log('✅ MQTT TCP broker listening on port 1883');
});

// ----------------------------------------------
// MQTT Broker over WebSocket (WS on port 8888)
// ----------------------------------------------
const wsHttpServer = http.createServer();

// Attach websocket-stream to the HTTP server
websocketStream.createServer({ server: wsHttpServer }, aedes.handle);

wsHttpServer.listen(8888, function () {
  console.log('✅ MQTT WebSocket broker listening on port 8888');
});

// ----------------------------------------------
// MQTT publish listener (ESP32 → Server)
// ----------------------------------------------
aedes.on('publish', function (packet, client) {
  const topic = packet.topic;
  const payloadString = packet.payload ? packet.payload.toString() : '';

  console.log('MQTT:', topic, payloadString);

  if (topic === 'seaguard/sensors') {
    try {
      const parsed = JSON.parse(payloadString);

      // Ensure timestamp is present
      if (!parsed.timestamp) {
        parsed.timestamp = Date.now();
      }

      sensorData = parsed;

      // Optional: log parsed sensor data
      // console.log('Updated sensorData:', sensorData);
    } catch (err) {
      console.error('Failed to parse JSON from seaguard/sensors:', err.message);
    }
  }
});

// ----------------------------------------------
// MQTT control command function (Server → ESP32)
// ----------------------------------------------
function sendControlCommand(topic, msg) {
  const message = {
    topic: topic,
    payload: msg,
    qos: 0,
    retain: false
  };

  aedes.publish(message, function (err) {
    if (err) {
      console.error('Error publishing control command:', err.message);
    } else {
      console.log('Control command sent:', topic, msg);
    }
  });
}

// -----------------------------
// HTTP API (Express on 3000)
// -----------------------------
const app = express();

// Optional: simple CORS for dashboards / browser clients
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

/**
 * Control → ESP32
 *
 * Route supports topics with slashes.
 * Example:
 *   GET /control/seaguard/control/forward/SLOW
 *   -> topic = "seaguard/control/forward"
 *   -> cmd   = "SLOW"
 */
app.get('/control/*', function (req, res) {
  const pathPart = req.params[0] || ''; // everything after /control/
  const segments = pathPart.split('/').filter(Boolean);

  if (segments.length < 2) {
    return res.status(400).json({
      error: 'Invalid control URL. Use /control/<topic>/<cmd>, e.g. /control/seaguard/control/forward/SLOW'
    });
  }

  const cmd = segments.pop();            // last segment is cmd
  const topic = segments.join('/');      // rest is full topic

  sendControlCommand(topic, cmd);

  res.json({
    status: 'ok',
    topic: topic,
    cmd: cmd
  });
});

/**
 * View latest sensor readings
 * GET /data
 * Returns the latest sensorData in JSON
 */
app.get('/data', function (req, res) {
  if (!sensorData) {
    return res.json({
      error: 'No sensor data received yet',
      sensorData: null
    });
  }

  res.json(sensorData);
});

// Start HTTP API server
app.listen(3000, function () {
  console.log('✅ HTTP API server listening on port 3000');
  console.log('Endpoints:');
  console.log('  GET /control/<topic>/<cmd>   → publish MQTT control command');
  console.log('  GET /data                    → latest sensor data');
});
