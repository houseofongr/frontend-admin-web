import React, { useState, useRef } from "react";
import API_CONFIG from "../../../config/api";

interface Point {
  x: number;
  y: number;
}


interface SpaceSelectorProps {
  createSpaceModalOpen: boolean;
  innerImageId: number;
  startPoint: { x: number; y: number } | null;
  endPoint: { x: number; y: number } | null;
  setStartPoint: React.Dispatch<
    React.SetStateAction<{ x: number; y: number } | null>
  >;
  setEndPoint: React.Dispatch<
    React.SetStateAction<{ x: number; y: number } | null>
  >;
}


export default function SpaceSelector({
  createSpaceModalOpen,
  innerImageId,
  startPoint,
  endPoint,
  setStartPoint,
  setEndPoint,
}: SpaceSelectorProps) {
  const [hoverPos, setHoverPos] = useState<Point | null>(null);

  const imgRef = useRef<HTMLImageElement>(null);

  // 이미지 내부 좌표 계산 함수
  const getImageRelativePos = (e: React.MouseEvent): Point | null => {
    if (!imgRef.current) return null;

    const rect = imgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 이미지 영역 안인지 확인
    if (x < 0 || y < 0 || x > rect.width || y > rect.height) return null;

    return { x, y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!createSpaceModalOpen) {
      setHoverPos(null);
      return;
    }
    const pos = getImageRelativePos(e);
    setHoverPos(pos);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!createSpaceModalOpen) return;

    const pos = getImageRelativePos(e);
    if (!pos) return; // 이미지 영역 밖은 무시

    if (!startPoint) {
      setStartPoint(pos);
    } else if (!endPoint) {
      setEndPoint(pos);
    } else {
      setStartPoint(pos);
      setEndPoint(null);
    }
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

      {/* 마우스 위치 (원 + 십자선) */}
      {createSpaceModalOpen && hoverPos && !endPoint && (
        <>
          <div
            className="absolute w-3 h-3 bg-blue-400 rounded-full pointer-events-none"
            style={{
              left: `calc(50% - ${imgRef.current?.width! / 2}px + ${
                hoverPos.x - 6
              }px)`,
              top: `calc(50% - ${imgRef.current?.height! / 2}px + ${
                hoverPos.y - 6
              }px)`,
            }}
          />
          <div
            className="absolute h-[1px] bg-blue-400 pointer-events-none"
            style={{
              top: `calc(50% - ${imgRef.current?.height! / 2}px + ${
                hoverPos.y
              }px)`,
              left: `calc(50% - ${imgRef.current?.width! / 2}px)`,
              width: imgRef.current?.width,
            }}
          />
          <div
            className="absolute w-[1px] bg-blue-400 pointer-events-none"
            style={{
              left: `calc(50% - ${imgRef.current?.width! / 2}px + ${
                hoverPos.x
              }px)`,
              top: `calc(50% - ${imgRef.current?.height! / 2}px)`,
              height: imgRef.current?.height,
            }}
          />
        </>
      )}

      {/* 시작 점 */}
      {startPoint && (
        <div
          className="absolute w-2 h-2 z-10 border-2 border-amber-400 bg-white pointer-events-none"
          style={{
            left: `calc(50% - ${imgRef.current?.width! / 2}px + ${
              startPoint.x - 3
            }px)`,
            top: `calc(50% - ${imgRef.current?.height! / 2}px + ${
              startPoint.y - 3
            }px)`,
          }}
        />
      )}

      {/* 끝 점 */}
      {endPoint && (
        <div
          className="absolute w-2 h-2 z-10 border-2 border-amber-400 bg-white pointer-events-none"
          style={{
            left: `calc(50% - ${imgRef.current?.width! / 2}px + ${
              endPoint.x - 5
            }px)`,
            top: `calc(50% - ${imgRef.current?.height! / 2}px + ${
              endPoint.y - 5
            }px)`,
          }}
        />
      )}

      {/* 박스 */}
      {startPoint && endPoint && (
        <div
          className="absolute border-2 border-amber-400 bg-amber-400/20 pointer-events-none"
          style={{
            left: `calc(50% - ${imgRef.current?.width! / 2}px + ${Math.min(
              startPoint.x,
              endPoint.x
            )}px)`,
            top: `calc(50% - ${imgRef.current?.height! / 2}px + ${Math.min(
              startPoint.y,
              endPoint.y
            )}px)`,
            width: Math.abs(endPoint.x - startPoint.x),
            height: Math.abs(endPoint.y - startPoint.y),
          }}
        />
      )}
    </div>
  );
};
