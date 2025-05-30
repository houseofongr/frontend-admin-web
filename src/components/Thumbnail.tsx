import { RiPencilLine } from "react-icons/ri";
import API_CONFIG from "../config/api";

type ThumbnailProps = {
  thumbnailId: number;
  onEdit: () => void;
};

export default function Thumbnail({ thumbnailId, onEdit }: ThumbnailProps) {
  return (
    <div className="relative flex justify-center items-center w-20 h-20  group rounded-lg overflow-hidden">
      <img
        src={`${API_CONFIG.PUBLIC_IMAGE_LOAD_API}/${thumbnailId}`}
        alt="thumbnail"
        className="max-w-full max-h-full object-contain"
      />
      <button
        onClick={onEdit}
        className="absolute cursor-pointer top-1 right-1 w-7 h-7 flex items-center justify-center bg-black/10 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <RiPencilLine size={20} />
      </button>
    </div>
  );
}
