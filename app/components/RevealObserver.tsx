"use client";
import { useEffect } from "react";

export default function RevealObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    // Show/hide sticky nav after scrolling past hero
    const nav = document.querySelector(".site-nav");
    const hero = document.querySelector(".hero");
    if (nav && hero) {
      const navObserver = new IntersectionObserver(
        ([entry]) => {
          nav.classList.toggle("visible", !entry.isIntersecting);
        },
        { threshold: 0 }
      );
      navObserver.observe(hero);
      return () => { observer.disconnect(); navObserver.disconnect(); };
    }
    return () => observer.disconnect();
  }, []);
  return null;
}
