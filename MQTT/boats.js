module.exports = [
  {
    id: "default",
    name: "SeaGuard Default",
    description: "Legacy default boat",
    video: {
      type: "mjpeg",
      url: "http://192.168.1.50:81/stream",
    },
    home: { lat: 23.61, lon: 58.59 },
  },
  {
    id: "boat1",
    name: "SeaGuard Alpha",
    description: "Main patrol boat",
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
    video: {
      type: "mjpeg",
      url: "http://192.168.1.51:81/stream",
    },
    home: { lat: 23.62, lon: 58.6 },
  },
];
