import React, { useEffect, useRef } from "react";
import { Ellipse, Transformer } from "react-konva";
import Konva from "konva";

interface EllipseProps {
  shapeProps: Konva.ShapeConfig;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: Konva.ShapeConfig) => void;
}

const EllipseShape: React.FC<EllipseProps> = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef<Konva.Ellipse | null>(null);
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
      <Ellipse
        radiusX={30}
        radiusY={70}
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
};

export default EllipseShape;
