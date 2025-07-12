import React from "react";
import {
  TbPlayerPlayFilled,
  TbPlayerPauseFilled,
  TbPlayerStopFilled,
} from "react-icons/tb";
import { MdReplay10, MdForward10 } from "react-icons/md";
import { VscMute, VscUnmute } from "react-icons/vsc";
import { getAudioColors } from "../constants/color";

interface AudioControllerProps {
  audioTitle: string;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;

  onSeek: (time: number) => void;
  onPlayPause: () => void;
  onStop: () => void;
  onSkip: (seconds: number) => void;
  onToggleMute: () => void;
  onVolumeChange: (volume: number) => void;

  mode?: "light" | "dark"; // 추가
}

const AudioController: React.FC<AudioControllerProps> = ({
  audioTitle,
  currentTime,
  duration,
  isPlaying,
  isMuted,
  volume,
  onSeek,
  onPlayPause,
  onStop,
  onSkip,
  onToggleMute,
  onVolumeChange,
  mode = "light",
}) => {
  const colors = getAudioColors(mode);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div
      style={{ backgroundColor: colors.background }}
      className={`w-full py-5 px-4 rounded-xl`}
    >
      <div style={{ color: colors.text }} className={`text-center mb-4`}>
        {audioTitle}
      </div>
      <div className="w-full flex flex-col items-center gap-2 pt-4">
        <input
          type="range"
          min={0}
          max={duration}
          step={0.1}
          value={currentTime}
          onChange={(e) => onSeek(parseFloat(e.target.value))}
          style={{ backgroundColor: colors.range }}
          className="w-full h-1.5  appearance-none cursor-pointer"
        />
        <div className="w-full flex justify-between">
          <span style={{ color: colors.timeText }} className="text-xs">
            {formatTime(currentTime)}
          </span>
          <span style={{ color: colors.timeText }} className="text-xs">
            {formatTime(duration)}
          </span>
        </div>
      </div>
      <div className="w-full flex justify-center pl-18 gap-4">
        {/* 뒤로 10초 */}
        <button onClick={() => onSkip(-10)}>
          <MdReplay10 size={25} color={colors.icon} />
        </button>
        {/* 재생/일시정지 */}
        <button onClick={onPlayPause}>
          {isPlaying ? (
            <TbPlayerPauseFilled size={25} color={colors.icon} />
          ) : (
            <TbPlayerPlayFilled size={25} color={colors.icon} />
          )}
        </button>
        {/* 정지 */}
        <button onClick={onStop} className="p-2">
          <TbPlayerStopFilled size={25} color={colors.icon} />
        </button>
        {/* 앞으로 10초 */}
        <button onClick={() => onSkip(10)}>
          <MdForward10 size={25} color={colors.icon} />
        </button>
        {/* 음소거 */}
        <div className="flex justify-end items-center">
          <button onClick={onToggleMute} className="p-2">
            {isMuted ? (
              <VscMute size={18} color={colors.icon} />
            ) : (
              <VscUnmute size={18} color={colors.icon} />
            )}
          </button>

          <div className="w-[35%] flex flex-col items-center gap-2 py-1">
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              style={{ backgroundColor: colors.range }}
              className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioController;
