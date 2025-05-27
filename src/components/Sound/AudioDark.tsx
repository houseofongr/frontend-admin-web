import React, { useRef, useEffect, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { TbPlayerPlayFilled } from "react-icons/tb";
import { TbPlayerPauseFilled } from "react-icons/tb";
import { TbPlayerStopFilled } from "react-icons/tb";
import { MdReplay10 } from "react-icons/md";
import { MdForward10 } from "react-icons/md";
import { VscMute } from "react-icons/vsc";
import { VscUnmute } from "react-icons/vsc";

interface WaveformProps {
  audioUrl: string;
  audioTitle: string;
}

const WaveformWithAudioDark: React.FC<WaveformProps> = ({
  audioUrl,
  audioTitle,
}) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [waveSurfer, setWaveSurfer] = useState<WaveSurfer | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!waveformRef.current || !audioRef.current) return;
    console.log("wavesurfer", waveSurfer);
    const waveSurferInstance = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "gray",
      progressColor: "#ff6347", // bg light version
      // progressColor: "#F5946D", // bg dark version
      cursorColor: "#F5946D",
      height: 150,
      // barHeight: 20,
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
    console.log(audioUrl);

    return () => waveSurferInstance.destroy();
  }, [audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };

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
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  return (
    <div className="flex flex-col px-5 max-w-[450px]">
      {/* 컨트롤러 */}
      <div className="w-full py-5 px-4  bg-stone-800/90">
        <div className="text-center  text-neutral-200">{audioTitle}</div>
        <div className="w-full flex flex-col items-center gap-2 pt-4 ">
          <input
            type="range"
            min="0"
            max={duration.toString()}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-[#f3f3f3] appearance-none cursor-pointer"
          />
          <div className="w-full flex justify-between">
            <span className="text-xs text-gray-500">
              {formatTime(currentTime)}
            </span>
            <span className="text-xs text-gray-500">
              {formatTime(duration)}
            </span>
          </div>
        </div>
        <div className="w-full flex justify-center pl-25 gap-4">
          {/* 뒤로 10초 */}
          <button onClick={() => handleSkip(-10)}>
            <MdReplay10 size={25} color="#f3f3f3" />
          </button>
          {/* 재생/일시정지 */}
          <button onClick={handlePlayPause}>
            {isPlaying ? (
              <TbPlayerPauseFilled size={25} color="#f3f3f3" />
            ) : (
              <TbPlayerPlayFilled size={25} color="#f3f3f3" />
            )}
          </button>
          {/* 정지 */}
          <button onClick={handleStop} className="p-2 ">
            <TbPlayerStopFilled size={25} color="#f3f3f3" />
          </button>
          {/* 앞으로 10초 */}
          <button onClick={() => handleSkip(10)}>
            <MdForward10 size={25} color="#f3f3f3" />
          </button>
          {/* 음소거 */}
          <div className=" flex justify-end items-center">
            <button onClick={toggleMute} className="p-2 ">
              {isMuted ? (
                <VscMute size={18} color="#f3f3f3" />
              ) : (
                <VscUnmute size={18} color="#f3f3f3" />
              )}
            </button>

            <div className=" w-[50%] flex flex-col items-center gap-2 py-1">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer "
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

export default WaveformWithAudioDark;
