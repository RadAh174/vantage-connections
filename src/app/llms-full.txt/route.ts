import { buildLlmsFullTxt } from "@/lib/llms";

// Static: the corpus only changes when content.ts changes (i.e. at build time).
export const dynamic = "force-static";

export function GET() {
  return new Response(buildLlmsFullTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
