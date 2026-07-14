import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url")

  if (!url) {
    return new NextResponse("Missing url parameter", { status: 400 })
  }

  // Only allow http/https URLs to prevent SSRF against internal services
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return new NextResponse("Invalid URL", { status: 400 })
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return new NextResponse("URL must be http or https", { status: 400 })
  }

  try {
    const upstream = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    })

    if (!upstream.ok) {
      return new NextResponse(`Upstream error: ${upstream.status}`, {
        status: upstream.status,
      })
    }

    const contentType = upstream.headers.get("content-type") ?? "audio/mpeg"
    const body = await upstream.arrayBuffer()

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (err) {
    console.error("[v0] audio-proxy fetch error:", err)
    return new NextResponse("Failed to fetch audio", { status: 502 })
  }
}
