import React, { useState, useRef, useEffect } from "react";
import API_CONFIG from "../../../config/api";
import { SpaceCreateStep } from "../../../constants/ProcessSteps";
import {
  PieceType,
  SpaceType,
  useUniverseStore,
} from "../../../context/useUniverseStore";
import { IoIosArrowBack } from "react-icons/io";
import SpinnerIcon from "../../../components/icons/SpinnerIcon";

interface PercentPoint {
  xPercent: number;
  yPercent: number;
}

interface SpaceSelectorProps {
  step: SpaceCreateStep | null;
  innerImageId: number | null;
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
}: SpaceSelectorProps) {
  const {
    currentSpaceId,
    setParentSpaceId,
    setCurrentSpaceId,
    parentSpaceId,
    getParentSpaceIdById,
    rootUniverse,
  } = useUniverseStore();

  const [hoverPos, setHoverPos] = useState<PercentPoint | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [popupData, setPopupData] = useState<{
    x: number;
    y: number;
    title: string;
    description: string;
  } | null>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const imgRef = useRef<HTMLImageElement>(null);

  // 이미지 크기 감지
  useEffect(() => {
    if (!imgRef.current) return;
    const updateSize = () => {
      setImageSize({
        width: imgRef.current?.clientWidth ?? 0,
        height: imgRef.current?.clientHeight ?? 0,
      });
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [innerImageId]);

  const toPixel = (point: PercentPoint) => ({
    x: point.xPercent * imageSize.width,
    y: point.yPercent * imageSize.height,
  });

  const getRelativePercentPos = (e: React.MouseEvent): PercentPoint | null => {
    if (!imgRef.current) return null;
    const rect = imgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (x < 0 || y < 0 || x > rect.width || y > rect.height) return null;
    return { xPercent: x / rect.width, yPercent: y / rect.height };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (step === SpaceCreateStep.SetSize) {
      setHoverPos(getRelativePercentPos(e));
    } else {
      setHoverPos(null);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (step !== SpaceCreateStep.SetSize) return;
    const pos = getRelativePercentPos(e);
    if (!pos) return;

    if (!startPoint) setStartPoint(pos);
    else if (!endPoint) setEndPoint(pos);
    else {
      setStartPoint(pos);
      setEndPoint(null);
    }
  };

  const handleMoveToSpace = (space: SpaceType) => {
    setParentSpaceId(currentSpaceId!);
    setCurrentSpaceId(space.spaceId);
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
      x: left + width / 2 + 10,
      y: top + height / 2 + 5,
      title: space.title,
      description: space.description,
    });
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    setPopupData(null);
  };

  const handleBackClick = () => {
    if (
      rootUniverse != null &&
      (parentSpaceId === rootUniverse.universeId || parentSpaceId === -1)
    ) {
      setParentSpaceId(-1);
      setCurrentSpaceId(rootUniverse.universeId);
    }
    else {
      const parentId = getParentSpaceIdById(parentSpaceId);
      if (parentId != null) {
        setParentSpaceId(parentId);
        setCurrentSpaceId(parentSpaceId);
      }
    }
  };

  const calcBoxStyle = (start: PercentPoint, end: PercentPoint) => {
    const s = toPixel(start);
    const e = toPixel(end);
    const left = Math.min(s.x, e.x);
    const top = Math.min(s.y, e.y);
    const width = Math.abs(e.x - s.x);
    const height = Math.abs(e.y - s.y);

    return {
      left: `calc(50% - ${imageSize.width / 2}px + ${left}px)`,
      top: `calc(50% - ${imageSize.height / 2}px + ${top}px)`,
      width: `${width}px`,
      height: `${height}px`,
    };
  };

  useEffect(() => {
    if (innerImageId === -1) {
      setImgSrc(null);
      return;
    }

    const url = `${API_CONFIG.PUBLIC_IMAGE_LOAD_API}/${innerImageId}`;
    const img = new Image();

    img.src = url;
    img.onload = () => {
      setImgSrc(url);
      setLoading(false);
    };
    img.onerror = () => {
      setLoading(false);
      setImgSrc(null); // 실패 시 null 처리
    };
  }, [innerImageId]);

  return (
    <div
      className="relative w-full h-full"
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50">
          <SpinnerIcon />
        </div>
      )}



      {!loading && (
        <>
          {/* 뒤로가기 */}
          {currentSpaceId !== rootUniverse?.universeId && (
            <div
              className="absolute top-2 left-2 px-4 py-2 z-10 text-white cursor-pointer hover:opacity-90"
              onClick={handleBackClick}
            >
              <IoIosArrowBack size={24} />
            </div>
          )}

          {/* 이미지 */}
          {innerImageId !== -1 && (
            <img
              ref={imgRef}
              src={`${API_CONFIG.PUBLIC_IMAGE_LOAD_API}/${innerImageId}`}
              alt="space-image"
              loading="eager"
              className="object-contain block mx-auto max-h-full max-w-full"
              style={{ userSelect: "none", pointerEvents: "none" }}
              draggable={false}
              onLoad={() => setLoading(false)}
              onError={() => setLoading(false)}
            />
          )}

          {/* Hover crosshair */}
          {step === SpaceCreateStep.SetSize && hoverPos && !endPoint && (() => {
            const { x, y } = toPixel(hoverPos);
            const baseLeft = `calc(50% - ${imageSize.width / 2}px + ${x}px)`;
            const baseTop = `calc(50% - ${imageSize.height / 2}px + ${y}px)`;
            return (
              <>
                <div className="absolute w-3 h-3 bg-blue-400 rounded-full pointer-events-none" style={{ left: `calc(${baseLeft} - 6px)`, top: `calc(${baseTop} - 6px)` }} />
                <div className="absolute h-[1px] bg-blue-400 pointer-events-none" style={{ top: baseTop, left: `calc(50% - ${imageSize.width / 2}px)`, width: `${imageSize.width}px` }} />
                <div className="absolute w-[1px] bg-blue-400 pointer-events-none" style={{ left: baseLeft, top: `calc(50% - ${imageSize.height / 2}px)`, height: `${imageSize.height}px` }} />
              </>
            );
          })()}

          {/* Start / End 점 */}
          {startPoint && (
            <div className="absolute w-2 h-2 z-10 border-2 border-amber-400 bg-white pointer-events-none" style={{
              left: `calc(50% - ${imageSize.width / 2}px + ${toPixel(startPoint).x - 3}px)`,
              top: `calc(50% - ${imageSize.height / 2}px + ${toPixel(startPoint).y - 3}px)`,
            }} />
          )}

          {endPoint && (
            <div className="absolute w-2 h-2 z-10 border-2 border-amber-400 bg-white pointer-events-none" style={{
              left: `calc(50% - ${imageSize.width / 2}px + ${toPixel(endPoint).x - 5}px)`,
              top: `calc(50% - ${imageSize.height / 2}px + ${toPixel(endPoint).y - 5}px)`,
            }} />
          )}

          {/* 선택된 영역 박스 */}
          {startPoint && endPoint && (
            <div className="absolute border-2 border-amber-400 bg-amber-400/40 pointer-events-none" style={calcBoxStyle(startPoint, endPoint)} />
          )}

          {/* 기존 스페이스 박스 */}
          {existingSpaces.map((space, index) => (
            <div
              key={index}
              className="absolute"
              style={calcBoxStyle(
                { xPercent: space.startX, yPercent: space.startY },
                { xPercent: space.endX, yPercent: space.endY }
              )}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <div
                className={`w-full h-full border-3 border-amber-600 bg-white/70 cursor-pointer transition-opacity duration-300 ${hoveredIndex === index ? "opacity-100" : "opacity-30"}`}
                onClick={() => handleMoveToSpace(space)}
              />
            </div>
          ))}

          {/* 팝업 */}
          {popupData && (
            <div
              className="absolute bg-white p-2 rounded shadow-md max-w-xs text-sm z-30 transition-opacity duration-300 opacity-100 pointer-events-none"
              style={{
                left: `calc(50% - ${imageSize.width / 2}px + ${popupData.x}px)`,
                top: `calc(50% - ${imageSize.height / 2}px + ${popupData.y}px)`,
              }}
            >
              <div className="font-semibold">{popupData.title}</div>
              <div className="text-xs mt-1">{popupData.description}</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
