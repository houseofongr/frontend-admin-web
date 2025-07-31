import React, { useEffect, useRef, useState } from "react";
import AudioController from "./AudioController";
import { getAudioColors } from "../../../constants/color";
import { MdOutlineColorLens } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import { RiResetLeftLine } from "react-icons/ri";

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
  layoutDirection?: "row" | "col";
}

export default function AudioWaveform({
  audioUrl,
  audioTitle = "",
  mode = "light",
  waveVisible = true,
  layoutDirection = "col",
}: AudioWaveformProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationId = useRef<number>(-1);

  const [peaks, setPeaks] = useState<Peak[]>([]);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // 오디오 상태
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);

  // 색상 관련 상태
  // 🎨 색상 관련 상태
  const [pickedPlayedColor, setPickedPlayedColor] = useState<string | null>(
    null
  );
  const [pickedCursorColor, setPickedCursorColor] = useState<string | null>(
    null
  );
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [setupPickedColor, setSetupPickedColor] = useState(false);
  const colors = getAudioColors(mode);

  // 오디오 로드 후 peaks 계산
  useEffect(() => {
    getMaxMinPeaks(audioUrl, 400).then(setPeaks);
  }, [audioUrl]);

  useEffect(() => {
    const updateCanvasSize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const containerWidth = container.clientWidth;
      const aspectRatio = 400 / 150;

      const canvasWidth = containerWidth;
      const canvasHeight = containerWidth / aspectRatio;

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      canvas.style.width = `${canvasWidth}px`;
      canvas.style.height = `${canvasHeight}px`;

      setCanvasSize({ width: canvasWidth, height: canvasHeight });
    };

    updateCanvasSize();

    const handleResize = () => {
      updateCanvasSize();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // peaks 기반으로 캔버스 그리고, 재생 위치 표시 (canvasSize 변경시에도 리렌더링)
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

      // 캔버스 크기에 비례한 선 굵기 계산 (기준: 400px일 때 1px)
      const lineWidth = Math.max(1, WIDTH / 400);

      // 재생된 부분
      ctx.strokeStyle =
        pickedPlayedColor == null ? colors.playedWave : pickedPlayedColor;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      for (let i = 0; i < playedCount; i++) {
        const x = (i / peaks.length) * WIDTH + 0.5;
        const yMax = HEIGHT / 2 + peaks[i].max * (HEIGHT / 2);
        const yMin = HEIGHT / 2 + peaks[i].min * (HEIGHT / 2);

        ctx.moveTo(x, yMax);
        ctx.lineTo(x, yMin);
      }
      ctx.stroke();

      // 재생되지 않은 부분
      ctx.strokeStyle = colors.unplayedWave;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      for (let i = playedCount; i < peaks.length; i++) {
        const x = (i / peaks.length) * WIDTH + 0.5;
        const yMax = HEIGHT / 2 + peaks[i].max * (HEIGHT / 2);
        const yMin = HEIGHT / 2 + peaks[i].min * (HEIGHT / 2);

        ctx.moveTo(x, yMax);
        ctx.lineTo(x, yMin);
      }
      ctx.stroke();

      // 재생 커서
      const playX = playRatio * WIDTH + 0.5;
      ctx.strokeStyle =
        pickedCursorColor == null ? colors.cursor : pickedCursorColor;
      ctx.lineWidth = lineWidth * 1; // 커서는 조금 더 굵게
      ctx.beginPath();
      ctx.moveTo(playX, 0);
      ctx.lineTo(playX, HEIGHT);
      ctx.stroke();
    }

    draw();

    if (setupPickedColor) setSetupPickedColor(false);

    return () => {
      if (animationId.current) cancelAnimationFrame(animationId.current);
    };
  }, [peaks, mode, canvasSize, setupPickedColor]); // canvasSize 의존성 추가

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

  const handleApplyColors = () => {
    setPickedCursorColor((prev) => pickedCursorColor ?? prev);
    setPickedPlayedColor((prev) => pickedPlayedColor ?? prev);
    setShowColorPicker(false); // 닫기
    setSetupPickedColor(true);
  };
  const handleResetColors = () => {
    setPickedCursorColor(colors.cursor);
    setPickedPlayedColor(colors.playedWave);
  };
  function hexToRgba(hex: string, alpha: number = 1) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  return (
    <div
      className="relative w-full h-full group"
      style={{ backgroundColor: colors.background }}
    >
      <div
        className="z-10 absolute cursor-pointer top-2 left-2 w-7 h-7 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity  duration-300 hover:opacity-70"
        onClick={() => setShowColorPicker((prev) => !prev)}
      >
        <MdOutlineColorLens size={20} color="white" />
      </div>

      {/* 🎨 색상 선택 UI */}
      {showColorPicker && (
        <div className="z-20 absolute top-11 left-5 bg-white p-3 rounded shadow flex flex-row justify-between gap-2 w-40 text-sm">
          <label>
            <span className="text-gray-600">Wave</span>
            <input
              type="color"
              className="w-full mt-1"
              value={(pickedPlayedColor ?? colors.playedWave).slice(0, 7)}
              onChange={(e) => setPickedPlayedColor(e.target.value)}
            />
          </label>
          <label>
            <span className="text-gray-600">Cursor</span>
            <input
              type="color"
              className="w-full mt-1"
              value={(pickedCursorColor ?? colors.cursor).slice(0, 7)}
              onChange={(e) => setPickedCursorColor(e.target.value)}
            />
          </label>
          <div className="flex flex-col justify-between">
            <div
              className="cursor-pointer hover:opacity-70"
              onClick={handleResetColors}
            >
              <RiResetLeftLine size={20} />
            </div>
            <div
              className="cursor-pointer hover:opacity-70"
              onClick={handleApplyColors}
            >
              <FaCheck size={20} />
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col w-full h-full px-7 py-5">
        <audio ref={audioRef} controls={false} src={audioUrl} />

        {waveVisible && (
          <div ref={containerRef} className="flex-1 min-h-0">
            <canvas
              ref={canvasRef}
              className="w-full block cursor-pointer"
              style={{ maxHeight: "100%" }}
            />
          </div>
        )}
        <div className="flex-1">
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
      </div>
    </div>
    // <div
    //   className={`flex ${
    //     layoutDirection == "row" ? "flex-row items-center" : "flex-col"
    //   }
    //   w-[100%] p-5 h-[100%]
    //   `}
    //   style={{ backgroundColor: colors.background }}
    // >
    //   <audio ref={audioRef} controls={false} src={audioUrl} />

    //   {waveVisible && (
    //     <canvas
    //       ref={canvasRef}
    //       width={400}
    //       height={150}
    //       className="w-full block cursor-pointer"
    //     />
    //   )}

    //   <AudioController
    //     audioTitle={audioTitle}
    //     currentTime={currentTime}
    //     duration={duration}
    //     isPlaying={isPlaying}
    //     isMuted={isMuted}
    //     volume={volume}
    //     onSeek={handleSeek}
    //     onPlayPause={handlePlayPause}
    //     onStop={handleStop}
    //     onSkip={handleSkip}
    //     onToggleMute={toggleMute}
    //     onVolumeChange={handleVolumeChange}
    //     mode={mode}
    //   />
    // </div>
  );
}
