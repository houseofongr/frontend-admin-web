import React, { useRef, useEffect, useState } from "react";
import WaveSurfer from "wavesurfer.js";

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

  useEffect(() => {
    if (!waveformRef.current || !audioRef.current) return;
    console.log("wavesurfer", waveSurfer);
    const waveSurferInstance = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#5f5c5d",
      progressColor: "#ea3131", // bg light version
      // progressColor: "#F5946D", // bg dark version

      cursorColor: "#f4663f",
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

    return () => waveSurferInstance.destroy();
  }, [audioUrl]);

  return (
    <div className="flex flex-col gap-10 w-full ">
      <div ref={waveformRef} />
      <div className="w-full flex justify-center">
        <audio ref={audioRef} controls src={audioUrl} className="" />
      </div>
    </div>
  );
};

export default WaveformWithAudio;
