import React, { useEffect, useRef, useState } from "react";
import AudioController from "./AudioController";
import { getAudioColors } from "../../../constants/color";

type Peak = { max: number; min: number };

async function getMaxMinPeaks(
  audioUrl: string,
  targetLength = 400
): Promise<Peak[]> {
  const context = new OfflineAudioContext(1, 44100 * 40, 44100);
  const response = await fetch(audioUrl);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await context.decodeAudioData(arrayBuffer);

  const data = audioBuffer.getChannelData(0);
  const sampleSize = Math.floor(data.length / targetLength);
  const peakArray: Peak[] = [];

  for (let i = 0; i < targetLength; i++) {
    const start = i * sampleSize;
    const segment = data.slice(start, start + sampleSize);
    let max = -Infinity,
      min = Infinity;

    for (let j = 0; j < segment.length; j++) {
      const v = segment[j];
      if (v > max) max = v;
      if (v < min) min = v;
    }

    peakArray.push({ max, min });
  }

  return peakArray;
}

interface AudioWaveformProps {
  audioUrl: string;
  audioTitle?: string;
  mode?: "dark" | "light" | "transparent";
  waveVisible?: boolean;
  layoutDirection?:"row" | "col";
}

export default function AudioWaveform({
  audioUrl,
  audioTitle = "",
  mode = "light",
  waveVisible = true,
  layoutDirection="col",
}: AudioWaveformProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationId = useRef<number>(-1);
  const [peaks, setPeaks] = useState<Peak[]>([]);

  // 컨트롤러용 상태
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);

  const colors = getAudioColors(mode);
  // 1. 오디오 로드 후 peaks 계산
  useEffect(() => {
    getMaxMinPeaks(audioUrl, 400).then(setPeaks);
  }, [audioUrl]);

  // 2. peaks 기반으로 캔버스 그리고, 재생 위치 표시 (기존 코드 유지)
  useEffect(() => {
    if (!canvasRef.current || peaks.length === 0 || !audioRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    const audio = audioRef.current;
    const colors = getAudioColors(mode);

    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    function draw() {
      animationId.current = requestAnimationFrame(draw);

      ctx.clearRect(0, 0, WIDTH, HEIGHT);

      ctx.fillStyle = colors.background;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      if (audio.duration <= 0) return;

      const playRatio = audio.currentTime / audio.duration;
      const playedCount = Math.floor(playRatio * peaks.length);

      ctx.strokeStyle = colors.playedWave;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < playedCount; i++) {
        const x = (i / peaks.length) * WIDTH + 0.5;
        const yMax = HEIGHT / 2 + peaks[i].max * (HEIGHT / 2);
        const yMin = HEIGHT / 2 + peaks[i].min * (HEIGHT / 2);

        ctx.moveTo(x, yMax);
        ctx.lineTo(x, yMin);
      }
      ctx.stroke();

      ctx.strokeStyle = colors.unplayedWave;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = playedCount; i < peaks.length; i++) {
        const x = (i / peaks.length) * WIDTH + 0.5;
        const yMax = HEIGHT / 2 + peaks[i].max * (HEIGHT / 2);
        const yMin = HEIGHT / 2 + peaks[i].min * (HEIGHT / 2);

        ctx.moveTo(x, yMax);
        ctx.lineTo(x, yMin);
      }
      ctx.stroke();

      const playX = playRatio * WIDTH + 0.5;

      ctx.strokeStyle = colors.cursor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(playX, 0);
      ctx.lineTo(playX, HEIGHT);
      ctx.stroke();
    }

    draw();

    return () => {
      if (animationId.current) cancelAnimationFrame(animationId.current);
    };
  }, [peaks, mode]);

  // 캔버스 클릭 시 재생 위치 이동
  useEffect(() => {
    const canvas = canvasRef.current;
    const audio = audioRef.current;
    if (!canvas || !audio) return;

    function handleClick(event: MouseEvent) {
      const canvas = canvasRef.current;
      const audio = audioRef.current;
      if (!canvas || !audio) return;

      const rect = canvas.getBoundingClientRect();
      if (!rect) return;

      const clickX = event.clientX - rect.left;
      const ratio = clickX / canvas.width;

      if (audio.duration > 0) {
        audio.currentTime = ratio * audio.duration;
      }
    }

    canvas.addEventListener("click", handleClick);
    return () => {
      canvas.removeEventListener("click", handleClick);
    };
  }, []);

  // 오디오 이벤트로 재생 상태, 시간, 볼륨 등 업데이트
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onVolumeChange = () => {
      setVolume(audio.volume);
      setIsMuted(audio.volume === 0);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("volumechange", onVolumeChange);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("volumechange", onVolumeChange);
    };
  }, []);

  // 컨트롤러에 넘길 핸들러들
  const handleSeek = (time: number) => {
    if (audioRef.current) audioRef.current.currentTime = time;
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) audioRef.current.play();
    else audioRef.current.pause();
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleSkip = (seconds: number) => {
    if (audioRef.current) {
      let newTime = audioRef.current.currentTime + seconds;
      if (newTime < 0) newTime = 0;
      if (newTime > audioRef.current.duration)
        newTime = audioRef.current.duration;
      audioRef.current.currentTime = newTime;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;

    if (isMuted) {
      audioRef.current.volume = 1;
    } else {
      audioRef.current.volume = 0;
    }
  };

  const handleVolumeChange = (vol: number) => {
    if (audioRef.current) audioRef.current.volume = vol;
  };

  return (
    <div
      className={`flex ${
        layoutDirection == "row" ? "flex-row items-center" : "flex-col"
      }
      w-[100%] p-5 h-[100%]
      `}
      style={{ backgroundColor: colors.background }}
    >
      <audio ref={audioRef} controls={false} src={audioUrl} />
      
      {waveVisible && (
        <canvas
          ref={canvasRef}
          width={400}
          height={150}
          className="w-full block cursor-pointer"
        />
      )}

      <AudioController
        audioTitle={audioTitle}
        currentTime={currentTime}
        duration={duration}
        isPlaying={isPlaying}
        isMuted={isMuted}
        volume={volume}
        onSeek={handleSeek}
        onPlayPause={handlePlayPause}
        onStop={handleStop}
        onSkip={handleSkip}
        onToggleMute={toggleMute}
        onVolumeChange={handleVolumeChange}
        mode={mode}
      />
    </div>
  );
}
