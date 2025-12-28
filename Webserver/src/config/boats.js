export const BOATS = [
  {
    id: "boat1",
    name: "SeaGuard Alpha",
    description: "Main patrol boat",
    apiBase: "http://192.168.1.50:3000",
    mqttControlPrefix: "seaguard/boat1/control",
    dataEndpoint: "/data",
    video: {
      type: "hls",
      url: "http://192.168.1.50:8080/hls/stream.m3u8",
    },
    home: { lat: 23.61, lon: 58.59 },
  },
  {
    id: "boat2",
    name: "SeaGuard Beta",
    description: "Backup unit",
    apiBase: "http://192.168.1.51:3000",
    dataEndpoint: "/data",
    video: {
      type: "mjpeg",
      url: "http://192.168.1.51:81/stream",
    },
    home: { lat: 23.62, lon: 58.6 },
  },
];
