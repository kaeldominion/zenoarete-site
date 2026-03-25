import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { ensureGalleryData, saveGalleryData, GalleryItem } from "@/lib/gallery";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET() {
  const data = await ensureGalleryData();
  const isAdmin = await verifySession();
  const headers = { "Cache-Control": "no-store, no-cache, must-revalidate" };
  if (isAdmin) {
    return NextResponse.json({ photos: data, admin: true }, { headers });
  }
  const visible = data.filter((p) => p.visible).sort((a, b) => a.order - b.order);
  return NextResponse.json({ photos: visible, admin: false }, { headers });
}

export async function POST(req: NextRequest) {
  try {
    const isAdmin = await verifySession();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();

    // Full replace (batch save)
    if (body.photos) {
      await saveGalleryData(body.photos as GalleryItem[]);
      return NextResponse.json({ ok: true });
    }

    // Single photo update
    if (body.update) {
      const data = await ensureGalleryData();
      const idx = data.findIndex((p) => p.id === body.update.id);
      if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
      data[idx] = { ...data[idx], ...body.update };
      await saveGalleryData(data);
      return NextResponse.json({ ok: true, photo: data[idx] });
    }

    // Delete photo
    if (body.delete) {
      const data = await ensureGalleryData();
      const id = body.delete.id;
      const idx = data.findIndex((p) => p.id === id);
      if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
      data.splice(idx, 1);
      data.forEach((p, i) => (p.order = i));
      await saveGalleryData(data);
      return NextResponse.json({ ok: true });
    }

    // Reorder
    if (body.reorder) {
      const data = await ensureGalleryData();
      const { id, direction } = body.reorder;
      const idx = data.findIndex((p) => p.id === id);
      if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= data.length) return NextResponse.json({ ok: true });
      const tmpOrder = data[idx].order;
      data[idx].order = data[swapIdx].order;
      data[swapIdx].order = tmpOrder;
      [data[idx], data[swapIdx]] = [data[swapIdx], data[idx]];
      await saveGalleryData(data);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (e) {
    console.error("Gallery API error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Internal server error" },
      { status: 500 }
    );
  }
}
