import React, { createContext, useContext, useMemo, useState } from "react";
import { BOATS } from "../config/boats";

const BoatContext = createContext(null);

const getInitialBoatId = () => {
  if (typeof window === "undefined") {
    return BOATS[0]?.id;
  }
  const saved = localStorage.getItem("selectedBoatId");
  return saved || BOATS[0]?.id;
};

export function BoatProvider({ children }) {
  const [selectedBoatId, setSelectedBoatIdState] = useState(getInitialBoatId);
  const [boatStatusById, setBoatStatusById] = useState({});

  const selectedBoat = useMemo(
    () => BOATS.find((boat) => boat.id === selectedBoatId) || BOATS[0],
    [selectedBoatId]
  );

  const setSelectedBoatId = (boatId) => {
    if (!boatId) {
      return;
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedBoatId", boatId);
    }
    setSelectedBoatIdState(boatId);
  };

  const updateBoatStatus = (boatId, status) => {
    if (!boatId) {
      return;
    }
    setBoatStatusById((prev) => ({
      ...prev,
      [boatId]: { ...prev[boatId], ...status },
    }));
  };

  const value = useMemo(
    () => ({
      boats: BOATS,
      selectedBoatId,
      selectedBoat,
      setSelectedBoatId,
      boatStatusById,
      updateBoatStatus,
    }),
    [selectedBoatId, selectedBoat, boatStatusById]
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
