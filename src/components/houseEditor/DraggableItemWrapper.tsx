import React from "react";

import DraggableItem from "./DraggableItem";
import { useImageContext } from "../../context/ImageContext";

type DraggableItemWrapperProps = {
  index: number;
  width: number;
  height: number;
  scale: number;
  imageUrl: string;
};

const DraggableItemWrapper = React.memo(({ index, width, height, scale, imageUrl }: DraggableItemWrapperProps) => {
  const { updateRoomPosition, roomImages } = useImageContext();
  const zIndex = roomImages[index]?.z || 0;

  return (
    <DraggableItem
      index={index}
      _width={width}
      _height={height}
      zIndex={zIndex}
      scale={scale}
      onPositionChange={updateRoomPosition}
    >
      <img draggable={false} src={imageUrl} width={width * scale} height={height * scale} alt={`room-image-${index}`} />
    </DraggableItem>
  );
});

DraggableItemWrapper.displayName = "DraggableItemWrapper";
export default DraggableItemWrapper;
