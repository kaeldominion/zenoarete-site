"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
  }
}

export default function PixelTracker() {
  useEffect(() => {
    document.querySelectorAll("a").forEach((link) => {
      const href = link.href || "";
      if (href.includes("thebookingbutton.com")) {
        link.addEventListener("click", () =>
          window.fbq?.("track", "InitiateCheckout", {
            content_name: "Book Direct",
          })
        );
      } else if (href.includes("airbnb.com")) {
        link.addEventListener("click", () =>
          window.fbq?.("track", "Lead", { content_name: "Book on Airbnb" })
        );
      } else if (href.includes("wa.me")) {
        link.addEventListener("click", () =>
          window.fbq?.("trackCustom", "WhatsAppClick")
        );
      }
    });
  }, []);
  return null;
}
