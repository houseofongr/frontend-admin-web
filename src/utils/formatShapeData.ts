import { ShapeData } from "../types/items";

interface FormatOptions {
  includeId?: boolean;
}

// 새로 생성한 아이템에는 id값 포함X
// 기존 아이템에는 id 값 포함 o

export const formatShapeData = (shape: ShapeData, options: FormatOptions = {}) => {
  const baseData = {
    name: shape.name,
    itemType: shape.itemType.toUpperCase(),
    ...(options.includeId && { id: shape.id }),
  };

  if ("circleData" in shape && shape.circleData) {
    return {
      ...baseData,
      circleData: {
        x: Number(shape.circleData.x.toFixed(2)),
        y: Number(shape.circleData.y.toFixed(2)),
        radius: Number(shape.circleData.radius.toFixed(2)),
      },
    };
  } else if ("rectangleData" in shape && shape.rectangleData) {
    return {
      ...baseData,
      rectangleData: {
        x: Number(shape.rectangleData.x.toFixed(2)),
        y: Number(shape.rectangleData.y.toFixed(2)),
        width: Number(shape.rectangleData.width.toFixed(2)),
        height: Number(shape.rectangleData.height.toFixed(2)),
        rotation: Number(shape.rectangleData.rotation.toFixed(2)),
      },
    };
  } else if ("ellipseData" in shape && shape.ellipseData) {
    return {
      ...baseData,
      ellipseData: {
        x: Number(shape.ellipseData.x.toFixed(2)),
        y: Number(shape.ellipseData.y.toFixed(2)),
        radiusX: Number(shape.ellipseData.radiusX.toFixed(2)),
        radiusY: Number(shape.ellipseData.radiusY.toFixed(2)),
        rotation: Number(shape.ellipseData.rotation.toFixed(2)),
      },
    };
  }

  return baseData;
};
