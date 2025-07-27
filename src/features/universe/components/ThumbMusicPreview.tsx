import AudioWaveform from "../../../components/Sound/V2/AudioWaveform";
import API_CONFIG from "../../../config/api";

interface ThumbnailEditProps {
  thumbMusicId: number;
  onClose: () => void;
}

export default function ThumbMusicPreview({ thumbMusicId, onClose }: ThumbnailEditProps) {

  return (
    <div className="p-5">
      <AudioWaveform
        audioUrl={`${API_CONFIG.FILE_API}/public/audios/${thumbMusicId}`}
        mode="light"
      />
    </div>
  );
}
