import { useEffect, useMemo, useState } from "react";
import { fetchBoatState } from "../services/api";
import { useBoat } from "../context/BoatContext";

const DEFAULT_POLL_INTERVAL = 2000;

export default function useBoatTelemetry(boat, pollInterval = DEFAULT_POLL_INTERVAL) {
  const [boatState, setBoatState] = useState(null);
  const [lastTelemetryAt, setLastTelemetryAt] = useState(null);
  const [lastCheckedAt, setLastCheckedAt] = useState(null);
  const [apiOnline, setApiOnline] = useState(false);
  const [apiError, setApiError] = useState(null);
  const { updateBoatStatus } = useBoat();

  useEffect(() => {
    setBoatState(null);
    setLastTelemetryAt(null);
    setLastCheckedAt(null);
    setApiOnline(false);
    setApiError(null);
  }, [boat?.id]);

  useEffect(() => {
    if (!boat) {
      return;
    }

    let isMounted = true;

    const poll = async () => {
      try {
        const data = await fetchBoatState(boat.id);
        if (!isMounted) {
          return;
        }
        setApiOnline(true);
        setApiError(null);
        setLastCheckedAt(new Date());

        if (data) {
          setBoatState(data);
          const lastSeen = data.lastSeen ? new Date(data.lastSeen) : null;
          const sensorTimestamp = data.sensors?.timestamp;
          const gpsTimestamp = data.gps?.timestamp;
          const derivedTimestamp = sensorTimestamp || gpsTimestamp;
          const telemetryTime = lastSeen
            ? lastSeen
            : derivedTimestamp
              ? new Date(
                  Number(derivedTimestamp) < 1000000000000
                    ? Number(derivedTimestamp) * 1000
                    : Number(derivedTimestamp)
                )
              : null;
          setLastTelemetryAt(telemetryTime);
        } else {
          setBoatState(null);
          setLastTelemetryAt(null);
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }
        setApiOnline(false);
        setApiError(error?.message || "API unreachable");
        setLastCheckedAt(new Date());
      }
    };

    poll();
    const intervalId = setInterval(poll, pollInterval);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [boat?.id, pollInterval]);

  const isStale = useMemo(() => {
    if (!lastTelemetryAt) {
      return false;
    }
    return Date.now() - lastTelemetryAt.getTime() > pollInterval * 3;
  }, [lastTelemetryAt, pollInterval]);

  useEffect(() => {
    if (!boat?.id) {
      return;
    }
    const lastSeen =
      boatState?.lastSeen !== undefined && boatState?.lastSeen !== null
        ? new Date(boatState.lastSeen)
        : null;
    updateBoatStatus(boat.id, {
      apiOnline,
      apiError,
      lastTelemetryAt,
      lastCheckedAt,
      isStale,
      lastSeen,
    });
  }, [
    boat?.id,
    apiOnline,
    apiError,
    lastTelemetryAt,
    lastCheckedAt,
    isStale,
    boatState?.lastSeen,
    updateBoatStatus,
  ]);

  return {
    boatState,
    lastTelemetryAt,
    lastCheckedAt,
    apiOnline,
    apiError,
    isStale,
  };
}
