import React, { useEffect, useRef, useState } from "react";

type Peak = { max: number; min: number };

export default function MaxMinWaveform({ audioUrl }: { audioUrl: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [peaks, setPeaks] = useState<Peak[]>([]);

  // 1. max/min peaks 계산 함수
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

  // 2. peaks 불러와서 상태 업데이트
  useEffect(() => {
    getMaxMinPeaks(audioUrl).then(setPeaks);
  }, [audioUrl]);

  // 3. peaks를 이용해 canvas에 그리기
  useEffect(() => {
    if (!canvasRef.current || peaks.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = "#004080";
    ctx.lineWidth = 1;

    ctx.beginPath();

    for (let i = 0; i < peaks.length; i++) {
      const x = i;
      const yMax = height / 2 + peaks[i].max * (height / 2);
      const yMin = height / 2 + peaks[i].min * (height / 2);

      ctx.moveTo(x, yMax);
      ctx.lineTo(x, yMin);
    }

    ctx.stroke();
  }, [peaks]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={200}
      style={{ width: "100%", height: "auto", backgroundColor: "#fce4ec" }}
    />
  );
}
