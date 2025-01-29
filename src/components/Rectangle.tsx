import React, { useEffect, useRef } from "react";
import { Rect, Transformer } from "react-konva";
import Konva from "konva";

interface RectangleProps {
  shapeProps: Konva.ShapeConfig;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: Konva.ShapeConfig) => void;
}

const RectangleShape: React.FC<RectangleProps> = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef<Konva.Rect | null>(null);
  const trRef = useRef<Konva.Transformer | null>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      // 트랜스포머를 수동으로 연결하기 전에 null 체크
      trRef.current.nodes([shapeRef.current]);
      const layer = trRef.current.getLayer();
      if (layer) {
        layer.batchDraw(); // getLayer()가 null이 아닌 경우에만 호출
      }
    }
  }, [isSelected]);

  return (
    <>
      <Rect
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
            rotation: e.target.rotation(),
          });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          if (!node) return;

          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          const rotation = node.rotation();

          // 크기 조정 후 스케일 초기화
          node.scaleX(1);
          node.scaleY(1);

          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(5, node.height() * scaleY),
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
};

export default RectangleShape;
