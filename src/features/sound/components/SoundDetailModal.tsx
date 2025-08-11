import API_CONFIG from "../../../config/api";
import Modal from "../../../components/modal/Modal";
import { SoundType } from "../../../context/useSoundStore";
import AudioWaveform from "../../../components/Sound/V2/AudioWaveform";

type SoundDetailProps = {
  onClose: () => void;
  data: SoundType;
};

export default function SoundDetailModal({ onClose, data }: SoundDetailProps) {
  const { soundId, title, description, audioId, createdTime, hidden } = data;
  return (
    <Modal onClose={onClose} bgColor="dark">
      <div className="flex flex-col text-white">
        <img
          src="/images/logo/logo_for-dark-bg.png"
          alt="아카이브 오브 옹알 로고"
          width={30}
          height={30}
        />
        <div className="mt-5">
          <div className={`text-2xl mb-1`}>{title}</div>
          <div className="h-[80px]">{description}</div>
        </div>
        <AudioWaveform
          audioUrl={`${API_CONFIG.FILE_API}/public/audios/${audioId}`}
          mode="transparent"
        />
      </div>
    </Modal>
  );
}
