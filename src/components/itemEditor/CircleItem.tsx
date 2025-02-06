import Konva from "konva";
import { useEffect, useRef } from "react";
import { Circle, Transformer } from "react-konva";
import { CircleData } from "../../types/items";

interface CircleProps {
  shapeProps: CircleData["circleData"];
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: CircleData["circleData"]) => void;
  fill: string;
  isEditable: boolean;
}

function CircleItem({ shapeProps, isSelected, onSelect, onChange, fill, isEditable }: CircleProps) {
  const shapeRef = useRef<Konva.Circle | null>(null);
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
      <Circle
        {...shapeProps}
        fill={fill}
        draggable
        listening={isEditable}
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
          });
        }}
        onTransformEnd={() => {
          //radius transform
          const node = shapeRef.current;
          if (!node) return;

          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);

          const newRadius = Math.max(5, node.radius() * Math.max(scaleX, scaleY));

          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            radius: newRadius,
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

export default CircleItem;
