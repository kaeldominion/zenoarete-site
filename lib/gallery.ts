import fs from "fs";
import path from "path";

export interface GalleryItem {
  id: string;
  filename: string;
  thumb: string;
  full: string;
  category: string;
  description: string;
  visible: boolean;
  order: number;
}

const DATA_DIR = path.join(process.cwd(), "data");
const GALLERY_FILE = path.join(DATA_DIR, "gallery.json");
const RUNTIME_FILE = process.env.VERCEL ? path.join("/tmp", "gallery.json") : GALLERY_FILE;

export function ensureGalleryData(): GalleryItem[] {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (process.env.VERCEL && fs.existsSync(RUNTIME_FILE)) {
    return JSON.parse(fs.readFileSync(RUNTIME_FILE, "utf-8"));
  }
  if (fs.existsSync(GALLERY_FILE)) {
    return JSON.parse(fs.readFileSync(GALLERY_FILE, "utf-8"));
  }
  return [];
}

export function saveGalleryData(data: GalleryItem[]): void {
  const targetFile = process.env.VERCEL ? RUNTIME_FILE : GALLERY_FILE;
  const targetDir = path.dirname(targetFile);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  fs.writeFileSync(targetFile, JSON.stringify(data, null, 2));
}
