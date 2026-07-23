import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "TeacherPlan AI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #020617 0%, #0f172a 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #22d3ee, #14b8a6)",
              fontSize: 40,
            }}
          >
            ✨
          </div>
          <div style={{ fontSize: 56, fontWeight: 700 }}>TeacherPlan AI</div>
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: 900,
          }}
        >
          Календарно-тематичні плани за 10 секунд
        </div>
      </div>
    ),
    { ...size }
  );
}
