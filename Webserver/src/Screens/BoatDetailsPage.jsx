import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import BoatMap from "../components/BoatMap";
import LiveVideo from "../components/LiveVideo";
import MotorControls from "../components/MotorControls";
import SensorCards from "../components/SensorCards";
import SeaguardNavbar from "../components/SeaguardNavbar";
import { useBoat } from "../context/BoatContext";
import useBoatTelemetry from "../hooks/useBoatTelemetry";
import "../css/dashboard.css";

const POLL_INTERVAL_MS = 2000;

export default function BoatDetailsPage() {
  const { id } = useParams();
  const { boats, setSelectedBoatId } = useBoat();
  const boat = boats.find((item) => item.id === id);

  useEffect(() => {
    if (boat?.id) {
      setSelectedBoatId(boat.id);
    }
  }, [boat?.id, setSelectedBoatId]);

  const telemetry = useBoatTelemetry(boat, POLL_INTERVAL_MS);
  const statusLabel = telemetry.apiOnline
    ? telemetry.isStale
      ? "Stale"
      : "Online"
    : "Offline";

  if (!boat) {
    return (
      <div className="main">
        <SeaguardNavbar />
        <div className="overflow-auto h-100 body">
          <section className="dashboard-section">
            <Container>
              <div className="spcard boat-not-found">
                <div className="sensor-label">Boat not found</div>
                <p>
                  The requested boat does not exist. Go back to the{" "}
                  <Link to="/boats">boats list</Link>.
                </p>
              </div>
            </Container>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="main">
      <SeaguardNavbar />
      <div className="overflow-auto h-100 body">
        <section className="dashboard-hero">
          <Container>
            <div className="hero-card">
              <div className="hero-brand">
                <div className="hero-title">{boat.name}</div>
                <div className="hero-subtitle">
                  {boat.description || "Dedicated boat view."}
                </div>
              </div>
              <div className="hero-actions">
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
              </div>
            </div>
          </Container>
        </section>

        <section className="dashboard-section">
          <Container>
            <Row className="g-4 dashboard-grid">
              <Col lg={5} className="dashboard-column">
                <LiveVideo boat={boat} />
                <MotorControls />
              </Col>
              <Col lg={7} className="dashboard-column">
                <SensorCards boat={boat} data={telemetry.sensorData} status={telemetry} />
                <BoatMap
                  boat={boat}
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
