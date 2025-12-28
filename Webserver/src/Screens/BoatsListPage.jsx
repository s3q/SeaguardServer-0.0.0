import React from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import SeaguardNavbar from "../components/SeaguardNavbar";
import { useBoat } from "../context/BoatContext";
import "../css/dashboard.css";

export default function BoatsListPage() {
  const { boats, boatStatusById, setSelectedBoatId } = useBoat();
  const navigate = useNavigate();

  const handleOpen = (boatId) => {
    setSelectedBoatId(boatId);
    navigate(`/boats/${boatId}`);
  };

  return (
    <div className="main">
      <SeaguardNavbar />
      <div className="overflow-auto h-100 body">
        <section className="dashboard-section">
          <Container>
            <div className="title-divider">Boats</div>
            <Row className="g-4">
              {boats.map((boat) => {
                const status = boatStatusById[boat.id];
                const hasStatus = Boolean(status);
                const isOnline = status?.apiOnline;
                const lastSeen = status?.lastSeen;
                const isStale =
                  lastSeen instanceof Date
                    ? Date.now() - lastSeen.getTime() > 10000
                    : status?.isStale;
                const lastUpdate = status?.lastSeen
                  ? status.lastSeen.toLocaleString()
                  : "No telemetry yet";
                const statusLabel = hasStatus
                  ? isOnline
                    ? isStale
                      ? "Stale"
                      : "Online"
                    : "Offline"
                  : "Unknown";
                const statusClass = hasStatus
                  ? isOnline
                    ? isStale
                      ? "status-stale"
                      : "status-online"
                    : "status-offline"
                  : "status-unknown";

                return (
                  <Col md={6} lg={4} key={boat.id}>
                    <div className="spcard boat-card">
                      <div className="boat-card-header">
                        <div>
                          <div className="sensor-label">Boat</div>
                          <div className="boat-card-title">{boat.name}</div>
                          <div className="sensor-sub">
                            {boat.description || "No description available."}
                          </div>
                        </div>
                        <div className={`status-badge ${statusClass}`}>
                          {statusLabel}
                        </div>
                      </div>
                      <div className="boat-card-meta">
                        <div className="sensor-sub">Last update</div>
                        <div className="boat-card-value">{lastUpdate}</div>
                      </div>
                      <Button
                        variant="outline-light"
                        className="boat-card-button"
                        onClick={() => handleOpen(boat.id)}
                      >
                        Open
                      </Button>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </Container>
        </section>
      </div>
    </div>
  );
}
