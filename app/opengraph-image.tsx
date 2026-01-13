import { ImageResponse } from "next/og";
import { SITE_NAME, DEFAULT_DESCRIPTION } from "@/lib/seo";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          backgroundColor: "#000",
          backgroundImage:
            "linear-gradient(rgba(0,255,136,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.06) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ width: 12, height: 12, background: "#00ff88" }} />
          <div style={{ fontSize: 22, letterSpacing: 2, color: "#00ff88" }}>GACHI TORE</div>
        </div>
        <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.1 }}>{SITE_NAME}</div>
        <div style={{ marginTop: 18, fontSize: 28, color: "#b3b3b3", lineHeight: 1.35 }}>
          {DEFAULT_DESCRIPTION}
        </div>
        <div style={{ marginTop: 46, display: "flex", gap: 10 }}>
          <div style={{ padding: "10px 14px", border: "1px solid #00ff88", color: "#00ff88", fontSize: 18 }}>
            TRAINING
          </div>
          <div style={{ padding: "10px 14px", border: "1px solid #333", color: "#ccc", fontSize: 18 }}>
            NUTRITION
          </div>
          <div style={{ padding: "10px 14px", border: "1px solid #333", color: "#ccc", fontSize: 18 }}>
            RECOVERY
          </div>
        </div>
      </div>
    ),
    size
  );
}


