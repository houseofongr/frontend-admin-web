export const AOO_COLOR = {
  Primary: "#f5946d",
  Warning: "#D01c1f",
  Orange: "#f5946d",
  Gray: "#5f5c5d",
};

export const AUDIO_COLORS = {
  light: {
    background: "#fff",
    unplayedWave: "#ccc",
    playedWave: "#f5946d",
    cursor: "#ff6347",

    // 컨트롤러
    text: "rgb(82 82 82)", // text-neutral-200
    range: "rgb(229 229 229)",
    timeText: "rgb(82 82 82)",
    icon: "rgb(115 115 115)",
  },
  dark: {
    background: "#3e3a39",
    unplayedWave: "#3e3a39",
    playedWave: "#ff63478d",
    cursor: "#F5946D",

    // 컨트롤러
    text: "#e5e5e5", // text-neutral-200
    range: "#f3f3f3",
    timeText: "rgb(107 114 128)",
    icon: "#f3f3f3",
  },
};

export function getAudioColors(mode: "light" | "dark") {
  return AUDIO_COLORS[mode] ?? AUDIO_COLORS.light;
}