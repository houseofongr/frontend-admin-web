interface ColorTagProps {
  fill: string;
}

export default function ColorTag({ fill }: ColorTagProps) {
  return <div className="w-4 h-4 rounded opacity-50" style={{ backgroundColor: fill }}></div>;
}
