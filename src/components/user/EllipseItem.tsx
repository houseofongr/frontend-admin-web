import { Ellipse, Transformer } from "react-konva";
import Konva from "konva";
import { useEffect, useRef } from "react";
import { EllipseData } from "../../types/items";

interface EllipseProps {
  shapeProps: EllipseData["ellipseData"];
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: EllipseData["ellipseData"]) => void;
  fill: string;
  isEditable: boolean;
}

function EllipseItem({ shapeProps, isSelected, onSelect, onChange, fill, isEditable }: EllipseProps) {
  const shapeRef = useRef<Konva.Ellipse | null>(null);
  const trRef = useRef<Konva.Transformer | null>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);
  return (
    <>
      <Ellipse
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
          const rotation = node.rotation();

          node.scaleX(1);
          node.scaleY(1);

          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            radiusX: Math.max(5, node.radiusX() * scaleX),
            radiusY: Math.max(5, node.radiusY() * scaleY),
            rotation: rotation,
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

export default EllipseItem;
