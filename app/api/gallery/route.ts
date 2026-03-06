import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { ensureGalleryData, saveGalleryData, GalleryItem } from "@/lib/gallery";

export async function GET() {
  const data = ensureGalleryData();
  const isAdmin = await verifySession();
  if (isAdmin) {
    return NextResponse.json({ photos: data, admin: true });
  }
  const visible = data.filter((p) => p.visible).sort((a, b) => a.order - b.order);
  return NextResponse.json({ photos: visible, admin: false });
}

export async function PUT(req: NextRequest) {
  const isAdmin = await verifySession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { photos } = (await req.json()) as { photos: GalleryItem[] };
  saveGalleryData(photos);
  return NextResponse.json({ ok: true });
}
