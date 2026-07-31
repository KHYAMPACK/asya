export type FlowerId = "gul" | "papatya" | "lale" | "orkide";

export type FlowerOption = {
  id: FlowerId;
  label: string;
  /** Accent color for bloom */
  color: string;
  petal: string;
};

export const flowerOptions: FlowerOption[] = [
  {
    id: "gul",
    label: "Gül",
    color: "#e85d6c",
    petal: "#ff8a96",
  },
  {
    id: "papatya",
    label: "Papatya",
    color: "#f0c84a",
    petal: "#fff7e0",
  },
  {
    id: "lale",
    label: "Lale",
    color: "#c45b8c",
    petal: "#e891b5",
  },
  {
    id: "orkide",
    label: "Orkide",
    color: "#8b6bc9",
    petal: "#c4a8ef",
  },
];

export const flowerById = Object.fromEntries(
  flowerOptions.map((f) => [f.id, f]),
) as Record<FlowerId, FlowerOption>;
