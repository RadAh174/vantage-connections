import { ImageResponse } from "next/og";
import { siteConfig, OG_GRADIENT } from "./site";

/**
 * Fetch only the glyphs we render from Google Fonts (tiny subset), returned as
 * an ArrayBuffer that satori/ImageResponse can use. Keeps the image bundle well
 * under the 500KB limit and avoids shipping font binaries.
 */
async function loadGoogleFont(
  family: string,
  weight: number,
  text: string,
): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    family,
  )}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const src =
    css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1] ??
    css.match(/src: url\((.+?)\)/)?.[1];
  if (!src) throw new Error(`Could not load font ${family} ${weight}`);
  const res = await fetch(src);
  if (!res.ok) throw new Error(`Could not fetch font binary for ${family}`);
  return res.arrayBuffer();
}

/** 1200×630 social card — dusk gradient, Otto wordmark, headline. */
export async function renderOgImage(): Promise<ImageResponse> {
  const kicker = "YOUR STORE’S DIGITAL OPERATOR";
  const headline = "You make the product. Vantage runs the rest.";
  const domain = siteConfig.url.replace(/^https?:\/\//, "");
  const subset = `${kicker}${headline}Vantage.${domain}·V`;

  const [bold, regular] = await Promise.all([
    loadGoogleFont("Fraunces", 600, subset),
    loadGoogleFont("Fraunces", 400, subset),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "76px 80px",
          backgroundImage: OG_GRADIENT,
          fontFamily: "Fraunces",
          color: siteConfig.colors.cream,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            fontWeight: 400,
            letterSpacing: 8,
            color: siteConfig.colors.peach,
          }}
        >
          {kicker}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              fontSize: 132,
              fontWeight: 600,
              lineHeight: 1,
            }}
          >
            Vantage
            <span style={{ color: siteConfig.colors.peach }}>.</span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 50,
              fontWeight: 400,
              lineHeight: 1.12,
              letterSpacing: -1,
              marginTop: 22,
              maxWidth: 930,
            }}
          >
            {headline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 24,
            fontWeight: 400,
            color: "rgba(244,234,222,0.78)",
          }}
        >
          {domain}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Fraunces", data: bold, weight: 600, style: "normal" },
        { name: "Fraunces", data: regular, weight: 400, style: "normal" },
      ],
    },
  );
}

/** 180×180 app/touch icon — gradient tile with the Vantage "V" + operator dot. */
export async function renderAppleIcon(): Promise<ImageResponse> {
  const font = await loadGoogleFont("Fraunces", 600, "V");
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: OG_GRADIENT,
          fontFamily: "Fraunces",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <span
            style={{
              fontSize: 116,
              fontWeight: 600,
              lineHeight: 1,
              color: siteConfig.colors.cream,
            }}
          >
            V
          </span>
          <span
            style={{
              width: 17,
              height: 17,
              borderRadius: 17,
              marginLeft: 5,
              marginBottom: 20,
              background: siteConfig.colors.peach,
            }}
          />
        </div>
      </div>
    ),
    {
      width: 180,
      height: 180,
      fonts: [{ name: "Fraunces", data: font, weight: 600, style: "normal" }],
    },
  );
}
