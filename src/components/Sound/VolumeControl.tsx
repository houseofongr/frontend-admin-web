import React, { useState } from "react";
import { VscMute, VscUnmute } from "react-icons/vsc";

const VolumeControl = ({
  isMuted,
  volume,
  toggleMute,
  handleVolumeChange,
}: {
  isMuted: boolean;
  volume: number;
  toggleMute: () => void;
  handleVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* 음소거 버튼 */}
      <button onClick={toggleMute} className="pr-2">
        {isMuted ? (
          <VscMute size={18} className="text-neutral-500" />
        ) : (
          <VscUnmute size={18} className="text-neutral-500" />
        )}
      </button>

      {/* 볼륨 슬라이더 팝업 */}
      <div
        className={` left-1/2 -translate-x-1/2 mb-2 transition-all duration-200 ease-in-out z-50 ${
          hover
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="w-[100px] bg-white border rounded shadow p-2">
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
  );
};

export default VolumeControl;
