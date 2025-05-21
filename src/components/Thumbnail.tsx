import { RiPencilLine } from "react-icons/ri";

type ThumbnailProps = {
  imageUrl: string;
  onEdit: () => void;
};

export default function Thumbnail({ imageUrl, onEdit }: ThumbnailProps) {
  if (imageUrl === "") imageUrl = "/images/house/AOO_INIT_HOUSE_GRAY.png";

  return (
    <div className="relative flex justify-center w-25 h-20 group">
      <img
        src={imageUrl}
        alt="thumbnail"
        className="rounded-lg object-cover w-20 h-20"
      />
      <button
        onClick={onEdit}
        className="absolute top-1 right-1 w-7 h-7 flex items-center justify-center bg-black/10 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <RiPencilLine size={20} />
      </button>
    </div>
  );
}
