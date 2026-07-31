type ActivityId = "kahve" | "bilardo" | "bowling" | "fancy-dinner";

const common = {
  width: 36,
  height: 36,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function ActivityIcon({ id }: { id: string }) {
  switch (id as ActivityId) {
    case "kahve":
      return (
        <svg {...common}>
          <path d="M5 9h11v5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V9z" />
          <path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16" />
          <path d="M6 19h10" />
          <path d="M8 4s.5 1 .5 2-.5 2-.5 2" />
          <path d="M11 3s.5 1 .5 2-.5 2-.5 2" />
        </svg>
      );
    case "bilardo":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
          <circle cx="8.2" cy="9.2" r="1.1" fill="currentColor" stroke="none" />
          <circle cx="15.8" cy="9.2" r="1.1" fill="currentColor" stroke="none" />
          <circle cx="8.2" cy="14.8" r="1.1" fill="currentColor" stroke="none" />
          <circle cx="15.8" cy="14.8" r="1.1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "bowling":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <circle cx="10" cy="9" r="1.15" fill="currentColor" stroke="none" />
          <circle cx="13.2" cy="8.2" r="1.15" fill="currentColor" stroke="none" />
          <circle cx="12.4" cy="11.2" r="1.15" fill="currentColor" stroke="none" />
        </svg>
      );
    case "fancy-dinner":
      return (
        <svg {...common}>
          <path d="M7 3v8a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V3" />
          <path d="M9 13v8" />
          <path d="M16 3v18" />
          <path d="M16 3c2.2 0 3.5 2 3.5 4.5S18.2 12 16 12" />
        </svg>
      );
    default:
      return null;
  }
}
