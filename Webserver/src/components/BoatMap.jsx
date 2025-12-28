import React, { useMemo, useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "../css/dashboard.css";

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

const pickValue = (data, keys) => {
  if (!data) {
    return undefined;
  }
  for (const key of keys) {
    if (data[key] !== undefined && data[key] !== null) {
      return data[key];
    }
  }
  return undefined;
};

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

function MapUpdater({ center }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true });
  }, [map, center]);

  return null;
}

export default function BoatMap({ boat, data, lastUpdated, mapKey }) {
  const [mapInstance, setMapInstance] = useState(null);
  const gps = useMemo(() => {
    const nestedGps =
      data?.gps && typeof data.gps === "object" ? data.gps : undefined;
    const lat =
      pickValue(data, ["lat", "latitude"]) ??
      (nestedGps ? pickValue(nestedGps, ["lat", "latitude"]) : undefined);
    const lon =
      pickValue(data, ["lon", "lng", "longitude"]) ??
      (nestedGps ? pickValue(nestedGps, ["lon", "lng", "longitude"]) : undefined);

    const latNum = toNumber(lat);
    const lonNum = toNumber(lon);
    return { lat: latNum, lon: lonNum };
  }, [data]);

  const center = useMemo(() => {
    if (gps.lat !== null && gps.lon !== null) {
      return [gps.lat, gps.lon];
    }
    if (
      typeof boat?.home?.lat === "number" &&
      typeof boat?.home?.lon === "number"
    ) {
      return [boat.home.lat, boat.home.lon];
    }
    return [0, 0];
  }, [gps, boat]);

  const showMarker = gps.lat !== null && gps.lon !== null;

  useEffect(() => {
    return () => {
      if (mapInstance) {
        mapInstance.off();
        mapInstance.remove();
      }
    };
  }, [mapInstance]);

  return (
    <div className="spcard map-card">
      <div className="map-header">
        <div className="sensor-label">Boat Position</div>
        <div className="status-meta">
          {lastUpdated ? `Last update: ${lastUpdated}` : "Awaiting GPS data"}
        </div>
      </div>
      <div className="map-frame">
        {/*<MapContainer
          key={mapKey || `${boat?.id || "boat"}-${center.join(",")}`}
          center={center}
          zoom={13}
          scrollWheelZoom={false}
          whenCreated={setMapInstance}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapUpdater center={center} />
          {showMarker && (
            <Marker position={center}>
              <Popup>
                <div className="map-popup-title">{boat?.name || "Boat"}</div>
                <div className="map-popup-sub">
                  {gps.lat}, {gps.lon}
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>*/}
        {!showMarker && <div className="map-overlay">No GPS yet</div>}
      </div>
    </div>
  );
}
