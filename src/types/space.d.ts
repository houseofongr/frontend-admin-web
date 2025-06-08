export type ElementNode = {
  elementId: number;
  parentSpaceId: number | null;
  innerImageId: number;
  depth: number;
  title: string;
  description: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

export type SpaceNode = {
  spaceId: number;
  parentSpaceId: number | null;
  innerImageId: number;
  depth: number;
  title: string;
  description: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  spaces: SpaceNode[];
  elements: ElementNode[];
};

export type UniverseData = {
  universeId: number;
  innerImageId: number;
  spaces: SpaceNode[];
  elements: ElementNode[];
};
