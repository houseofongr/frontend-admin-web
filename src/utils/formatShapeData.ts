import { ShapeData } from "../types/items";

interface FormatOptions {
  includeId?: boolean;
}

export interface ImageSize {
  width: number;
  height: number;
  scale: number;
  scaleAxis: string;
}

// 새로 생성한 아이템에는 id값 포함X
// 기존 아이템에는 id 값 포함 o

export const formatShapeData = (shape: ShapeData, imageSize: ImageSize, options: FormatOptions = {}) => {
  const baseData = {
    name: shape.name,
    itemType: shape.itemType.toUpperCase(),
    ...(options.includeId && { id: shape.id }),
  };

  const offsetX = (window.innerWidth - imageSize.width * imageSize.scale) / 2;
  const offsetY = (window.innerHeight - imageSize.height * imageSize.scale) / 2;
  const offsetWay = imageSize.scaleAxis;

  if ("circleData" in shape && shape.circleData) {
    return {
      ...baseData,
      circleData: {
        // x: Number(((shape.circleData.x - offsetX) / imageSize.scale).toFixed(2)),
        // y: Number(((shape.circleData.y - offsetY) / imageSize.scale).toFixed(2)),
        x: Number(((shape.circleData.x - (offsetWay === "X" ? 0 : offsetX)) / imageSize.scale).toFixed(2)),
        y: Number(((shape.circleData.y - (offsetWay === "Y" ? 0 : offsetY)) / imageSize.scale).toFixed(2)),
        radius: Number((shape.circleData.radius / imageSize.scale).toFixed(2)),
      },
    };
  } else if ("rectangleData" in shape && shape.rectangleData) {
    return {
      ...baseData,
      rectangleData: {
        // x: Number(((shape.rectangleData.x - offsetX) / imageSize.scale).toFixed(2)),
        // y: Number(((shape.rectangleData.y - offsetY) / imageSize.scale).toFixed(2)),
        x: Number(((shape.rectangleData.x - (offsetWay === "X" ? 0 : offsetX)) / imageSize.scale).toFixed(2)),
        y: Number(((shape.rectangleData.y - (offsetWay === "Y" ? 0 : offsetY)) / imageSize.scale).toFixed(2)),
        width: Number((shape.rectangleData.width / imageSize.scale).toFixed(2)),
        height: Number((shape.rectangleData.height / imageSize.scale).toFixed(2)),
        rotation: Number(shape.rectangleData.rotation.toFixed(2)),
      },
    };
  } else if ("ellipseData" in shape && shape.ellipseData) {
    return {
      ...baseData,
      ellipseData: {
        // x: Number(((shape.ellipseData.x - offsetX) / imageSize.scale).toFixed(2)),
        // y: Number(((shape.ellipseData.y - offsetY) / imageSize.scale).toFixed(2)),
        x: Number(((shape.ellipseData.x - (offsetWay === "X" ? 0 : offsetX)) / imageSize.scale).toFixed(2)),
        y: Number(((shape.ellipseData.y - (offsetWay === "Y" ? 0 : offsetY)) / imageSize.scale).toFixed(2)),
        radiusX: Number((shape.ellipseData.radiusX / imageSize.scale).toFixed(2)),
        radiusY: Number((shape.ellipseData.radiusY / imageSize.scale).toFixed(2)),
        rotation: Number(shape.ellipseData.rotation.toFixed(2)),
      },
    };
  }

  return baseData;
};
