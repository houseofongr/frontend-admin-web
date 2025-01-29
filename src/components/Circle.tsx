import React, { useEffect, useRef } from "react";
import { Circle, Transformer } from "react-konva";
import Konva from "konva";

interface CircleProps {
  shapeProps: Konva.ShapeConfig;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: Konva.ShapeConfig) => void;
}

const CircleShape: React.FC<CircleProps> = ({ shapeProps, isSelected, onSelect, onChange }) => {
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
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        opacity={0.6}
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          if (!node) return;

          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);

          // 반지름 크기 조정
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
};

export default CircleShape;
