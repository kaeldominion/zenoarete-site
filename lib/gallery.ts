import fs from "fs";
import path from "path";

export interface GalleryItem {
  filename: string;
  title: string;
  description: string;
  category: string;
  visible: boolean;
  order: number;
}

const DATA_DIR = path.join(process.cwd(), "data");
const GALLERY_FILE = path.join(DATA_DIR, "gallery.json");
// On Vercel, /tmp is writable but ephemeral. We use data/gallery.json as source of truth (committed to repo).
// Runtime writes go to /tmp and are lost on cold starts.
const RUNTIME_FILE = process.env.VERCEL ? path.join("/tmp", "gallery.json") : GALLERY_FILE;
const THUMBS_DIR = path.join(process.cwd(), "public", "images", "gallery", "thumbs");

export function ensureGalleryData(): GalleryItem[] {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // Check runtime file first (has admin edits), then committed file
  if (process.env.VERCEL && fs.existsSync(RUNTIME_FILE)) {
    const raw = fs.readFileSync(RUNTIME_FILE, "utf-8");
    return JSON.parse(raw) as GalleryItem[];
  }
  if (fs.existsSync(GALLERY_FILE)) {
    const raw = fs.readFileSync(GALLERY_FILE, "utf-8");
    return JSON.parse(raw) as GalleryItem[];
  }

  // Auto-initialize from thumbs directory
  const files = fs.existsSync(THUMBS_DIR)
    ? fs.readdirSync(THUMBS_DIR).filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f)).sort()
    : [];

  const gallery: GalleryItem[] = files.map((filename, i) => ({
    filename,
    title: "",
    description: "",
    category: "uncategorized",
    visible: true,
    order: i,
  }));

  fs.writeFileSync(GALLERY_FILE, JSON.stringify(gallery, null, 2));
  return gallery;
}

export function saveGalleryData(data: GalleryItem[]): void {
  const targetFile = process.env.VERCEL ? RUNTIME_FILE : GALLERY_FILE;
  const targetDir = path.dirname(targetFile);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  fs.writeFileSync(targetFile, JSON.stringify(data, null, 2));
}

export function getCategories(data: GalleryItem[]): string[] {
  const cats = new Set(data.map((d) => d.category));
  return Array.from(cats).sort();
}
