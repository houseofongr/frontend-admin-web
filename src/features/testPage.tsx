import PageLayout from "../components/layout/PageLayout";
import AudioWaveform from "./AudioWaveform";


export default function TestPage() {
  return (
    <PageLayout>
      <h1>오디오 파형 데모</h1>
      <div className="w-[400px]">
        <AudioWaveform
          audioUrl="/public/sound/Heroic Reception - Kevin MacLeod.mp3"
          mode="dark"
        />
      </div>
    </PageLayout>
  );
}
