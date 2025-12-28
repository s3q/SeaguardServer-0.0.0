import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import "../css/dashboard.css";

export default function LiveVideo({ boat }) {
  const videoRef = useRef(null);
  const [hasError, setHasError] = useState(false);

  const stream = boat?.video;
  const type = stream?.type || "mp4";
  const url = stream?.url;

  useEffect(() => {
    setHasError(false);
  }, [boat?.id, url, type]);

  useEffect(() => {
    if (!url || type !== "hls" || !videoRef.current) {
      return;
    }

    const video = videoRef.current;
    let hls;

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, () => setHasError(true));
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
    } else {
      setHasError(true);
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [url, type]);

  return (
    <div className="spcard video-card">
      <div className="video-header">
        <div className="sensor-label">Live Video</div>
        <div className="status-meta">
          {boat?.name ? `Camera feed: ${boat.name}` : "Camera feed"}
        </div>
      </div>
      <div className="video-frame">
        {!url && <div className="video-overlay">No video source</div>}
        {url && type === "mjpeg" && (
          <img
            src={url}
            alt={`${boat?.name || "Boat"} live feed`}
            className="video-mjpeg"
            onError={() => setHasError(true)}
          />
        )}
        {url && type !== "mjpeg" && (
          <video
            ref={videoRef}
            className="video-player"
            controls
            muted
            autoPlay
            playsInline
            onError={() => setHasError(true)}
          >
            {type !== "hls" && <source src={url} />}
          </video>
        )}
        {hasError && <div className="video-overlay">Video offline</div>}
      </div>
    </div>
  );
}
