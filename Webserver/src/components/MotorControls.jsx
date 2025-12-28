import React, { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { buildControlTopic, sendControl } from "../services/api";
import { useBoat } from "../context/BoatContext";
import "../css/dashboard.css";

const SPEEDS = ["SLOW", "MED", "FAST"];

export default function MotorControls() {
  const { selectedBoat } = useBoat();
  const [speed, setSpeed] = useState("SLOW");
  const [lastCommand, setLastCommand] = useState(null);
  const [status, setStatus] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const isDisabled = isSending || !selectedBoat;

  const handleSend = async (direction) => {
    const topic = buildControlTopic(selectedBoat, direction);
    const cmd = direction === "stop" ? "STOP" : speed;

    setIsSending(true);
    setStatus(null);

    try {
      await sendControl(selectedBoat, topic, cmd);
      setLastCommand(`${direction.toUpperCase()} - ${cmd}`);
      setStatus({ variant: "success", message: "Command sent successfully." });
    } catch (error) {
      setStatus({
        variant: "danger",
        message: error?.message || "Failed to send command.",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="motor-controls">
      <div className="spcard control-panel">
        <div className="control-top">
          <div>
            <div className="sensor-label">Speed</div>
            <Form.Select
              className="speed-select"
              value={speed}
              onChange={(event) => setSpeed(event.target.value)}
              disabled={isDisabled}
            >
              {SPEEDS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Form.Select>
          </div>
          <Button
            variant="danger"
            className="stop-button sticky-stop"
            onClick={() => handleSend("stop")}
            disabled={isDisabled}
          >
            STOP
          </Button>
        </div>

        <div className="controls-grid">
          <Button
            variant="outline-light"
            onClick={() => handleSend("forward")}
            disabled={isDisabled}
          >
            Forward
          </Button>
          <Button
            variant="outline-light"
            onClick={() => handleSend("left")}
            disabled={isDisabled}
          >
            Left
          </Button>
          <Button
            variant="outline-light"
            onClick={() => handleSend("right")}
            disabled={isDisabled}
          >
            Right
          </Button>
          <Button
            variant="outline-light"
            onClick={() => handleSend("back")}
            disabled={isDisabled}
          >
            Backward
          </Button>
        </div>

        {status && (
          <Alert
            variant={status.variant}
            className="control-alert"
            dismissible
            onClose={() => setStatus(null)}
          >
            {status.message}
          </Alert>
        )}

        <div className="command-log">
          <div className="sensor-label">Last Command</div>
          <div className="command-value">{lastCommand || "No commands yet."}</div>
        </div>
      </div>
    </div>
  );
}
