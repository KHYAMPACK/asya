export type ChoiceOption = {
  id: string;
  label: string;
};

export type ChoiceQuestion = {
  id: string;
  type: "choice";
  prompt: string;
  options: ChoiceOption[];
};

export type StubbornBehavior = "run" | "shrink" | "shake-vanish";

export type StubbornYesQuestion = {
  id: string;
  type: "stubbornYes";
  prompt: string;
  yesLabel: string;
  noLabel: string;
  behavior: StubbornBehavior;
  gagLines: string[];
};

export type Question = ChoiceQuestion | StubbornYesQuestion;

export type ColorTheme = {
  id: string;
  label: string;
  /** Fill used for the expand + background */
  bg: string;
  ink: string;
  inkSoft: string;
  accent: string;
  /** true = light text on dark bg */
  dark?: boolean;
};

export const colorThemes: ColorTheme[] = [
  {
    id: "mavi",
    label: "Mavi",
    bg: "#6eb0d6",
    ink: "#132029",
    inkSoft: "#2a3f4d",
    accent: "#1f5f86",
  },
  {
    id: "pembe",
    label: "Pembe",
    bg: "#f0a8c0",
    ink: "#2a1520",
    inkSoft: "#5a3344",
    accent: "#c45d7a",
  },
  {
    id: "yesil",
    label: "Yeşil",
    bg: "#7cbc9a",
    ink: "#14261d",
    inkSoft: "#2f4a3c",
    accent: "#2f7a58",
  },
  {
    id: "sari",
    label: "Sarı",
    bg: "#f0d56a",
    ink: "#2a2408",
    inkSoft: "#5a4e1c",
    accent: "#c49a12",
  },
  {
    id: "turuncu",
    label: "Turuncu",
    bg: "#f0a06a",
    ink: "#2a180c",
    inkSoft: "#5a3720",
    accent: "#c45f22",
  },
  {
    id: "mor",
    label: "Mor",
    bg: "#a894d6",
    ink: "#1c1430",
    inkSoft: "#3d3358",
    accent: "#6a4fb0",
  },
  {
    id: "kirmizi",
    label: "Kırmızı",
    bg: "#e87878",
    ink: "#2a1212",
    inkSoft: "#5a2c2c",
    accent: "#b83a3a",
  },
  {
    id: "siyah",
    label: "Siyah",
    bg: "#1a1f24",
    ink: "#f4f1ec",
    inkSoft: "#c5c0b8",
    accent: "#e86f5c",
    dark: true,
  },
];

export const colorThemeById = Object.fromEntries(
  colorThemes.map((t) => [t.id, t]),
) as Record<string, ColorTheme>;

export const questions: Question[] = [
  {
    id: "favori-renk",
    type: "choice",
    prompt: "En sevdiğin renk ne?",
    options: colorThemes.map((t) => ({ id: t.id, label: t.label })),
  },
];

export const activityQuestion: ChoiceQuestion = {
  id: "aktivite",
  type: "choice",
  prompt: "Buluşmada ne yapalım?",
  options: [
    { id: "kahve", label: "Kahve" },
    { id: "bilardo", label: "Bilardo" },
    { id: "bowling", label: "Bowling" },
    { id: "fancy-dinner", label: "Akşam yemeği" },
  ],
};
