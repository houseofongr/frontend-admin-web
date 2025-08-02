import React, { useState, useRef, useEffect } from "react";
import API_CONFIG from "../../../config/api";
import {
  SpacePiece_CreateEditStep,
} from "../../../constants/ProcessSteps";
import { useUniverseStore } from "../../../context/useUniverseStore";
import { PieceType } from "../../../context/usePieceStore";
import { SpaceType } from "../../../context/useSpaceStore";
import { IoIosArrowBack } from "react-icons/io";
import SpinnerIcon from "../../../components/icons/SpinnerIcon";
import { ScaleLoader } from "react-spinners";
import { useSpaceStore } from "../../../context/useSpaceStore";
import { usePieceStore } from "../../../context/usePieceStore";

interface PercentPoint {
  xPercent: number;
  yPercent: number;
}

interface SpaceSelectorProps {
  innerImageId: number | null;
  startPoint: PercentPoint | null;
  endPoint: PercentPoint | null;
  setStartPoint: React.Dispatch<React.SetStateAction<PercentPoint | null>>;
  setEndPoint: React.Dispatch<React.SetStateAction<PercentPoint | null>>;
}

export default function SpaceSelector({
  innerImageId,
  startPoint,
  endPoint,
  setStartPoint,
  setEndPoint,
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
  const [hoveredSpaceIndex, setHoveredSpaceIndex] = useState<number | null>(null);
  const [hoveredPieceIndex, setHoveredPieceIndex] = useState<number | null>(null);
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
  }, [imgSrc]); // ← innerImageId가 아니라 imgSrc로 변경

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
    const pos = getRelativePercentPos(e);
    if (!pos) return;

    if (!startPoint) setStartPoint(pos);
    else if (!endPoint) setEndPoint(pos);
    else {
      setStartPoint(pos);
      setEndPoint(null);
    }
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
    console.log(piece);
    
  };
  const handleSpaceMouseEnter = (index: number) => {
    const space = existingSpaces[index];
    // const start = toPixel({ xPercent: space.startX, yPercent: space.startY });
    // const end = toPixel({ xPercent: space.endX, yPercent: space.endY });
    // const left = Math.min(start.x, end.x);
    // const top = Math.min(start.y, end.y);
    // const width = Math.abs(end.x - start.x);
    // const height = Math.abs(end.y - start.y);

    // setHoveredSpaceIndex(index);
    // setPopupData({
    //   x: left + width / 2 + 10,
    //   y: top + height / 2 + 5,
    //   title: space.title,
    //   description: space.description,
    // });
  };

  const handlePieceMouseEnter = (index: number) => {
    const piece = existingPieces[index];
    // const start = toPixel({ xPercent: piece.startX, yPercent: piece.startY });
    // const end = toPixel({ xPercent: piece.endX, yPercent: piece.endY });
    // const left = Math.min(start.x, end.x);
    // const top = Math.min(start.y, end.y);
    // const width = Math.abs(end.x - start.x);
    // const height = Math.abs(end.y - start.y);

    // setHoveredPieceIndex(index);
    // setPopupData({
    //   x: left + width / 2 + 10,
    //   y: top + height / 2 + 5,
    //   title: piece.title,
    //   description: piece.description,
    // });
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

          {/* 크로스헤어 */}
          {hoverPos &&
            ((editStep === SpacePiece_CreateEditStep.Space_SetSizeOnCreate &&
              !endPoint) ||
              editStep === SpacePiece_CreateEditStep.Space_SetSizeOnEdit ||
              editStep === SpacePiece_CreateEditStep.Piece_SetSizeOnCreate ||
              editStep === SpacePiece_CreateEditStep.Piece_SetSizeOnEdit) &&
            (() => {
              const { x, y } = toPixel(hoverPos);
              const left = `calc(50% - ${imageSize.width / 2}px + ${x}px)`;
              const top = `calc(50% - ${imageSize.height / 2}px + ${y}px)`;
              return (
                <>
                  {console.log("ddd")}
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

          {/* 시작점/끝점 */}
          {startPoint && (
            <div
              className="absolute w-2 h-2 z-10 border-2 border-amber-400 bg-white pointer-events-none"
              style={{
                left: `calc(50% - ${imageSize.width / 2}px + ${
                  toPixel(startPoint).x - 3
                }px)`,
                top: `calc(50% - ${imageSize.height / 2}px + ${
                  toPixel(startPoint).y - 3
                }px)`,
              }}
            />
          )}
          {endPoint && (
            <div
              className="absolute w-2 h-2 z-10 border-2 border-amber-400 bg-white pointer-events-none"
              style={{
                left: `calc(50% - ${imageSize.width / 2}px + ${
                  toPixel(endPoint).x - 5
                }px)`,
                top: `calc(50% - ${imageSize.height / 2}px + ${
                  toPixel(endPoint).y - 5
                }px)`,
              }}
            />
          )}

          {/* 선택 영역 박스 */}
          {startPoint && endPoint && (
            <div
              className="absolute border-2 border-amber-400 bg-amber-400/40 pointer-events-none"
              style={calcBoxStyle(startPoint, endPoint)}
            />
          )}

          {/* 기존 스페이스 박스 */}
          {editStep != SpacePiece_CreateEditStep.Piece_SetSizeOnEdit &&
            existingSpaces.map((space, index) => (
              <div
                key={`space-${index}`}
                className="absolute"
                // style={calcBoxStyle(
                //   { xPercent: space.startX, yPercent: space.startY },
                //   { xPercent: space.endX, yPercent: space.endY }
                // )}
                onMouseEnter={() => handleSpaceMouseEnter(index)}
                onMouseLeave={handleSpaceMouseLeave}
              >
                <div
                  className={`w-full h-full border-3 border-amber-600 bg-white/70 cursor-pointer transition-opacity duration-300 ${
                    hoveredSpaceIndex === index ? "opacity-100" : "opacity-30"
                  }`}
                  onClick={() => handleMoveToSpace(space)}
                />
              </div>
            ))}

          {editStep != SpacePiece_CreateEditStep.Piece_SetSizeOnEdit &&
            existingPieces.map((piece, index) => (
              <div
                key={`piece-${index}`}
                className="absolute"
                // style={calcBoxStyle(
                //   { xPercent: piece.startX, yPercent: piece.startY },
                //   { xPercent: piece.endX, yPercent: piece.endY }
                // )}
                onMouseEnter={() => handlePieceMouseEnter(index)}
                onMouseLeave={handlePieceMouseLeave}
              >
                <div
                  className={`w-full h-full border-3 border-blue-600 bg-white/70 cursor-pointer transition-opacity duration-300 ${
                    hoveredPieceIndex === index ? "opacity-100" : "opacity-30"
                  }`}
                  onClick={() => handleMoveToPiece(piece)}
                />
              </div>
            ))}

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
