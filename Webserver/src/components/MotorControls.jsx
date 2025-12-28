import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { fetchAck, sendControl } from "../services/api";
import { useBoat } from "../context/BoatContext";
import "../css/dashboard.css";

const SPEEDS = ["SLOW", "MED", "FAST"];
const ACK_POLL_INTERVAL_MS = 600;
const ACK_TIMEOUT_MS = 6000;

export default function MotorControls() {
  const { selectedBoat } = useBoat();
  const [speed, setSpeed] = useState("SLOW");
  const [lastCommand, setLastCommand] = useState(null);
  const [commandStatus, setCommandStatus] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const isDisabled = isSending || !selectedBoat;
  const requestRef = useRef(0);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    setLastCommand(null);
    setCommandStatus(null);
  }, [selectedBoat?.id]);

  const pollForAck = async (boatId, cmdId, requestId) => {
    const startedAt = Date.now();

    while (Date.now() - startedAt < ACK_TIMEOUT_MS) {
      await new Promise((resolve) => setTimeout(resolve, ACK_POLL_INTERVAL_MS));

      if (!isMountedRef.current || requestId !== requestRef.current) {
        return null;
      }

      try {
        const ack = await fetchAck(boatId, cmdId);
        if (ack?.status && ack.status !== "pending") {
          return ack;
        }
      } catch (error) {
        return { status: "fail", reason: error?.message || "Ack fetch failed" };
      }
    }

    return { status: "timeout" };
  };

  const handleSend = async (direction) => {
    const cmd = direction === "stop" ? "STOP" : speed;
    const requestId = requestRef.current + 1;
    requestRef.current = requestId;

    setIsSending(true);
    setCommandStatus({
      state: "pending",
      message: "Sending command...",
    });

    try {
      const response = await sendControl(selectedBoat.id, direction, cmd);
      const cmdId = response?.cmdId;
      setLastCommand(`${direction.toUpperCase()} - ${cmd}`);
      setCommandStatus({
        state: "pending",
        message: "Command sent. Awaiting ACK...",
      });

      if (cmdId) {
        const ack = await pollForAck(selectedBoat.id, cmdId, requestId);
        if (!isMountedRef.current || requestId !== requestRef.current) {
          return;
        }
        if (ack?.status === "ok" || ack?.ok === true) {
          setCommandStatus({
            state: "ok",
            message: "Command acknowledged.",
          });
        } else if (ack?.status === "fail" || ack?.ok === false) {
          setCommandStatus({
            state: "fail",
            message: ack?.reason || "Command failed.",
          });
        } else if (ack?.status === "timeout") {
          setCommandStatus({
            state: "timeout",
            message: "ACK timeout.",
          });
        } else {
          setCommandStatus({
            state: "ok",
            message: "ACK received.",
          });
        }
      }
    } catch (error) {
      setCommandStatus({
        state: "fail",
        message: error?.message || "Failed to send command.",
      });
    } finally {
      setIsSending(false);
    }
  };

  const alertVariant =
    commandStatus?.state === "ok"
      ? "success"
      : commandStatus?.state === "pending"
        ? "warning"
        : commandStatus?.state === "timeout"
          ? "secondary"
          : "danger";

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

        {commandStatus && (
          <Alert
            variant={alertVariant}
            className="control-alert"
            dismissible
            onClose={() => setCommandStatus(null)}
          >
            {commandStatus.message}
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
