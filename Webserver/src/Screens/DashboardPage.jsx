import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import BoatSelector from "../components/BoatSelector";
import LiveVideo from "../components/LiveVideo";
import BoatMap from "../components/BoatMap";
import MotorControls from "../components/MotorControls";
import SensorCards from "../components/SensorCards";
import SeaguardNavbar from "../components/SeaguardNavbar";
import { useBoat } from "../context/BoatContext";
import useBoatTelemetry from "../hooks/useBoatTelemetry";
import "../css/home.css";
import "../css/dashboard.css";

const POLL_INTERVAL_MS = 2000;

export default function DashboardPage() {
  const { selectedBoat } = useBoat();
  const telemetry = useBoatTelemetry(selectedBoat, POLL_INTERVAL_MS);

  const statusLabel = telemetry.apiOnline
    ? telemetry.isStale
      ? "Stale"
      : "Online"
    : "Offline";

  return (
    <div className="main">
      <SeaguardNavbar />
      <div className="overflow-auto h-100 body">
        <section className="dashboard-hero">
          <Container>
            <div className="hero-card">
              <div className="hero-brand">
                <div className="hero-title">SeaGuard Control Center</div>
                <div className="hero-subtitle">
                  Multi-boat telemetry, video, and control in one view.
                </div>
              </div>
              <div className="hero-actions">
                <div className="hero-selector">
                  <div className="sensor-label">Select Boat</div>
                  <BoatSelector />
                </div>
                <div className="status-banner">
                <div className="status-pill">
                  <span
                    className={`status-dot ${
                      telemetry.apiOnline
                        ? telemetry.isStale
                          ? "stale"
                          : "online"
                        : ""
                    }`}
                  />
                  <span>{statusLabel}</span>
                </div>
                  <div className="status-meta">
                    {telemetry.lastTelemetryAt
                      ? `Last update: ${telemetry.lastTelemetryAt.toLocaleString()}`
                      : "Waiting for telemetry"}
                  </div>
                  <div className="status-meta">
                    {telemetry.lastCheckedAt
                      ? `Last check: ${telemetry.lastCheckedAt.toLocaleTimeString()}`
                      : "Checking API"}
                  </div>
                </div>
                {telemetry.apiError && (
                  <div className="status-meta">Error: {telemetry.apiError}</div>
                )}
              </div>
            </div>
          </Container>
        </section>

        <section className="dashboard-section">
          <Container>
            <Row className="g-4 dashboard-grid">
              <Col lg={5} className="dashboard-column">
                <LiveVideo boat={selectedBoat} />
                <MotorControls />
              </Col>
              <Col lg={7} className="dashboard-column">
                <SensorCards
                  boat={selectedBoat}
                  data={telemetry.sensorData}
                  status={telemetry}
                />
                <BoatMap
                  boat={selectedBoat}
                  data={telemetry.sensorData}
                  lastUpdated={
                    telemetry.lastTelemetryAt
                      ? telemetry.lastTelemetryAt.toLocaleString()
                      : null
                  }
                />
              </Col>
            </Row>
          </Container>
        </section>
      </div>
    </div>
  );
}
