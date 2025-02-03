import React, { useState } from "react";
import SpinnerIcon from "../icons/SpinnerIcon";

interface BorderImagePreviewProps {
  imageUrl: string | null;
  setScale: (scale: number) => void;
}

const BorderImagePreview: React.FC<BorderImagePreviewProps> = React.memo(({ imageUrl, setScale }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoading(false);
    const img = e.currentTarget;
    const { naturalWidth } = img;
    const renderedWidth = img.clientWidth;
    const scale = renderedWidth / naturalWidth;
    setScale(scale);
  };

  return (
    <div className="aspect-square h-full ">
      {isLoading && <SpinnerIcon />}
      {imageUrl && (
        <img src={imageUrl} alt="Border Preview" width={5000} height={5000} onLoad={(img) => handleImageLoad(img)} />
      )}
    </div>
  );
});

BorderImagePreview.displayName = "BorderImagePreview";

export default BorderImagePreview;
