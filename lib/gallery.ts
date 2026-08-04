import fs from "fs";
import path from "path";
import { put, list } from "@vercel/blob";
import { propertyPhotos } from "@/lib/property";

export interface GalleryItem {
  id: string;
  filename: string;
  thumb: string;
  full: string;
  title?: string;
  category: string;
  description: string;
  visible: boolean;
  order: number;
}

const DATA_DIR = path.join(process.cwd(), "data");
const GALLERY_FILE = path.join(DATA_DIR, "gallery-v2.json");
const BLOB_NAME = "gallery-v2.json";
const IS_VERCEL = !!process.env.VERCEL;

// Read gallery data from local file (used as fallback / seed)
function readLocalData(): GalleryItem[] {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (fs.existsSync(GALLERY_FILE)) {
    return JSON.parse(fs.readFileSync(GALLERY_FILE, "utf-8"));
  }
  return propertyPhotos.map((photo) => ({
    id: photo.id,
    filename: photo.filename,
    thumb: photo.thumb,
    full: photo.full,
    title: photo.categoryLabel,
    category: photo.category,
    description: photo.description,
    visible: photo.visible,
    order: photo.order,
  }));
}

// On Vercel: read from Blob, falling back to local file (initial seed)
// Locally: read from data/gallery.json
export async function ensureGalleryData(): Promise<GalleryItem[]> {
  if (!IS_VERCEL) {
    return readLocalData();
  }

  try {
    const { blobs } = await list({ prefix: BLOB_NAME });
    const blob = blobs.find((b) => b.pathname === BLOB_NAME);
    if (blob) {
      const res = await fetch(`${blob.url}?t=${Date.now()}`, { cache: "no-store" });
      return await res.json();
    }
  } catch (e) {
    console.error("Blob read failed, falling back to local:", e);
  }

  // First time: seed blob from local data
  const local = readLocalData();
  if (local.length > 0) {
    await saveGalleryData(local);
  }
  return local;
}

// On Vercel: write to Blob storage
// Locally: write to data/gallery.json
export async function saveGalleryData(data: GalleryItem[]): Promise<void> {
  if (!IS_VERCEL) {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(GALLERY_FILE, JSON.stringify(data, null, 2));
    return;
  }

  await put(BLOB_NAME, JSON.stringify(data), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}
