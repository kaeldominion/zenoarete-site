import GalleryClient from "./GalleryClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Complete Property Gallery | Zeno Arete",
  description: "Explore 98 current photographs of all six named suites, pools, living spaces, dining areas, gym and recovery facilities at Villa Zeno Arete.",
};

export default function GalleryPage() {
  return <GalleryClient />;
}
