import { NextRequest, NextResponse } from "next/server";

const PHARMLUSH_BASE = "https://pharmlush.selamet.dev/api/v1";
const PHARMLUSH_TOKEN = process.env.PHARMLUSH_API_TOKEN || "";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    const pathStr = path.join("/");
    const searchParams = request.nextUrl.searchParams.toString();
    const url = `${PHARMLUSH_BASE}/${pathStr}${searchParams ? `?${searchParams}` : ""}`;

    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${PHARMLUSH_TOKEN}`,
        },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
}
