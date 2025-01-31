import { Rect, Transformer } from "react-konva";
import Konva from "konva";
import { useEffect, useRef } from "react";
import { RectangleData } from "../../types/items";

interface RectangleProps {
  shapeProps: RectangleData["rectangleData"];
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: RectangleData["rectangleData"]) => void;
  fill: string;
  isEditable: boolean;
}

function RectItem({ shapeProps, isSelected, onSelect, onChange, fill, isEditable }: RectangleProps) {
  const shapeRef = useRef<Konva.Rect | null>(null);
  const trRef = useRef<Konva.Transformer | null>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      const layer = trRef.current.getLayer();
      if (layer) {
        layer.batchDraw();
      }
    }
  }, [isSelected]);

  return (
    <>
      <Rect
        {...shapeProps}
        draggable
        listening={isEditable}
        fill={fill}
        opacity={0.6}
        stroke={"red"}
        strokeWidth={2}
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
            rotation: e.target.rotation(),
          });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          if (!node) return;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          const newWidth = Math.max(5, node.width() * scaleX);
          const newHeight = Math.max(5, node.height() * scaleY);

          node.scaleX(1);
          node.scaleY(1);

          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            width: newWidth,
            height: newHeight,
            rotation: node.rotation(),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          flipEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
}

export default RectItem;
