import React, { useRef, useEffect, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { TbPlayerPlayFilled } from "react-icons/tb"; // 재생
import { TbPlayerPauseFilled } from "react-icons/tb"; // 일시정지
import { TbPlayerStopFilled } from "react-icons/tb"; // 정지
import { MdReplay10 } from "react-icons/md"; // 10초 전
import { MdForward10 } from "react-icons/md"; // 10초 후

import { BsFillVolumeMuteFill } from "react-icons/bs"; // 음소거

import { VscMute } from "react-icons/vsc"; // mute
import { VscUnmute } from "react-icons/vsc"; // unmute

// 추후 인증 구현후
// interface CustomWaveServeroptions extends WaveformProps {
//   crossOrigin?: string;
// }

// 인증 헤더를 토한 요청
// fetch(audioUrl, {
//   method: "GET",
//   credentials: "include",
//   headers: {
//     Authorization: `Bearer ${yourAuthToken}`,
//   },
// });
interface WaveformProps {
  audioUrl: string;
}

const WaveformWithAudio: React.FC<WaveformProps> = ({ audioUrl }) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [waveSurfer, setWaveSurfer] = useState<WaveSurfer | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  console.log("isplaying", isPlaying);
  useEffect(() => {
    if (!waveformRef.current || !audioRef.current) return;
    console.log("wavesurfer", waveSurfer);
    const waveSurferInstance = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "gray",
      progressColor: "#ea3131", // bg light version
      // progressColor: "#F5946D", // bg dark version

      cursorColor: "black",

      height: 180,

      // barHeight: 20,
      // responsive: true,
      // audioRate: 10, //빨리감기
      barWidth: 0.5,
      cursorWidth: 1,
      barGap: 0.5,
      // barGap: 0,
      // barGap: 1, //default
      backend: "MediaElement",
      // crossOrigin: "use-credentials",
      mediaControls: true,
      media: audioRef.current, // Sync with audio element
    });

    waveSurferInstance.load(audioUrl);
    setWaveSurfer(waveSurferInstance);

    waveSurferInstance.on("error", (error) => {
      console.error("WaveSurfer error:", error);
    });

    waveSurferInstance.on("ready", () => {
      console.log("WaveSurfer is ready");
    });

    waveSurferInstance.on("error", (error) => {
      console.error("WaveSurfer error:", error);
    });

    return () => waveSurferInstance.destroy();
  }, [audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    // 초기화 및 이벤트 등록
    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateProgress);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", updateProgress);
    };
  }, []);

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = parseFloat(event.target.value);
      audioRef.current.currentTime = newTime;
    }
  };
  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };
  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // 재생 위치 초기화
      setIsPlaying(false);
    }
  };

  const handleSkip = (seconds: number) => {
    if (audioRef.current) {
      let newTime = audioRef.current.currentTime + seconds;

      // 범위 초과 방지
      if (newTime < 0) newTime = 0;
      if (newTime > audioRef.current.duration) newTime = audioRef.current.duration;

      audioRef.current.currentTime = newTime;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(audioRef.current.muted);
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    console.log("newVolume", newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setVolume(newVolume);
  };

  return (
    <div className="w-full flex flex-col ">
      <div ref={waveformRef} />

      <div className="w-full flex justify-center">
        <audio ref={audioRef} controls src={audioUrl} className="hidden" />
      </div>
      {/* 진행 바 */}

      <div className="w-full  p-5 mt-2 rounded-3xl bg-neutral-100">
        <div className="w-full flex flex-col items-center gap-2 pt-4 ">
          <input
            type="range"
            min="0"
            max={duration.toString()}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-white rounded-lg appearance-none cursor-pointer accent-[#F5946D]"
          />
          <div className="w-full flex justify-between">
            <span className="text-xs text-gray-500">{formatTime(currentTime)}</span>
            <span className="text-xs text-gray-500">{formatTime(duration)}</span>
          </div>
        </div>
        <div className="w-full flex-center gap-4">
          {/* 뒤로 10초 */}
          <button onClick={() => handleSkip(-10)}>
            <MdReplay10 size={25} />
          </button>
          {/* 재생/일시정지 */}
          <button onClick={handlePlayPause}>
            {isPlaying ? <TbPlayerPauseFilled size={25} /> : <TbPlayerPlayFilled size={25} />}
          </button>
          {/* 정지 */}
          <button onClick={handleStop} className="p-2 ">
            <TbPlayerStopFilled size={25} />
          </button>
          {/* 앞으로 10초 */}
          <button onClick={() => handleSkip(10)}>
            <MdForward10 size={25} />
          </button>
          {/* 음소거 */}
          <button onClick={toggleMute} className="p-2 ">
            {isMuted ? <VscMute size={25} /> : <VscUnmute size={25} />}
          </button>

          <div className="w-[20%] flex flex-col items-center gap-2 py-1">
            <span></span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>
        </div>
      </div>

      {/* 컨트롤 버튼들 */}

      {/* 볼륨 조절 */}
    </div>
  );
};

// 시간을 포맷하는 헬퍼 함수
const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export default WaveformWithAudio;
