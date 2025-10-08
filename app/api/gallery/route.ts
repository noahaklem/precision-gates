import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// CLOUDINARY_URL is auto-read by the SDK, no extra config needed.

export async function GET() {
  // Everything in folder "pgagates" (adjust if you nest deeper)
  const expression = 'folder:pgagates AND resource_type:image';

  const res = await cloudinary.search
    .expression(expression)
    .sort_by("created_at", "desc")
    .max_results(100)          // raise/lower as needed
    .execute();

  const items = res.resources.map((r: any) => ({
    id: r.asset_id,
    public_id: r.public_id,    // e.g. "pgagates/IMG_1011"
    width: r.width,
    height: r.height,
    // Optimized URL: auto format and quality
    url: `https://res.cloudinary.com/${cloudinary.config().cloud_name}/image/upload/f_auto,q_auto/${r.public_id}`,
  }));

  return NextResponse.json(items, {
    headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
  });
}

