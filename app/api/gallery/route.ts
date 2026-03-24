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

export async function POST(req: NextRequest) {
  const isAdmin = await verifySession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  
  // Support both full replace and single-photo update
  if (body.photos) {
    saveGalleryData(body.photos as GalleryItem[]);
    return NextResponse.json({ ok: true });
  }
  
  if (body.update) {
    const data = ensureGalleryData();
    const idx = data.findIndex((p) => p.id === body.update.id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    data[idx] = { ...data[idx], ...body.update };
    saveGalleryData(data);
    return NextResponse.json({ ok: true, photo: data[idx] });
  }

  if (body.delete) {
    const data = ensureGalleryData();
    const id = body.delete.id;
    const idx = data.findIndex((p) => p.id === id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const photo = data[idx];
    // Remove from gallery data
    data.splice(idx, 1);
    // Reindex order
    data.forEach((p, i) => (p.order = i));
    saveGalleryData(data);
    return NextResponse.json({ ok: true, deleted: { thumb: photo.thumb, full: photo.full } });
  }

  if (body.reorder) {
    const data = ensureGalleryData();
    const { id, direction } = body.reorder;
    const idx = data.findIndex((p) => p.id === id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= data.length) return NextResponse.json({ ok: true });
    // Swap orders
    const tmpOrder = data[idx].order;
    data[idx].order = data[swapIdx].order;
    data[swapIdx].order = tmpOrder;
    // Swap positions in array
    [data[idx], data[swapIdx]] = [data[swapIdx], data[idx]];
    saveGalleryData(data);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}
