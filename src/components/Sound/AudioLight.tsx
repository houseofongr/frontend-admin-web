import React, { useRef, useEffect, useState } from "react";
import {
  TbPlayerPlayFilled,
  TbPlayerPauseFilled,
  TbPlayerStopFilled,
} from "react-icons/tb";
import { MdReplay10, MdForward10 } from "react-icons/md";
import { VscMute, VscUnmute } from "react-icons/vsc";

interface AudioProps {
  audioUrl: string;
  audioTitle: string;
}

const AudioLight: React.FC<AudioProps> = ({ audioUrl, audioTitle }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    audio.volume = volume;

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateProgress);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", updateProgress);
    };
  }, [volume]);

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
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
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
      audioRef.current.volume = 0.5;
      setVolume(0.5);
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setVolume(0);
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }

    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  return (
    <div className="flex flex-col px-5 min-w-[230px] w-full">
      {/* 오디오 엘리먼트 추가 */}
      <audio ref={audioRef} src={audioUrl} className="hidden" />

      {/* 컨트롤러 */}
      <div className="w-full py-5 px-4 min-w-[230px]">
        <div className="text-center text-neutral-600">{audioTitle}</div>
        <div className="w-full flex flex-col items-center gap-2 pt-4">
          <input
            type="range"
            min="0"
            max={duration.toString()}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-neutral-200 appearance-none cursor-pointer"
          />
          <div className="w-full flex justify-between">
            <span className="text-xs text-neutral-600">
              {formatTime(currentTime)}
            </span>
            <span className="text-xs text-neutral-600">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        <div className="w-full flex flex-row justify-between">
          <div className=" lg:flex-2"></div>
          <div className="flex flex-5 justify-between">
            {/* 뒤로 10초 */}
            <button onClick={() => handleSkip(-10)}>
              <MdReplay10 size={25} className="text-neutral-500" />
            </button>
            {/* 재생/일시정지 */}
            <button onClick={handlePlayPause}>
              {isPlaying ? (
                <TbPlayerPauseFilled size={25} className="text-neutral-500" />
              ) : (
                <TbPlayerPlayFilled size={25} className="text-neutral-500" />
              )}
            </button>
            {/* 정지 */}
            <button onClick={handleStop} className="p-2">
              <TbPlayerStopFilled size={25} className="text-neutral-500" />
            </button>
            {/* 앞으로 10초 */}
            <button onClick={() => handleSkip(10)}>
              <MdForward10 size={25} className="text-neutral-500" />
            </button>
          </div>

          {/* 음소거 */}
          <div className="flex flex-3 justify-end items-center">
            <button onClick={toggleMute} className="pr-2">
              {isMuted ? (
                <VscMute size={18} className="text-neutral-500" />
              ) : (
                <VscUnmute size={18} className="text-neutral-500" />
              )}
            </button>
            <div className="w-[50%] flex flex-col items-center gap-2 py-1">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export default AudioLight;
