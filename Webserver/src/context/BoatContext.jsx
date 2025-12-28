import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { BOATS } from "../config/boats";
import { fetchBoats } from "../services/api";

const BoatContext = createContext(null);

const getInitialBoatId = () => {
  if (typeof window === "undefined") {
    return BOATS[0]?.id;
  }
  const saved = localStorage.getItem("selectedBoatId");
  return saved || BOATS[0]?.id;
};

export function BoatProvider({ children }) {
  const fallbackMap = useMemo(
    () => new Map(BOATS.map((boat) => [boat.id, boat])),
    []
  );
  const [boats, setBoats] = useState(BOATS);
  const [selectedBoatId, setSelectedBoatIdState] = useState(getInitialBoatId);
  const [boatStatusById, setBoatStatusById] = useState({});

  const selectedBoat = useMemo(
    () => boats.find((boat) => boat.id === selectedBoatId) || boats[0],
    [boats, selectedBoatId]
  );

  const setSelectedBoatId = useCallback((boatId) => {
    if (!boatId) {
      return;
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedBoatId", boatId);
    }
    setSelectedBoatIdState(boatId);
  }, []);

  const updateBoatStatus = useCallback((boatId, status) => {
    if (!boatId) {
      return;
    }
    setBoatStatusById((prev) => ({
      ...prev,
      [boatId]: { ...prev[boatId], ...status },
    }));
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadBoats = async () => {
      try {
        const data = await fetchBoats();
        if (!isMounted) {
          return;
        }
        const apiBoats = Array.isArray(data?.boats) ? data.boats : [];

        if (apiBoats.length === 0) {
          setBoats(BOATS);
          return;
        }

        const nextBoats = apiBoats.map((boat) => {
          const id = boat.boatId || boat.id;
          const fallback = fallbackMap.get(id);
          return {
            id,
            name: boat.name || fallback?.name || id,
            description: boat.description || fallback?.description || "",
            home: fallback?.home,
            video: fallback?.video,
          };
        });

        setBoats(nextBoats);

        setBoatStatusById((prev) => {
          const next = { ...prev };
          apiBoats.forEach((boat) => {
            const id = boat.boatId || boat.id;
            next[id] = {
              ...next[id],
              apiOnline: Boolean(boat.online),
              lastSeen: boat.lastSeen ? new Date(boat.lastSeen) : next[id]?.lastSeen || null,
            };
          });
          return next;
        });

        if (!nextBoats.find((boat) => boat.id === selectedBoatId)) {
          setSelectedBoatId(nextBoats[0]?.id);
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }
        setBoats(BOATS);
      }
    };

    loadBoats();
    const intervalId = setInterval(loadBoats, 10000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [fallbackMap, selectedBoatId]);

  const value = useMemo(
    () => ({
      boats,
      selectedBoatId,
      selectedBoat,
      setSelectedBoatId,
      boatStatusById,
      updateBoatStatus,
    }),
    [boats, selectedBoatId, selectedBoat, boatStatusById]
  );

  return <BoatContext.Provider value={value}>{children}</BoatContext.Provider>;
}

export function useBoat() {
  const context = useContext(BoatContext);
  if (!context) {
    throw new Error("useBoat must be used within BoatProvider");
  }
  return context;
}
