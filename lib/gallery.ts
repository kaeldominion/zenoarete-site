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
const THUMBS_DIR = path.join(process.cwd(), "public", "images", "gallery", "thumbs");

export function ensureGalleryData(): GalleryItem[] {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
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
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(GALLERY_FILE, JSON.stringify(data, null, 2));
}

export function getCategories(data: GalleryItem[]): string[] {
  const cats = new Set(data.map((d) => d.category));
  return Array.from(cats).sort();
}
