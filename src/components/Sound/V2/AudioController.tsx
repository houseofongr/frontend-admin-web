import React from "react";
import { VscMute, VscUnmute } from "react-icons/vsc";
import { getAudioColors } from "../../../constants/color";
import { RiForward10Fill, RiReplay10Fill } from "react-icons/ri";
import { IoPauseSharp, IoPlaySharp } from "react-icons/io5";

interface AudioControllerProps {
  audioTitle?: string;
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

  mode?: "light" | "dark" | "transparent";
}

const AudioController: React.FC<AudioControllerProps> = ({
  audioTitle = "",
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
      className="w-full flex flex-col items-center"
    >
      <div className="flex items-center text-sm" style={{ color: colors.text }}>
        {audioTitle}
      </div>
      {/* 음소거 */}
      <div className="w-full flex justify-end items-center">
        <button
          onClick={onToggleMute}
          className="p-2 cursor-pointer hover:opacity-80"
        >
          {isMuted ? (
            <VscMute size={18} color={colors.icon} />
          ) : (
            <VscUnmute size={18} color={colors.icon} />
          )}
        </button>

        <div className="min-w-[80px] w-[25%] flex flex-col items-center gap-2 py-1">
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            style={
              {
                backgroundColor: colors.range,
                "--value": `${volume * 100}%`,
              } as React.CSSProperties
            }
            className="w-full h-1.5 appearance-none cursor-pointer custom-fill-slider"
          />
        </div>
      </div>

      <div className="w-full flex flex-col items-center gap-2 pt-2">
        <input
          type="range"
          min={0}
          max={duration}
          step={0.1}
          value={currentTime}
          onChange={(e) => onSeek(parseFloat(e.target.value))}
          style={
            {
              backgroundColor: colors.range,
              "--value": `${(currentTime / duration) * 100}%`,
            } as React.CSSProperties
          }
          className="w-full h-1.5 appearance-none cursor-pointer custom-fill-slider "
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
      <div className="w-full flex justify-center gap-6">
        {/* 뒤로 10초 */}
        <button
          onClick={() => onSkip(-10)}
          className="cursor-pointer hover:opacity-80"
        >
          <RiReplay10Fill size={20} color={colors.icon} />
          {/* <IoPlayBackSharp size={20} color={colors.icon} /> */}
        </button>
        {/* 재생/일시정지 */}
        <button
          onClick={onPlayPause}
          className="cursor-pointer hover:opacity-80"
        >
          {isPlaying ? (
            <IoPauseSharp size={25} color={colors.icon} />
          ) : (
            <IoPlaySharp size={25} color={colors.icon} />
          )}
        </button>
        {/* 정지 */}
        {/* <button
          onClick={onStop}
          className="p-2 cursor-pointer hover:opacity-80"
        >
          <TbPlayerStopFilled size={25} color={colors.icon} />
        </button> */}
        {/* 앞으로 10초 */}
        <button
          onClick={() => onSkip(10)}
          className="cursor-pointer hover:opacity-80"
        >
          <RiForward10Fill size={20} color={colors.icon} />
          {/* <IoPlayForwardSharp size={20} color={colors.icon} /> */}
        </button>
      </div>
      <style>
        {`
          .custom-fill-slider {
            background: linear-gradient(
              to right,
              ${colors.slider} 0%,
              ${colors.slider} var(--value, 50%),
              #ddd var(--value, 50%),
              #ddd 100%
            );
            height: 6px;
            border-radius: 0px;
          }
          .custom-fill-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 0;
            height: 0;
            background: transparent;
            border: none;
          }

          .custom-fill-slider::-moz-range-thumb {
            width: 0;
            height: 0;
            background: transparent;
            border: none;
          }
        `}
      </style>
    </div>
  );
};

export default AudioController;
