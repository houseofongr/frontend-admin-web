export const UniverseCategory = {
  GOVERNMENT_AND_PUBLIC_INSTITUTION: "정부/기관",
  HEALTH_INSTITUTION: "의료재단",
  LIFE: "라이프",
  FASHION_AND_BEAUTY: "패션/뷰티",
};

export enum PublicStatusOption {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
}

type Option = {
  value: string;
  label: string;
};

export const UniverseCategoryOptions: Option[] = Object.entries(
  UniverseCategory
).map(([value, label]) => ({
  value,
  label,
}));