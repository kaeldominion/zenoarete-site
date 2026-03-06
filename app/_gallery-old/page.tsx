import GalleryClient from "./GalleryClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery — Zeno Arete",
  description: "Explore Villa Zeno Arete through our photo gallery.",
};

export const dynamic = "force-dynamic";

export default function GalleryPage() {
  return <GalleryClient />;
}
