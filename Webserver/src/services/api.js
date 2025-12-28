export const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const requestJson = async (path, options = {}) => {
  const response = await fetch(`${API_BASE}${path}`, options);
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = data?.error || data?.message || `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
};

export async function fetchBoats() {
  return requestJson("/api/boats");
}

export async function fetchBoatState(boatId) {
  return requestJson(`/api/boats/${encodeURIComponent(boatId)}/state`, {
    cache: "no-store",
  });
}

export async function fetchBoatHistory(boatId, options = {}) {
  const params = new URLSearchParams();
  if (options.sensors) {
    params.set("sensors", "1");
  }
  if (options.gps) {
    params.set("gps", "1");
  }
  if (options.limit) {
    params.set("limit", String(options.limit));
  }
  const query = params.toString();
  return requestJson(`/api/boats/${encodeURIComponent(boatId)}/history${query ? `?${query}` : ""}`);
}

export async function sendControl(boatId, action, payload) {
  return requestJson(`/api/boats/${encodeURIComponent(boatId)}/control`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, payload }),
  });
}

export async function fetchAck(boatId, cmdId) {
  return requestJson(
    `/api/boats/${encodeURIComponent(boatId)}/acks/${encodeURIComponent(cmdId)}`
  );
}

export async function fetchVideoInfo(boatId) {
  return requestJson(`/api/boats/${encodeURIComponent(boatId)}/video/info`);
}
