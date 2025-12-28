const DEFAULT_API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const resolveApiBase = (boat) => boat?.apiBase || DEFAULT_API_BASE;

export const buildControlTopic = (boat, direction) => {
  if (!direction) {
    return "";
  }
  if (boat?.mqttControlPrefix) {
    return `${boat.mqttControlPrefix}/${direction}`;
  }
  return `seaguard/control/${direction}`;
};

export async function fetchSensorData(boat) {
  const apiBase = resolveApiBase(boat);
  const endpoint = boat?.dataEndpoint || "/data";
  const response = await fetch(`${apiBase}${endpoint}`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return data ?? null;
}

export async function sendControl(boat, topic, cmd) {
  if (!topic) {
    throw new Error("Control topic is required.");
  }

  const apiBase = resolveApiBase(boat);
  const safeCmd = encodeURIComponent(cmd);
  const response = await fetch(`${apiBase}/control/${topic}/${safeCmd}`);

  if (!response.ok) {
    throw new Error(`Control error: ${response.status}`);
  }

  try {
    return await response.json();
  } catch (error) {
    return null;
  }
}
