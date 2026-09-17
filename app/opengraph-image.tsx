import { ImageResponse } from "next/og";

export const alt = "lol. — a digital stamp card for restaurants and cafes";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#1B1526";
const INK_MUTED = "#6B6180";
const CORAL = "#FF6A55";
const GRAPE = "#7A2FF2";
const SUN = "#FFC93C";
const PAPER = "#FDF3E3";
const WHITE = "#FFFFFF";

// Google's CSS2 endpoint serves .woff2 to modern user agents and plain .ttf
// (which Satori can actually parse) to old ones that predate woff2 support.
async function loadDarkerGrotesque(weight: number): Promise<ArrayBuffer> {
  const css = await fetch(`https://fonts.googleapis.com/css2?family=Darker+Grotesque:wght@${weight}`, {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/534.34 (KHTML, like Gecko)" },
  }).then((res) => res.text());
  const url = css.match(/src: url\(([^)]+)\)/)?.[1];
  if (!url) throw new Error("Could not resolve Darker Grotesque font URL");
  return fetch(url).then((res) => res.arrayBuffer());
}

// Six "stamps" echoing the StampGrid on the actual loyalty card — three
// filled (one of them the milestone/reward stamp), three still empty.
const STAMPS = [
  { filled: true, color: GRAPE },
  { filled: true, color: GRAPE },
  { filled: true, color: SUN },
  { filled: false },
  { filled: false },
  { filled: false },
];

export default async function Image() {
  const [black, bold] = await Promise.all([loadDarkerGrotesque(900), loadDarkerGrotesque(700)]);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: PAPER, position: "relative" }}>
        <div style={{ position: "absolute", top: -90, right: -90, width: 300, height: 300, borderRadius: "50%", background: CORAL, opacity: 0.16, display: "flex" }} />
        <div style={{ position: "absolute", bottom: -110, left: -70, width: 320, height: 320, borderRadius: "50%", background: GRAPE, opacity: 0.14, display: "flex" }} />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "flex-end", fontFamily: "Darker Grotesque", fontWeight: 900, fontSize: 176, color: INK, letterSpacing: -6, lineHeight: 0.8 }}>
            <span style={{ display: "flex" }}>lol</span>
            <span style={{ display: "flex", color: CORAL, marginLeft: 6 }}>.</span>
          </div>

          <div style={{ display: "flex", marginTop: 20, fontFamily: "Darker Grotesque", fontWeight: 700, fontSize: 32, color: INK_MUTED }}>
            A digital stamp card for restaurants and cafes
          </div>

          <div style={{ display: "flex", gap: 16, marginTop: 44 }}>
            {STAMPS.map((s, i) => (
              <div
                key={i}
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: s.filled ? s.color : WHITE,
                  border: `4px solid ${INK}`,
                }}
              >
                {s.filled ? <div style={{ width: 10, height: 10, borderRadius: "50%", background: WHITE, display: "flex" }} /> : null}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", marginTop: 44, padding: "14px 30px", background: INK, borderRadius: 999 }}>
            <span style={{ fontFamily: "Darker Grotesque", fontWeight: 700, fontSize: 24, color: WHITE, letterSpacing: 3 }}>TAP · STAMP · REWARD</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Darker Grotesque", data: black, weight: 900, style: "normal" },
        { name: "Darker Grotesque", data: bold, weight: 700, style: "normal" },
      ],
    }
  );
}
