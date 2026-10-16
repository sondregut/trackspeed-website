"use client";

import {PauseIcon, PlayIcon} from "@radix-ui/react-icons";
import {useEffect, useRef, useState} from "react";

type VideoSource = {src: string; type: string};
type Choice = "auto" | "play" | "pause";

/**
 * A muted, looping clip that plays only while visible. With reduced motion the
 * poster stays until the viewer presses play; a visible toggle always allows pausing.
 */
export default function LoopingVideo({
  sources,
  poster,
  width,
  height,
  label,
  playLabel,
  pauseLabel,
  eager = false,
  className = "",
  videoClassName = "",
}: {
  sources: VideoSource[];
  poster: string;
  width: number;
  height: number;
  label: string;
  playLabel: string;
  pauseLabel: string;
  eager?: boolean;
  className?: string;
  videoClassName?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const choice = useRef<Choice>("auto");
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const sync = () => {
      const shouldPlay = visible && (choice.current === "play" || (choice.current === "auto" && !reducedMotion.matches));
      if (shouldPlay) video.play().catch(() => setPlaying(false));
      else video.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, {threshold: 0.2});
    observer.observe(video);
    reducedMotion.addEventListener("change", sync);
    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener("change", sync);
    };
  }, []);

  const toggle = () => {
    choice.current = playing ? "pause" : "play";
    const video = videoRef.current;
    if (!video) return;
    if (playing) video.pause();
    else video.play().catch(() => setPlaying(false));
  };

  return <div className={`looping-video ${className}`}>
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      disablePictureInPicture
      preload={eager ? "metadata" : "none"}
      poster={poster}
      width={width}
      height={height}
      aria-label={label}
      className={videoClassName}
      onPlay={() => setPlaying(true)}
      onPause={() => setPlaying(false)}
    >
      {sources.map(source => <source key={source.src} src={source.src} type={source.type}/>)}
    </video>
    <button type="button" className="video-toggle" onClick={toggle} aria-label={playing ? pauseLabel : playLabel}>
      {playing ? <PauseIcon aria-hidden="true"/> : <PlayIcon aria-hidden="true"/>}
    </button>
  </div>;
}
