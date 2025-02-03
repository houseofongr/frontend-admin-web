import { CircleData, EllipseData, RectangleData } from "../types/items";
import { generateUniqueId } from "../utils/generateUniqueId";
import { getRandomColor } from "../utils/getRandomColor";

export class RectangleShape implements RectangleData {
  id: number;
  itemType: "rectangle";
  name: string;
  rectangleData: { x: number; y: number; width: number; height: number; rotation: number };
  fill: string;

  constructor() {
    this.id = generateUniqueId();
    this.itemType = "rectangle";
    this.name = "";
    this.rectangleData = { x: 100, y: 200, width: 150, height: 100, rotation: 0 };
    this.fill = getRandomColor();
  }
}

export class CircleShape implements CircleData {
  id: number;
  itemType: "circle";
  name: string;
  circleData: { x: number; y: number; radius: number };
  fill: string;

  constructor() {
    this.id = generateUniqueId();
    this.itemType = "circle";
    this.name = "";
    this.circleData = { x: 100, y: 200, radius: 50 };
    this.fill = getRandomColor();
  }
}

export class EllipseShape implements EllipseData {
  id: number;
  itemType: "ellipse";
  name: string;
  ellipseData: { x: number; y: number; radiusX: number; radiusY: number; rotation: number };
  fill: string;

  constructor() {
    this.id = generateUniqueId();
    this.itemType = "ellipse";
    this.name = "";
    this.ellipseData = { x: 200, y: 200, radiusX: 70, radiusY: 50, rotation: 0 };
    this.fill = getRandomColor();
  }
}
