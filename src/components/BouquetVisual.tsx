import type { FlowerId } from "@/lib/flowers";
import { flowerById } from "@/lib/flowers";

type Props = {
  id: FlowerId;
  blooming?: boolean;
};

export function BouquetVisual({ id, blooming = false }: Props) {
  const flower = flowerById[id];
  const main = flower.color;
  const soft = flower.petal;

  return (
    <div
      className={`bouquet-svg ${blooming ? "is-blooming" : ""}`}
      aria-hidden
    >
      <svg
        className="bouquet-canvas"
        viewBox="0 0 200 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* stems */}
        <g className="bq-stems">
          <path
            d="M100 210 C98 170 92 130 88 95"
            stroke="#3f7a4c"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M100 210 C104 168 112 128 120 96"
            stroke="#3f7a4c"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M100 210 C96 165 84 125 72 98"
            stroke="#4f9a5c"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <path
            d="M100 210 C106 166 122 124 136 100"
            stroke="#4f9a5c"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <path
            d="M100 210 C100 160 100 120 100 88"
            stroke="#357044"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </g>

        {/* leaves */}
        <g className="bq-leaves">
          <ellipse
            cx="78"
            cy="150"
            rx="16"
            ry="8"
            fill="#4f9a5c"
            transform="rotate(-35 78 150)"
          />
          <ellipse
            cx="124"
            cy="148"
            rx="16"
            ry="8"
            fill="#4f9a5c"
            transform="rotate(35 124 148)"
          />
          <ellipse
            cx="70"
            cy="125"
            rx="12"
            ry="6"
            fill="#5aad68"
            transform="rotate(-48 70 125)"
          />
          <ellipse
            cx="132"
            cy="122"
            rx="12"
            ry="6"
            fill="#5aad68"
            transform="rotate(48 132 122)"
          />
        </g>

        {/* ribbon */}
        <g className="bq-ribbon">
          <rect
            x="88"
            y="168"
            width="24"
            height="12"
            rx="3"
            fill="#c45b8c"
          />
          <path
            d="M88 174 L78 188 L86 176 Z"
            fill="#e891b5"
          />
          <path
            d="M112 174 L122 188 L114 176 Z"
            fill="#e891b5"
          />
        </g>

        {/* flower heads — bloom as a group */}
        <g className="bq-blooms">
          <FlowerHead
            kind={id}
            cx={72}
            cy={92}
            main={main}
            soft={soft}
            scale={0.9}
          />
          <FlowerHead
            kind={id}
            cx={128}
            cy={90}
            main={main}
            soft={soft}
            scale={0.92}
          />
          <FlowerHead
            kind={id}
            cx={100}
            cy={70}
            main={main}
            soft={soft}
            scale={1.05}
          />
          <FlowerHead
            kind={id}
            cx={86}
            cy={108}
            main={main}
            soft={soft}
            scale={0.82}
          />
          <FlowerHead
            kind={id}
            cx={116}
            cy={106}
            main={main}
            soft={soft}
            scale={0.84}
          />
        </g>
      </svg>
    </div>
  );
}

function FlowerHead({
  kind,
  cx,
  cy,
  main,
  soft,
  scale,
}: {
  kind: FlowerId;
  cx: number;
  cy: number;
  main: string;
  soft: string;
  scale: number;
}) {
  if (kind === "gul") {
    return (
      <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
        {/* outer unfurled petals */}
        <path
          d="M0 6 C-18 4 -24 -8 -18 -20 C-12 -28 -4 -24 0 -16 C4 -24 12 -28 18 -20 C24 -8 18 4 0 6Z"
          fill={soft}
        />
        <path
          d="M-20 -2 C-26 -14 -20 -28 -8 -30 C-2 -26 -2 -14 -6 -6 C-12 2 -18 4 -20 -2Z"
          fill={main}
          opacity="0.95"
        />
        <path
          d="M20 -2 C26 -14 20 -28 8 -30 C2 -26 2 -14 6 -6 C12 2 18 4 20 -2Z"
          fill={main}
          opacity="0.95"
        />
        {/* mid petals */}
        <path
          d="M0 2 C-12 0 -16 -10 -12 -20 C-6 -26 0 -20 0 -12 C0 -20 6 -26 12 -20 C16 -10 12 0 0 2Z"
          fill={soft}
        />
        {/* inner swirl / rose heart */}
        <path
          d="M0 0 C-7 -2 -9 -10 -5 -16 C-1 -18 2 -14 1 -8 C3 -14 8 -16 10 -10 C11 -4 6 1 0 0Z"
          fill={main}
        />
        <path
          d="M-1 -2 C-4 -4 -5 -9 -2 -12 C1 -13 2 -9 1 -5"
          stroke={soft}
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />
      </g>
    );
  }

  if (kind === "papatya") {
    return (
      <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
        {Array.from({ length: 12 }, (_, i) => (
          <ellipse
            key={i}
            cx="0"
            cy="-16"
            rx="5"
            ry="13"
            fill={soft}
            stroke="rgba(0,0,0,0.04)"
            transform={`rotate(${i * 30})`}
          />
        ))}
        <circle cx="0" cy="0" r="9" fill={main} />
      </g>
    );
  }

  if (kind === "lale") {
    return (
      <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
        {/* left petal */}
        <path
          d="M0 14 C-4 10 -16 6 -18 -4 C-19 -16 -10 -30 -2 -34 C-6 -20 -8 -6 0 14Z"
          fill={soft}
        />
        {/* right petal */}
        <path
          d="M0 14 C4 10 16 6 18 -4 C19 -16 10 -30 2 -34 C6 -20 8 -6 0 14Z"
          fill={soft}
        />
        {/* center cup petal */}
        <path
          d="M0 16 C-9 8 -11 -6 -8 -22 C-4 -32 0 -36 0 -36 C0 -36 4 -32 8 -22 C11 -6 9 8 0 16Z"
          fill={main}
        />
        {/* soft highlight */}
        <path
          d="M-2 -8 C-3 -16 0 -26 2 -28"
          stroke={soft}
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
          opacity="0.55"
        />
      </g>
    );
  }

  // orkide
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <ellipse
        cx="-14"
        cy="-2"
        rx="12"
        ry="16"
        fill={soft}
        transform="rotate(-18)"
      />
      <ellipse
        cx="14"
        cy="-2"
        rx="12"
        ry="16"
        fill={soft}
        transform="rotate(18)"
      />
      <ellipse cx="0" cy="8" rx="8" ry="12" fill={main} />
      <circle cx="0" cy="0" r="4.5" fill="#f2c14e" />
    </g>
  );
}
