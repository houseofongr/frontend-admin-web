import React, { useState, useRef, useEffect } from "react";
import API_CONFIG from "../../../config/api";
import { SpacePiece_CreateEditStep } from "../../../constants/ProcessSteps";
import { useUniverseStore } from "../../../context/useUniverseStore";
import { PieceType } from "../../../context/usePieceStore";
import { SpaceType } from "../../../context/useSpaceStore";
import { IoIosArrowBack } from "react-icons/io";
import SpinnerIcon from "../../../components/icons/SpinnerIcon";
import { ScaleLoader } from "react-spinners";
import { useSpaceStore } from "../../../context/useSpaceStore";
import { usePieceStore } from "../../../context/usePieceStore";
import { PercentPoint } from "../../../constants/image";

interface SpaceSelectorProps {
  innerImageId: number | null;
  selectedPoints: PercentPoint[];
  isSelectedComplete: boolean;
  setSelectedPoints: React.Dispatch<React.SetStateAction<PercentPoint[]>>;
  setIsSelectedComplete: () => void;
}

export default function SpaceSelector_MultiSelect({
  innerImageId,
  selectedPoints,
  isSelectedComplete,
  setSelectedPoints,
  setIsSelectedComplete,

}: SpaceSelectorProps) {
  const { rootUniverse, editStep } = useUniverseStore();

  const {
    currentSpaceId,
    setParentSpaceId,
    setCurrentSpaceId,
    setCurrentSpace,
    parentSpaceId,
    getParentSpaceIdById,
    existingSpaces,
  } = useSpaceStore();

  const { existingPieces, setCurrentPiece } = usePieceStore();

  const [hoverPos, setHoverPos] = useState<PercentPoint | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [hoveredSpaceIndex, setHoveredSpaceIndex] = useState<number | null>(
    null
  );
  const [hoveredPieceIndex, setHoveredPieceIndex] = useState<number | null>(
    null
  );
  const [popupData, setPopupData] = useState<{
    x: number;
    y: number;
    title: string;
    description: string;
  } | null>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const imgRef = useRef<HTMLImageElement>(null);

  // 이미지 크기 추적
  useEffect(() => {
    if (!imgRef.current) return;

    const updateSize = () => {
      setImageSize({
        width: imgRef.current?.clientWidth ?? 0,
        height: imgRef.current?.clientHeight ?? 0,
      });
    };

    const observer = new ResizeObserver(updateSize);

    // 다음 프레임에서 observer 등록
    requestAnimationFrame(() => {
      if (imgRef.current) {
        observer.observe(imgRef.current);
        updateSize(); // 초기 호출
      }
    });

    return () => observer.disconnect();
  }, [imgSrc]);

  // 이미지 로딩
  useEffect(() => {
    if (innerImageId === -1 || innerImageId === null) {
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
      setImgSrc(null);
      setLoading(false);
    };
  }, [innerImageId]);

  // 유틸 함수
  const toPixel = (point: PercentPoint) => ({
    x: point.x * imageSize.width,
    y: point.y * imageSize.height,
  });

  const getRelativePercentPos = (e: React.MouseEvent): PercentPoint | null => {
    if (!imgRef.current) return null;
    const rect = imgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (x < 0 || y < 0 || x > rect.width || y > rect.height) return null;
    return { x: x / rect.width, y: y / rect.height };
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

  // 이벤트 핸들러
  const handleMouseMove = (e: React.MouseEvent) => {
    if (
      editStep === SpacePiece_CreateEditStep.Space_SetSizeOnCreate ||
      editStep === SpacePiece_CreateEditStep.Space_SetSizeOnEdit ||
      editStep === SpacePiece_CreateEditStep.Piece_SetSizeOnCreate ||
      editStep === SpacePiece_CreateEditStep.Piece_SetSizeOnEdit
    ) {
      setHoverPos(getRelativePercentPos(e));
    } else {
      setHoverPos(null);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (
      editStep !== SpacePiece_CreateEditStep.Space_SetSizeOnCreate &&
      editStep !== SpacePiece_CreateEditStep.Space_SetSizeOnEdit &&
      editStep !== SpacePiece_CreateEditStep.Piece_SetSizeOnCreate &&
      editStep !== SpacePiece_CreateEditStep.Piece_SetSizeOnEdit
    )
      return;

    if (isSelectedComplete) return;

    const pos = getRelativePercentPos(e);
    if (!pos) return;

    // 첫 점과 닫기 확인
    if (selectedPoints.length >= 3) {
      const first = toPixel(selectedPoints[0]);
      const current = toPixel(pos);
      const distance = Math.sqrt(
        Math.pow(first.x - current.x, 2) + Math.pow(first.y - current.y, 2)
      );

      if (distance < 10) {
        // 10px 이내 클릭 시 종료
        setIsSelectedComplete();
        return;
      }
    }

    // 새 점 추가
    setSelectedPoints((prev) => [...prev, pos]);
  };

  // 화면 전환 함수
  const handleMoveToSpace = (space: SpaceType) => {
    setParentSpaceId(currentSpaceId ?? -1);
    setCurrentSpaceId(space.spaceId);
    setCurrentSpace(space);
    setPopupData(null);
  };

  const handleMoveToPiece = (piece: PieceType) => {
    setCurrentPiece(piece);
  };

  const pointInPolygon = (point: { x: number; y: number }, polygon: { x: number; y: number }[]) => {
    let inside = false;
    const { x, y } = point;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x, yi = polygon[i].y;
      const xj = polygon[j].x, yj = polygon[j].y;

      const intersect =
        yi > y !== yj > y &&
        x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

      if (intersect) inside = !inside;
    }

    return inside;
  }

  function isPointInPolygon(point: { x: number; y: number }, polygon: { x: number; y: number }[]) {
    let inside = false;
    const { x, y } = point;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x,
        yi = polygon[i].y;
      const xj = polygon[j].x,
        yj = polygon[j].y;

      const intersect =
        yi > y !== yj > y &&
        x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

      if (intersect) inside = !inside;
    }

    return inside;
  }



  const handleSpaceMouseEnter = (index: number) => {
    const space = existingSpaces[index];
    const firstPoint = space.points[0];

    if (!firstPoint) return;

    const pixel = toPixel(firstPoint);

    setHoveredSpaceIndex(index);
    setPopupData({
      x: pixel.x + 10, // 살짝 오른쪽
      y: pixel.y + 5,  // 살짝 아래
      title: space.title,
      description: space.description,
    });
  };

  const handlePieceMouseEnter = (index: number) => {
    const piece = existingPieces[index];
    const firstPoint = piece.points[0];

    if (!firstPoint) return;

    const pixel = toPixel(firstPoint);

    setHoveredPieceIndex(index);
    setPopupData({
      x: pixel.x + 10, // 오른쪽으로 살짝
      y: pixel.y + 5,  // 아래로 살짝
      title: piece.title,
      description: piece.description,
    });
  };

  const handleSpaceMouseLeave = () => {
    setHoveredSpaceIndex(null);
    setPopupData(null);
  };

  const handlePieceMouseLeave = () => {
    setHoveredPieceIndex(null);
    setPopupData(null);
  };

  const handleBackClick = () => {
    if (parentSpaceId == -1) {
      setParentSpaceId(-1);
      setCurrentSpaceId(-1);
    } else {
      const parentId = getParentSpaceIdById(parentSpaceId);
      if (parentId != null) {
        setParentSpaceId(parentId);
        setCurrentSpaceId(parentSpaceId);
      }
    }
  };

  return (
    <div
      className="relative w-full h-full"
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70">
          <ScaleLoader width={2} height={40} color="#F5946D" />
        </div>
      )}

      {!loading && (
        <>
          {/* 뒤로가기 */}
          {currentSpaceId !== rootUniverse?.universeId &&
            currentSpaceId !== -1 && (
              <div
                className="absolute top-2 left-2 px-4 py-2 z-10 text-white cursor-pointer hover:opacity-90"
                onClick={handleBackClick}
              >
                <IoIosArrowBack size={24} />
              </div>
            )}

          {/* <video
            src="/video/videoTest.mp4"
            autoPlay
            muted
            loop
            className="absolute top-1/2 left-1/2 max-h-full max-w-full object-contain"
            style={{
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
              userSelect: "none",
            }}
            draggable={false}
          /> */}
          {/* 이미지 */}
          {imgSrc && (
            <img
              ref={imgRef}
              src={imgSrc}
              alt="space-image"
              loading="eager"
              className="object-contain block mx-auto max-h-full max-w-full"
              style={{ userSelect: "none", pointerEvents: "none" }}
              draggable={false}
            />
          )}

          {selectedPoints.map((point, index) => {
            const { x, y } = toPixel(point);
            const left = `calc(50% - ${imageSize.width / 2}px + ${x}px)`;
            const top = `calc(50% - ${imageSize.height / 2}px + ${y}px)`;

            const isFirst =
              index === 0 && !isSelectedComplete && selectedPoints.length >= 3;

            return (
              <div
                key={`selected-point-${index}`}
                className={`absolute z-10 w-3 h-3 rounded-full cursor-pointer transition-transform
                          ${isFirst ? "bg-red-300 animate-pulse" : "bg-red-500"
                  } hover:scale-125`}
                style={{
                  left: `calc(${left} - 6px)`,
                  top: `calc(${top} - 6px)`,
                }}
                onClick={(e) => {
                  e.stopPropagation();

                  if (isFirst && !isSelectedComplete && selectedPoints.length >= 3) {
                    setIsSelectedComplete();
                  } else {
                    setSelectedPoints((prev) =>
                      prev.filter((_, i) => i !== index)
                    );
                  }
                }}
                title={isFirst ? "클릭하면 마무리" : "클릭해서 삭제"}
              />
            );
          })}

          {/* 선 연결 SVG */}
          {selectedPoints.length > 0 && (
            <svg
              className="absolute top-1/2 left-1/2 z-10 pointer-events-none"
              style={{
                transform: "translate(-50%, -50%)",
                width: imageSize.width,
                height: imageSize.height,
              }}
            >
              <polyline
                points={(!isSelectedComplete
                  ? selectedPoints
                  : [...selectedPoints, selectedPoints[0]]
                )
                  .map((point) => {
                    const { x, y } = toPixel(point);
                    return `${x},${y}`;
                  })
                  .join(" ")}
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
              />
            </svg>
          )}


          {/* 크로스헤어 */}
          {hoverPos &&
            (!isSelectedComplete && (
              editStep === SpacePiece_CreateEditStep.Space_SetSizeOnCreate ||
              editStep === SpacePiece_CreateEditStep.Space_SetSizeOnEdit ||
              editStep === SpacePiece_CreateEditStep.Piece_SetSizeOnCreate ||
              editStep === SpacePiece_CreateEditStep.Piece_SetSizeOnEdit)) &&
            (() => {
              const { x, y } = toPixel(hoverPos);
              const left = `calc(50% - ${imageSize.width / 2}px + ${x}px)`;
              const top = `calc(50% - ${imageSize.height / 2}px + ${y}px)`;
              return (
                <>
                  <div
                    className="absolute w-3 h-3 bg-blue-400 rounded-full pointer-events-none z-10"
                    style={{
                      left: `calc(${left} - 6px)`,
                      top: `calc(${top} - 6px)`,
                    }}
                  />
                  <div
                    className="absolute h-[1px] bg-blue-400 pointer-events-none z-10"
                    style={{
                      top,
                      left: `calc(50% - ${imageSize.width / 2}px)`,
                      width: `${imageSize.width}px`,
                    }}
                  />
                  <div
                    className="absolute w-[1px] bg-blue-400 pointer-events-none z-10"
                    style={{
                      left,
                      top: `calc(50% - ${imageSize.height / 2}px)`,
                      height: `${imageSize.height}px`,
                    }}
                  />
                </>
              );
            })()}

          {/* 기존 스페이스 박스 */}
          {editStep !== SpacePiece_CreateEditStep.Piece_SetSizeOnEdit && (
            <svg
              className="absolute top-1/2 left-1/2 z-10"
              style={{
                transform: "translate(-50%, -50%)",
                width: imageSize.width,
                height: imageSize.height,
                pointerEvents: "none", // 개별 polygon에만 이벤트 적용
              }}
            >
              {existingSpaces.map((space, index) => {
                const points = space.points
                  .map((point) => {
                    const { x, y } = toPixel(point);
                    return `${x},${y}`;
                  })
                  .join(" ");

                const isHovered = hoveredSpaceIndex === index;

                return (
                  <polygon
                    key={`space-${index}`}
                    points={points}
                    fill="white"
                    fillOpacity={isHovered ? 0.7 : 0.3}
                    stroke="#f59e0b" // amber-600
                    strokeWidth={3}
                    className="cursor-pointer transition-opacity duration-300"
                    onMouseEnter={() => handleSpaceMouseEnter(index)}
                    onMouseLeave={handleSpaceMouseLeave}
                    onClick={() => handleMoveToSpace(space)}
                    style={{ pointerEvents: "auto" }}
                  />
                );
              })}
            </svg>
          )}


          {/* 기존 피스 박스 */}
          {editStep !== SpacePiece_CreateEditStep.Piece_SetSizeOnEdit && (
            <svg
              className="absolute top-1/2 left-1/2 z-10"
              style={{
                transform: "translate(-50%, -50%)",
                width: imageSize.width,
                height: imageSize.height,
                pointerEvents: "none", // polygon에만 이벤트 적용
              }}
            >
              {existingPieces.map((piece, index) => {
                const points = piece.points
                  .map((point) => {
                    const { x, y } = toPixel(point);
                    return `${x},${y}`;
                  })
                  .join(" ");

                const isHovered = hoveredPieceIndex === index;

                return (
                  <polygon
                    key={`piece-${index}`}
                    points={points}
                    fill="white"
                    fillOpacity={isHovered ? 0.7 : 0.3}
                    stroke="#2563eb" // blue-600
                    strokeWidth={3}
                    className="cursor-pointer transition-opacity duration-300"
                    onMouseEnter={() => handlePieceMouseEnter(index)}
                    onMouseLeave={handlePieceMouseLeave}
                    onClick={() => handleMoveToPiece(piece)}
                    style={{ pointerEvents: "auto" }}
                  />
                );
              })}
            </svg>
          )}


          {/* 팝업 */}
          {popupData && (
            <div
              className="absolute bg-white p-2 rounded shadow-md max-w-xs text-sm z-30 pointer-events-none"
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
