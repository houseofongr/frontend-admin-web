import React, { useEffect, useRef, useState } from "react";
import Draggable, { DraggableEvent, DraggableData } from "react-draggable";

interface DraggableItemProps {
  index: number;
  _width: number;
  _height: number;
  zIndex: number;
  scale: number;
  onPositionChange: (index: number, x: number, y: number) => void;
  children: React.ReactNode;
}

const DraggableItem = React.memo(
  ({ children, index, _width, _height, zIndex, scale, onPositionChange }: DraggableItemProps) => {
    const nodeRef = useRef<HTMLDivElement>(null as any);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const isDraggingRef = useRef(false);
    const ORIGIN_IMG_WIDTH = 5000;
    const ORIGIN_IMG_HEIGHT = 5000;

    const onDrag = (_: DraggableEvent, data: DraggableData) => {
      isDraggingRef.current = true;
      setPosition({ x: data.x, y: data.y });
    };

    const onStop = (_: DraggableEvent, data: DraggableData) => {
      isDraggingRef.current = false;
      setPosition({ x: data.x, y: data.y });

      if (onPositionChange) {
        onPositionChange(index, Number(data.x.toFixed(2)), Number(data.y.toFixed(2)));
      }
    };

    useEffect(() => {
      if (nodeRef.current) {
        console.log("image width:", window.getComputedStyle(nodeRef.current).width);
        console.log("image height:", window.getComputedStyle(nodeRef.current).height);
      }
    }, []);

    return (
      // right : (5000 - 방이미지 원본 너비) * 스케일
      // bottom : (5000 -  방 이미지 원본 높이) * 스케일

      <Draggable
        bounds={{
          left: 0,
          top: 0,
          right: (ORIGIN_IMG_WIDTH - _width) * scale,
          bottom: (ORIGIN_IMG_HEIGHT - _height) * scale,
        }}
        nodeRef={nodeRef}
        onStop={onStop}
        onDrag={onDrag}
      >
        <div className="absolute top-0 inline-block bg-black/20" style={{ zIndex }} ref={nodeRef}>
          {children}
          <div className="absolute top-0 left-0 bg-black text-white text-xs p-1 rounded">
            index: {index + 1} x: {position.x.toFixed(0)}, y: {position.y.toFixed(0)}
          </div>
        </div>
      </Draggable>
    );
  }
);

DraggableItem.displayName = "DraggableItem";

export default DraggableItem;
