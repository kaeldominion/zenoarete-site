"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import "./gallery.css";

interface Photo {
  id: string;
  filename: string;
  thumb: string;
  full: string;
  category: string;
  description: string;
  visible: boolean;
  order: number;
}

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "exterior", label: "Exterior" },
  { key: "pool", label: "Pool & Outdoor" },
  { key: "living", label: "Living Spaces" },
  { key: "bedroom", label: "Bedrooms" },
  { key: "bathroom", label: "Bathrooms" },
  { key: "dining", label: "Dining & Kitchen" },
  { key: "wellness", label: "Wellness & Gym" },
  { key: "views", label: "Views & Surroundings" },
];

export default function GalleryClient() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxLoaded, setLightboxLoaded] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((data) => {
        setPhotos(data.photos);
        setIsAdmin(data.admin);
        setLoading(false);
      });
  }, []);

  // IntersectionObserver for fade-in
  useEffect(() => {
    if (loading) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(
              () => entry.target.classList.add("visible"),
              Math.random() * 150
            );
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "100px" }
    );
    gridRef.current?.querySelectorAll(".gallery-item").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [loading, activeFilter, photos]);

  const filtered =
    activeFilter === "all"
      ? photos.filter((p) => p.visible || isAdmin)
      : photos.filter((p) => p.category === activeFilter && (p.visible || isAdmin));

  // Lightbox
  const openLightbox = (i: number) => {
    setLightboxLoaded(false);
    setLightboxIndex(i);
  };
  const closeLightbox = () => setLightboxIndex(null);

  const navigate = useCallback(
    (dir: number) => {
      if (lightboxIndex === null) return;
      const next = (lightboxIndex + dir + filtered.length) % filtered.length;
      setLightboxLoaded(false);
      setLightboxIndex(next);
    },
    [lightboxIndex, filtered.length]
  );

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === "ArrowRight") navigate(1);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [lightboxIndex, navigate]);

  // Admin: save photo edit
  const saveEdit = async (updated: Photo) => {
    const res = await fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ update: updated }),
    });
    if (res.ok) {
      setPhotos((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setEditingPhoto(null);
    }
  };

  // Admin: delete photo
  const deletePhoto = async (photo: Photo) => {
    if (!confirm(`Delete "${photo.filename}" permanently? This removes the image files and cannot be undone.`)) return;
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ delete: { id: photo.id } }),
      });
      if (res.ok) {
        setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
        setEditingPhoto(null);
        if (lightboxIndex !== null) closeLightbox();
      } else {
        const err = await res.json().catch(() => ({}));
        alert(`Delete failed (${res.status}): ${err.error || "Unknown error"}`);
      }
    } catch (e) {
      alert(`Delete failed: ${e instanceof Error ? e.message : "Network error"}`);
    }
  };

  // Admin: reorder
  const reorder = async (id: string, direction: "up" | "down") => {
    const res = await fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reorder: { id, direction } }),
    });
    if (res.ok) {
      // Refetch
      const data = await fetch("/api/gallery").then((r) => r.json());
      setPhotos(data.photos);
    }
  };

  const currentPhoto = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      {/* Nav */}
      <nav className="gallery-nav">
        <a href="/" className="gallery-nav-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/icon.png" alt="Zeno Arete" />
          <span>Zeno Arete</span>
        </a>
        <div className="gallery-nav-links">
          <a href="/">Home</a>
          <a href="/gallery" className="active">Gallery</a>
          <a href="https://app-apac.thebookingbutton.com/properties/villazenoaretedirect" target="_blank" rel="noopener" className="btn btn-fill">Book Now</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="gallery-hero">
        <span className="section-label">Explore Every Corner</span>
        <h1>The Gallery</h1>
        <div className="gallery-divider" />
        <p>
          Over 200 photos capturing the essence of Villa Zeno Arete — from
          sunrise poolside mornings to the intimate details of each suite.
        </p>
      </section>

      {/* Filters */}
      <div className="gallery-filters">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            className={`gallery-filter-btn${activeFilter === cat.key ? " active" : ""}`}
            onClick={() => setActiveFilter(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="gallery-grid" ref={gridRef}>
        {filtered.map((photo, i) => (
          <div
            key={photo.id}
            className={`gallery-item loading${!photo.visible ? " hidden-photo" : ""}`}
            onClick={() => openLightbox(i)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.thumb}
              alt={`Villa Zeno Arete - ${photo.category}`}
              loading="lazy"
              onLoad={(e) => {
                (e.target as HTMLElement).closest(".gallery-item")?.classList.remove("loading");
              }}
              onError={(e) => {
                // Hide broken images via CSS instead of DOM removal (React manages the DOM)
                const item = (e.target as HTMLElement).closest(".gallery-item") as HTMLElement;
                if (item) item.style.display = "none";
              }}
            />
            {photo.description && (
              <div className="gallery-item-desc">{photo.description}</div>
            )}
            {isAdmin && (
              <>
                <div className="gallery-item-admin-btns">
                  <button
                    className="gallery-item-edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingPhoto({ ...photo });
                    }}
                    title="Edit photo"
                  >
                    ✎
                  </button>
                  <button
                    className="gallery-item-edit gallery-item-delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePhoto(photo);
                    }}
                    title="Delete photo"
                  >
                    ✕
                  </button>
                </div>
                <div className="gallery-item-reorder">
                  <button
                    className="gallery-reorder-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      reorder(photo.id, "up");
                    }}
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    className="gallery-reorder-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      reorder(photo.id, "down");
                    }}
                    title="Move down"
                  >
                    ↓
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Admin indicator */}
      {isAdmin && <div className="admin-indicator">Admin Mode</div>}

      {/* Lightbox */}
      <div
        className={`gallery-lightbox${lightboxIndex !== null ? " open" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeLightbox();
        }}
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
          touchStartY.current = e.touches[0].clientY;
        }}
        onTouchEnd={(e) => {
          const dx = e.changedTouches[0].clientX - touchStartX.current;
          const dy = e.changedTouches[0].clientY - touchStartY.current;
          if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
            navigate(dx > 0 ? -1 : 1);
          }
        }}
      >
        <button className="gallery-lightbox-close" onClick={closeLightbox} aria-label="Close">
          ✕
        </button>
        <button
          className="gallery-lightbox-arrow gallery-lightbox-prev"
          onClick={() => navigate(-1)}
          aria-label="Previous"
        >
          ‹
        </button>
        <button
          className="gallery-lightbox-arrow gallery-lightbox-next"
          onClick={() => navigate(1)}
          aria-label="Next"
        >
          ›
        </button>
        <div className="gallery-lightbox-img-wrap">
          {currentPhoto && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={currentPhoto.full}
              alt={`Villa Zeno Arete - ${currentPhoto.category}`}
              className={lightboxLoaded ? "loaded" : ""}
              onLoad={() => setLightboxLoaded(true)}
              onError={(e) => {
                // Fallback to thumb
                (e.target as HTMLImageElement).src = currentPhoto.thumb;
              }}
            />
          )}
        </div>
        <div className="gallery-lightbox-counter">
          {lightboxIndex !== null
            ? `${lightboxIndex + 1} / ${filtered.length}`
            : ""}
        </div>
      </div>

      {/* Edit Modal */}
      {editingPhoto && (
        <EditModal
          photo={editingPhoto}
          onSave={saveEdit}
          onDelete={deletePhoto}
          onCancel={() => setEditingPhoto(null)}
        />
      )}

      {/* Footer */}
      <footer className="gallery-footer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/icon.png"
          alt="Zeno Arete emblem"
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            margin: "0 auto 1.5rem",
            display: "block",
            opacity: 0.8,
          }}
        />
        <div className="gallery-footer-links">
          <a href="/">Home</a>
          <a href="https://instagram.com/villazenoarete" target="_blank" rel="noopener">
            Instagram
          </a>
          <a
            href="https://www.airbnb.com/rooms/1409091642899578717"
            target="_blank"
            rel="noopener"
          >
            Airbnb</a>
          <a href="https://maps.app.goo.gl/9tZLgd64rmGjhHrM8" target="_blank" rel="noopener">
            Location
          </a>
          <a href="mailto:reservations@nusanova.com">Email</a>
        </div>
        <p className="gallery-footer-copy">
          &copy; 2026 Zeno Arete · Managed by Nusa Nova Group
        </p>
      </footer>

      {/* WhatsApp */}
      <a
        href="https://wa.me/628113807533"
        className="gallery-whatsapp"
        target="_blank"
        rel="noopener"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 32 32">
          <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.502 1.14 6.746 3.072 9.382L1.062 31.29l6.166-1.98A15.913 15.913 0 0016.004 32C24.826 32 32 24.824 32 16.004 32 7.176 24.826 0 16.004 0zm9.31 22.612c-.39 1.1-2.294 2.1-3.162 2.178-.79.072-1.764.112-2.848-.18a25.928 25.928 0 01-2.58-.954c-4.542-1.96-7.508-6.554-7.738-6.858-.228-.306-1.87-2.49-1.87-4.748s1.184-3.37 1.604-3.83c.42-.456.918-.572 1.224-.572.306 0 .612.002.878.016.282.014.662-.106 1.036.79.39.932 1.322 3.218 1.438 3.45.114.232.19.504.038.808-.152.306-.228.496-.456.764-.228.266-.48.594-.686.798-.228.228-.466.474-.2.932.266.456 1.184 1.96 2.542 3.176 1.744 1.562 3.212 2.046 3.67 2.276.456.228.724.19.99-.114.266-.306 1.146-1.336 1.452-1.794.306-.456.612-.38 1.032-.228.42.152 2.668 1.258 3.124 1.488.456.228.764.342.878.534.114.19.114 1.1-.276 2.2z" />
        </svg>
      </a>
    </div>
  );
}

/* ── Edit Modal Component ── */
function EditModal({
  photo,
  onSave,
  onDelete,
  onCancel,
}: {
  photo: Photo;
  onSave: (p: Photo) => void;
  onDelete: (p: Photo) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(photo);
  const [saving, setSaving] = useState(false);

  return (
    <div className="gallery-edit-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="gallery-edit-modal">
        <h3>Edit Photo</h3>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.thumb}
          alt=""
          style={{ width: "100%", borderRadius: 6, marginBottom: "1rem", maxHeight: 200, objectFit: "cover" }}
        />
        <label>Category</label>
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          {CATEGORIES.filter((c) => c.key !== "all").map((c) => (
            <option key={c.key} value={c.key}>
              {c.label}
            </option>
          ))}
        </select>

        <label>Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Optional description shown on hover..."
        />

        <div className="gallery-edit-visibility">
          <input
            type="checkbox"
            checked={form.visible}
            onChange={(e) => setForm({ ...form, visible: e.target.checked })}
            id="visibility-check"
          />
          <span>Visible to public</span>
        </div>

        <div className="gallery-edit-actions">
          <button
            className="gallery-edit-delete"
            onClick={() => onDelete(photo)}
            style={{
              background: "transparent",
              border: "1px solid #e74c3c",
              color: "#e74c3c",
              padding: "0.6rem 1rem",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: "0.85rem",
              fontFamily: "var(--font-body)",
            }}
          >
            Delete
          </button>
          <div style={{ display: "flex", gap: "0.5rem", marginLeft: "auto" }}>
            <button className="gallery-edit-cancel" onClick={onCancel}>
              Cancel
            </button>
            <button
              className="gallery-edit-save"
              disabled={saving}
              onClick={async () => {
                setSaving(true);
                await onSave(form);
                setSaving(false);
              }}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
