import React, { useState, useRef, useEffect } from "react";
import API_CONFIG from "../../../config/api";
import { SpaceCreateStep } from "../../../constants/ProcessSteps";
import {
  PieceType,
  SpaceType,
  useUniverseStore,
} from "../../../context/useUniverseStore";

interface PercentPoint {
  xPercent: number;
  yPercent: number;
}

interface SpaceSelectorProps {
  step: SpaceCreateStep | null;
  innerImageId: number;
  startPoint: PercentPoint | null;
  endPoint: PercentPoint | null;
  setStartPoint: React.Dispatch<React.SetStateAction<PercentPoint | null>>;
  setEndPoint: React.Dispatch<React.SetStateAction<PercentPoint | null>>;
  existingSpaces: SpaceType[];
  existingPieces: PieceType[];
}

export default function SpaceSelector({
  step,
  innerImageId,
  startPoint,
  endPoint,
  setStartPoint,
  setEndPoint,
  existingSpaces,
  existingPieces,
}: SpaceSelectorProps) {
  const { universeId, setParentSpaceId, setUniverseId } = useUniverseStore();

  const [hoverPos, setHoverPos] = useState<PercentPoint | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [popupData, setPopupData] = useState<{
    x: number;
    y: number;
    title: string;
    description: string;
  } | null>(null);

  const imgRef = useRef<HTMLImageElement>(null);

  // ResizeObserver로 이미지 사이즈 추적
  useEffect(() => {
    if (!imgRef.current) return;

    const updateSize = () => {
      const width = imgRef.current?.clientWidth ?? 0;
      const height = imgRef.current?.clientHeight ?? 0;
      setImageSize({ width, height });
    };

    updateSize(); // 초기 크기

    const observer = new ResizeObserver(() => {
      updateSize();
    });

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [innerImageId]);

  const getRelativePercentPos = (e: React.MouseEvent): PercentPoint | null => {
    if (!imgRef.current) return null;

    const rect = imgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x < 0 || y < 0 || x > rect.width || y > rect.height) return null;

    return {
      xPercent: x / rect.width,
      yPercent: y / rect.height,
    };
  };

  const toPixel = (point: PercentPoint) => ({
    x: point.xPercent * imageSize.width,
    y: point.yPercent * imageSize.height,
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (step !== SpaceCreateStep.SetSize) {
      setHoverPos(null);
      return;
    }
    const pos = getRelativePercentPos(e);
    setHoverPos(pos);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (step !== SpaceCreateStep.SetSize) return;

    const pos = getRelativePercentPos(e);
    if (!pos) return;

    if (!startPoint) {
      setStartPoint(pos);
    } else if (!endPoint) {
      setEndPoint(pos);
    } else {
      setStartPoint(pos);
      setEndPoint(null);
    }
  };

  const handleMoveToSpace = (space:SpaceType) => {
    setUniverseId(space.spaceId);
    setParentSpaceId(universeId!);
  };

  const handleMouseEnter = (index: number) => {
    const space = existingSpaces[index];
    const start = toPixel({ xPercent: space.startX, yPercent: space.startY });
    const end = toPixel({ xPercent: space.endX, yPercent: space.endY });
    const left = Math.min(start.x, end.x);
    const top = Math.min(start.y, end.y);
    const width = Math.abs(end.x - start.x);
    const height = Math.abs(end.y - start.y);

    setHoveredIndex(index);
    setPopupData({
      x: left + width / 2 + 10, // 박스 오른쪽 10px 옆
      y: top + height / 2 + 5, // 박스 아래 5px 밑
      title: space.title,
      description: space.description,
    });
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    setPopupData(null);
  };

  return (
    <div
      className="relative w-full h-full"
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      {innerImageId !== -1 && (
        <img
          ref={imgRef}
          src={`${API_CONFIG.PUBLIC_IMAGE_LOAD_API}/${innerImageId}`}
          alt="target"
          className="object-contain block mx-auto max-h-full max-w-full"
          style={{ userSelect: "none", pointerEvents: "none" }}
          draggable={false}
        />
      )}

      {/* Hover */}
      {step === SpaceCreateStep.SetSize &&
        hoverPos &&
        !endPoint &&
        (() => {
          const { x, y } = toPixel(hoverPos);
          return (
            <>
              <div
                className="absolute w-3 h-3 bg-blue-400 rounded-full pointer-events-none"
                style={{
                  left: `calc(50% - ${imageSize.width / 2}px + ${x - 6}px)`,
                  top: `calc(50% - ${imageSize.height / 2}px + ${y - 6}px)`,
                }}
              />
              <div
                className="absolute h-[1px] bg-blue-400 pointer-events-none"
                style={{
                  top: `calc(50% - ${imageSize.height / 2}px + ${y}px)`,
                  left: `calc(50% - ${imageSize.width / 2}px)`,
                  width: `${imageSize.width}px`,
                }}
              />
              <div
                className="absolute w-[1px] bg-blue-400 pointer-events-none"
                style={{
                  left: `calc(50% - ${imageSize.width / 2}px + ${x}px)`,
                  top: `calc(50% - ${imageSize.height / 2}px)`,
                  height: `${imageSize.height}px`,
                }}
              />
            </>
          );
        })()}

      {/* Start */}
      {startPoint &&
        (() => {
          const { x, y } = toPixel(startPoint);
          return (
            <div
              className="absolute w-2 h-2 z-10 border-2 border-amber-400 bg-white pointer-events-none"
              style={{
                left: `calc(50% - ${imageSize.width / 2}px + ${x - 3}px)`,
                top: `calc(50% - ${imageSize.height / 2}px + ${y - 3}px)`,
              }}
            />
          );
        })()}

      {/* End */}
      {endPoint &&
        (() => {
          const { x, y } = toPixel(endPoint);
          return (
            <div
              className="absolute w-2 h-2 z-10 border-2 border-amber-400 bg-white pointer-events-none"
              style={{
                left: `calc(50% - ${imageSize.width / 2}px + ${x - 5}px)`,
                top: `calc(50% - ${imageSize.height / 2}px + ${y - 5}px)`,
              }}
            />
          );
        })()}

      {/* Box */}
      {startPoint &&
        endPoint &&
        (() => {
          const start = toPixel(startPoint);
          const end = toPixel(endPoint);
          const left = Math.min(start.x, end.x);
          const top = Math.min(start.y, end.y);
          const width = Math.abs(end.x - start.x);
          const height = Math.abs(end.y - start.y);

          return (
            <div
              className="absolute border-2 border-amber-400 bg-amber-400/20 pointer-events-none"
              style={{
                left: `calc(50% - ${imageSize.width / 2}px + ${left}px)`,
                top: `calc(50% - ${imageSize.height / 2}px + ${top}px)`,
                width: `${width}px`,
                height: `${height}px`,
              }}
            />
          );
        })()}

      {existingSpaces &&
        existingSpaces.map((space, index) => {
          const start = toPixel({
            xPercent: space.startX,
            yPercent: space.startY,
          });
          const end = toPixel({ xPercent: space.endX, yPercent: space.endY });
          const left = Math.min(start.x, end.x);
          const top = Math.min(start.y, end.y);
          const width = Math.abs(end.x - start.x);
          const height = Math.abs(end.y - start.y);

          return (
            <div
              key={index}
              className="absolute"
              style={{
                left: `calc(50% - ${imageSize.width / 2}px + ${left}px)`,
                top: `calc(50% - ${imageSize.height / 2}px + ${top}px)`,
                width: `${width}px`,
                height: `${height}px`,
              }}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <div
                className={` w-full h-full border-2 border-amber-400 bg-amber-400/20 cursor-pointer transition-opacity duration-300 ${
                  hoveredIndex === index ? "opacity-100" : "opacity-30"
                }`}
                onClick={()=>handleMoveToSpace(space)}
              />
            </div>
          );
        })}

      <div
        className={`absolute bg-white p-2 rounded shadow-md max-w-xs text-sm z-30 pointer-events-none transition-opacity duration-500 ${
          popupData ? "opacity-100" : "opacity-100"
        }`}
        style={{
          left: `calc(50% - ${imageSize.width / 2}px + ${popupData?.x}px)`,
          top: `calc(50% - ${imageSize.height / 2}px + ${popupData?.y}px)`,
          visibility: popupData ? "visible" : "hidden",
        }}
      >
        <div className="font-semibold">{popupData?.title}</div>
        <div className="text-xs mt-1">{popupData?.description}</div>
      </div>
    </div>
  );
}
