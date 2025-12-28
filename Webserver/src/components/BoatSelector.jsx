import React from "react";
import { Dropdown } from "react-bootstrap";
import { useBoat } from "../context/BoatContext";
import "../css/dashboard.css";

export default function BoatSelector() {
  const { boats, selectedBoatId, setSelectedBoatId, boatStatusById } = useBoat();

  const selectedBoat =
    boats.find((boat) => boat.id === selectedBoatId) || boats[0];

  const selectedStatus = selectedBoat
    ? boatStatusById[selectedBoat.id]
    : null;
  const selectedOnline = selectedStatus?.apiOnline;
  const selectedStale = selectedStatus?.isStale;
  const hasStatus = Boolean(selectedStatus);
  const selectedDotClass = hasStatus
    ? selectedOnline
      ? selectedStale
        ? "stale"
        : "online"
      : "offline"
    : "unknown";

  return (
    <Dropdown className="boat-selector">
      <Dropdown.Toggle variant="outline-light" className="boat-selector-toggle">
        <span className={`status-dot mini ${selectedDotClass}`} />
        <span>{selectedBoat?.name || "Select boat"}</span>
      </Dropdown.Toggle>
      <Dropdown.Menu className="boat-selector-menu">
        {boats.map((boat) => {
          const status = boatStatusById[boat.id];
          const hasBoatStatus = Boolean(status);
          const isOnline = status?.apiOnline;
          const isStale = status?.isStale;
          const dotClass = hasBoatStatus
            ? isOnline
              ? isStale
                ? "stale"
                : "online"
              : "offline"
            : "unknown";
          return (
            <Dropdown.Item
              key={boat.id}
              onClick={() => setSelectedBoatId(boat.id)}
              active={boat.id === selectedBoatId}
              className="boat-selector-item"
            >
              <span className={`status-dot mini ${dotClass}`} />
              <span className="boat-selector-name">{boat.name}</span>
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
}
