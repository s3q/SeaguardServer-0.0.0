import { useEffect, useMemo, useState } from "react";
import { fetchSensorData } from "../services/api";
import { useBoat } from "../context/BoatContext";

const DEFAULT_POLL_INTERVAL = 2000;

export default function useBoatTelemetry(boat, pollInterval = DEFAULT_POLL_INTERVAL) {
  const [sensorData, setSensorData] = useState(null);
  const [lastTelemetryAt, setLastTelemetryAt] = useState(null);
  const [lastCheckedAt, setLastCheckedAt] = useState(null);
  const [apiOnline, setApiOnline] = useState(false);
  const [apiError, setApiError] = useState(null);
  const { updateBoatStatus } = useBoat();

  useEffect(() => {
    setSensorData(null);
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
        const data = await fetchSensorData(boat);
        if (!isMounted) {
          return;
        }
        setApiOnline(true);
        setApiError(null);
        setLastCheckedAt(new Date());

        if (data) {
          setSensorData(data);
          setLastTelemetryAt(new Date());
        } else {
          setSensorData(null);
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
    updateBoatStatus(boat.id, {
      apiOnline,
      apiError,
      lastTelemetryAt,
      lastCheckedAt,
      isStale,
    });
  }, [
    boat?.id,
    apiOnline,
    apiError,
    lastTelemetryAt,
    lastCheckedAt,
    isStale,
    updateBoatStatus,
  ]);

  return {
    sensorData,
    lastTelemetryAt,
    lastCheckedAt,
    apiOnline,
    apiError,
    isStale,
  };
}
