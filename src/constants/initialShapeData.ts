import { CircleData, EllipseData, RectangleData } from "../types/items";
import { generateUniqueId } from "../utils/generateUniqueId";
import { getRandomColor } from "../utils/getRandomColor";

export const newRect: RectangleData = {
  id: generateUniqueId(),
  itemType: "rectangle",
  name: "",
  rectangleData: { x: 100, y: 200, width: 150, height: 100, rotation: 0 },
  fill: getRandomColor(),
};

export const newCircle: CircleData = {
  id: generateUniqueId(),
  itemType: "circle",
  name: "",
  circleData: { x: 100, y: 200, radius: 50 },
  fill: getRandomColor(),
};

export const newEllipse: EllipseData = {
  id: generateUniqueId(),
  itemType: "ellipse",
  name: "",
  ellipseData: { x: 200, y: 200, radiusX: 70, radiusY: 50, rotation: 0 },
  fill: getRandomColor(),
};
