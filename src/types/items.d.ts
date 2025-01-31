export interface BaseShapeData {
  id: string;
  itemType: "rectangle" | "circle" | "ellipse";
  name: string;
  fill?: string;
}

export interface RectangleShapeProps {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export interface CircleShapeProps {
  x: number;
  y: number;
  radius: number;
}

export interface EllipseShpaeProps {
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  rotation: number;
}

export interface RectangleData extends BaseShapeData {
  itemType: "rectangle";
  rectangleData: RectangleShapeProps;
}

export interface CircleData extends BaseShapeData {
  itemType: "circle";
  circleData: CircleShapeProps;
}

export interface EllipseData extends BaseShapeData {
  itemType: "ellipse";
  ellipseData: EllipseShpaeProps;
}

export type ShapeData = RectangleData | CircleData | EllipseData;
