import { Stage, Layer, Image as KonvaImage } from "react-konva";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ShapeData } from "../../types/items";
import Konva from "konva";
import API_CONFIG from "../../config/api";
import RectItem from "./RectangleItem";
import CircleItem from "./CircleItem";
import EllipseItem from "./EllipseItem";
import SpinnerIcon from "../icons/SpinnerIcon";
import ShapeSelectorTool from "./ShapeSelectorTool";
import { RectangleShape, CircleShape, EllipseShape } from "../../constants/initialShapeData";
import CircleButton from "../common/buttons/CircleButton";
import { BsTrash3 } from "react-icons/bs";

type KonvaContainerProps = {
  shapes: ShapeData[];
  isEditable: boolean;
  imageId: number | null;
  selectedId: number | null;
  setSelectedId: (id: number | null) => void;
  setShapes: Dispatch<SetStateAction<ShapeData[]>>;
  deleteShape: (id: number) => void;
};

export default function KonvaContainer({
  shapes,
  isEditable,
  imageId,
  selectedId,
  setSelectedId,
  setShapes,
  deleteShape,
}: KonvaContainerProps) {
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0, scaleX: 1, scaleY: 1 });

  const checkedSelectShape = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };

  const addRect = () => {
    setShapes((prev) => [...prev, new RectangleShape()]);
  };

  const addCircle = () => {
    setShapes((prev) => [...prev, new CircleShape()]);
  };

  const addEllipse = () => {
    setShapes((prev) => [...prev, new EllipseShape()]);
  };

  useEffect(() => {
    if (!imageId) return;
    const image = new window.Image();

    image.src = `${API_CONFIG.PRIVATE_IMAGE_LOAD_API}/${imageId}`;
    image.onload = () => {
      const stageWidth = window.innerWidth;
      const stageHeight = window.innerHeight;

      const imgWidth = image.width;
      const imgHeight = image.height;

      const scaleX = stageWidth / imgWidth;
      const scaleY = stageHeight / imgHeight;
      const scale = Math.min(scaleX, scaleY);

      setImageSize({
        width: imgWidth * scale,
        height: imgHeight * scale,
        scaleX: scale,
        scaleY: scale,
      });
      setBackgroundImage(image);
    };
  }, [imageId]);

  if (!backgroundImage) return <SpinnerIcon />;
  return (
    <>
      {isEditable && <ShapeSelectorTool addRect={addRect} addCircle={addCircle} addEllipse={addEllipse} />}
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={checkedSelectShape}
        onTouchStart={checkedSelectShape}
      >
        <Layer>
          {backgroundImage && (
            <KonvaImage
              image={backgroundImage}
              x={(window.innerWidth - imageSize.width) / 2}
              y={(window.innerHeight - imageSize.height) / 2}
              width={imageSize.width}
              height={imageSize.height}
            />
          )}

          {shapes.map((shape, i) => {
            if ("rectangleData" in shape && shape.rectangleData) {
              return (
                <RectItem
                  key={shape.id}
                  fill={shape.fill ? shape.fill : "#ffff"}
                  shapeProps={shape.rectangleData}
                  isSelected={shape.id === selectedId}
                  isEditable={isEditable}
                  onSelect={() => setSelectedId(shape.id)}
                  onChange={(newAttrs) => {
                    const updatedShapes = shapes.slice();
                    updatedShapes[i] = { ...shape, rectangleData: newAttrs };
                    setShapes(updatedShapes);
                  }}
                />
              );
            } else if ("circleData" in shape && shape.circleData) {
              return (
                <CircleItem
                  key={shape.id}
                  fill={shape.fill ? shape.fill : "#ffff"}
                  shapeProps={shape.circleData}
                  isSelected={shape.id === selectedId}
                  isEditable={isEditable}
                  onSelect={() => setSelectedId(shape.id)}
                  onChange={(newAttrs) => {
                    const updatedShapes = shapes.slice();
                    updatedShapes[i] = { ...shape, circleData: newAttrs };
                    setShapes(updatedShapes);
                  }}
                />
              );
            } else if ("ellipseData" in shape && shape.ellipseData) {
              return (
                <EllipseItem
                  key={shape.id}
                  fill={shape.fill ? shape.fill : "#ffff"}
                  shapeProps={shape.ellipseData}
                  isSelected={shape.id === selectedId}
                  isEditable={isEditable}
                  onSelect={() => setSelectedId(shape.id)}
                  onChange={(newAttrs) => {
                    const updatedShapes = shapes.slice();
                    updatedShapes[i] = { ...shape, ellipseData: newAttrs };
                    setShapes(updatedShapes);
                  }}
                />
              );
            }
            return null;
          })}
        </Layer>
      </Stage>
      {/* 휴지통 */}
      {selectedId && (
        <div className="fixed bottom-5 left-5 text-white ">
          <CircleButton label={<BsTrash3 size={30} onClick={() => deleteShape(selectedId)} />} />
        </div>
      )}
    </>
  );
}
