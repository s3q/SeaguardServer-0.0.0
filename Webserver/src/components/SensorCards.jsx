import React, { useMemo } from "react";
import { Accordion } from "react-bootstrap";
import "../css/dashboard.css";

const PRIMARY_KEYS = new Set([
  "temp",
  "temperature",
  "humidity",
  "hum",
  "battery",
  "batteryVoltage",
  "voltage",
  "lat",
  "latitude",
  "lon",
  "lng",
  "longitude",
  "gps",
  "timestamp",
  "time",
  "ts",
]);

const pickValue = (data, keys) => {
  if (!data) {
    return undefined;
  }

  for (const key of keys) {
    if (data[key] !== undefined && data[key] !== null) {
      return data[key];
    }
  }

  return undefined;
};

const formatValue = (value, suffix = "") => {
  if (value === undefined || value === null || value === "") {
    return "N/A";
  }

  if (typeof value === "number") {
    return `${value}${suffix}`;
  }

  return `${value}${suffix}`;
};

const formatTimestamp = (value) => {
  if (value === undefined || value === null || value === "") {
    return "N/A";
  }

  let date;
  if (typeof value === "number") {
    const normalized = value < 1000000000000 ? value * 1000 : value;
    date = new Date(normalized);
  } else {
    date = new Date(value);
  }

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString();
};

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export default function SensorCards({ boat, data, status }) {
  const metrics = useMemo(() => {
    const temp = pickValue(data, ["temp", "temperature"]);
    const humidity = pickValue(data, ["humidity", "hum"]);
    const battery = pickValue(data, ["battery"]);
    const voltage = pickValue(data, ["voltage", "batteryVoltage"]);
    const timestamp = pickValue(data, ["timestamp", "time", "ts"]);

    const gps =
      data?.gps && typeof data.gps === "object" ? data.gps : undefined;
    const lat =
      pickValue(data, ["lat", "latitude"]) ??
      (gps ? pickValue(gps, ["lat", "latitude"]) : undefined);
    const lon =
      pickValue(data, ["lon", "lng", "longitude"]) ??
      (gps ? pickValue(gps, ["lon", "lng", "longitude"]) : undefined);

    const latNum = toNumber(lat);
    const lonNum = toNumber(lon);

    return {
      temp,
      humidity,
      battery,
      voltage,
      timestamp,
      gps: { lat, lon, latNum, lonNum },
    };
  }, [data]);

  const extraEntries = useMemo(() => {
    if (!data || typeof data !== "object") {
      return [];
    }

    return Object.entries(data).filter(([key]) => !PRIMARY_KEYS.has(key));
  }, [data]);

  const mapUrl =
    metrics.gps.latNum !== null && metrics.gps.lonNum !== null
      ? `https://maps.google.com/?q=${metrics.gps.latNum},${metrics.gps.lonNum}`
      : null;

  const statusLabel = status?.apiOnline
    ? status?.isStale
      ? "Stale"
      : "Online"
    : "Offline";
  const statusClass = status?.apiOnline
    ? status?.isStale
      ? "status-stale"
      : "status-online"
    : "status-offline";

  return (
    <div className="sensor-stack">
      <div className="spcard sensor-header">
        <div>
          <div className="sensor-label">Selected Boat</div>
          <div className="sensor-title">{boat?.name || "Unknown Boat"}</div>
          <div className="sensor-sub">
            {boat?.description || "No description provided."}
          </div>
        </div>
        <div className={`status-badge ${statusClass}`}>{statusLabel}</div>
        <div className="sensor-sub">
          {status?.lastTelemetryAt
            ? `Last update: ${status.lastTelemetryAt.toLocaleString()}`
            : "Waiting for telemetry..."}
        </div>
        <div className="sensor-sub">
          {status?.lastCheckedAt
            ? `Last check: ${status.lastCheckedAt.toLocaleTimeString()}`
            : "Checking API..."}
        </div>
      </div>
      <div className="sensor-grid">
        <div className="spcard sensor-card">
          <div className="sensor-label">Temperature</div>
          <div className="sensor-value">{formatValue(metrics.temp, " C")}</div>
          <div className="sensor-sub">Ambient</div>
        </div>
        <div className="spcard sensor-card">
          <div className="sensor-label">Humidity</div>
          <div className="sensor-value">{formatValue(metrics.humidity, "%")}</div>
          <div className="sensor-sub">Relative</div>
        </div>
        <div className="spcard sensor-card">
          <div className="sensor-label">Battery</div>
          <div className="sensor-value">{formatValue(metrics.battery, "%")}</div>
          <div className="sensor-sub">Charge</div>
        </div>
        <div className="spcard sensor-card">
          <div className="sensor-label">Voltage</div>
          <div className="sensor-value">{formatValue(metrics.voltage, "V")}</div>
          <div className="sensor-sub">Power</div>
        </div>
        <div className="spcard sensor-card">
          <div className="sensor-label">GPS</div>
          <div className="sensor-value">
            {metrics.gps.lat !== undefined && metrics.gps.lon !== undefined
              ? `${formatValue(metrics.gps.lat)}, ${formatValue(metrics.gps.lon)}`
              : "N/A"}
          </div>
          <div className="sensor-sub">
            {mapUrl ? (
              <a href={mapUrl} target="_blank" rel="noreferrer">
                View on map
              </a>
            ) : (
              "Coordinates"
            )}
          </div>
        </div>
        <div className="spcard sensor-card">
          <div className="sensor-label">Timestamp</div>
          <div className="sensor-value">{formatTimestamp(metrics.timestamp)}</div>
          <div className="sensor-sub">
            {status?.lastTelemetryAt
              ? `Last update ${status.lastTelemetryAt.toLocaleString()}`
              : "Awaiting telemetry"}
          </div>
        </div>
      </div>

      {!data && (
        <div className="spcard telemetry-wait">
          Waiting for telemetry...
        </div>
      )}

      {extraEntries.length > 0 && (
        <div className="spcard extra-telemetry">
          <div className="sensor-label">Additional Telemetry</div>
          <div className="extra-grid">
            {extraEntries.map(([key, value]) => (
              <div key={key} className="extra-item">
                <div className="extra-key">{key}</div>
                <div className="extra-value">
                  {typeof value === "object"
                    ? JSON.stringify(value)
                    : String(value)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Accordion className="sensor-raw">
        <Accordion.Item eventKey="0" className="spcard">
          <Accordion.Header>Raw JSON</Accordion.Header>
          <Accordion.Body>
            <pre className="raw-json">
              {data ? JSON.stringify(data, null, 2) : "No telemetry yet."}
            </pre>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}
