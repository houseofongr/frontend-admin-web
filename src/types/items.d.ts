export interface RectangleData extends Konva.ShapeConfig {
  id: string;
  type: "rectangle";
  width: number;
  height: number;
  x: number;
  y: number;
  rotation: number;
  itemName: string;
  fill?: string;
}

export interface CircleData extends Konva.ShapeConfig {
  id: string;
  type: "circle";
  x: number;
  y: number;
  radius: number;
  itemName: string;
  fill?: string;
}

export interface EllipseData extends Konva.ShapeConfig {
  id: string;
  type: "ellipse";
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  rotation: number;
  itemName: string;
  fill?: string;
}

export type ShapeData = RectangleData | CircleData | EllipseData;
