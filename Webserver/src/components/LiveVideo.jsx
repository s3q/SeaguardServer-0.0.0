import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { API_BASE, fetchVideoInfo } from "../services/api";
import "../css/dashboard.css";

export default function LiveVideo({ boat }) {
  const videoRef = useRef(null);
  const [hasError, setHasError] = useState(false);
  const [streamInfo, setStreamInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const type = streamInfo?.type || boat?.video?.type || "mp4";
  const url = streamInfo?.url || boat?.video?.url;

  useEffect(() => {
    setHasError(false);
  }, [boat?.id, url, type]);

  useEffect(() => {
    let isMounted = true;

    const loadVideoInfo = async () => {
      if (!boat?.id) {
        setStreamInfo(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const info = await fetchVideoInfo(boat.id);
        if (!isMounted) {
          return;
        }
        const resolvedUrl =
          info?.mode === "redirect"
            ? `${API_BASE}/api/boats/${boat.id}/video/${info.type}`
            : info?.url;

        setStreamInfo({
          type: info?.type || boat?.video?.type,
          url: resolvedUrl || info?.url || boat?.video?.url,
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }
        if (boat?.video) {
          setStreamInfo({
            type: boat.video.type,
            url: boat.video.url,
          });
        } else {
          setStreamInfo(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadVideoInfo();
    return () => {
      isMounted = false;
    };
  }, [boat?.id, boat?.video?.type, boat?.video?.url]);

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
        {!url && !isLoading && <div className="video-overlay">No video source</div>}
        {isLoading && <div className="video-overlay">Loading stream...</div>}
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
