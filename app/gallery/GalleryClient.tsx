"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import "./gallery.css";

interface Photo {
  filename: string;
  title: string;
  description: string;
  category: string;
  visible: boolean;
  order: number;
}

export default function GalleryClient() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((data) => {
        setPhotos(data.photos);
        setIsAdmin(data.admin);
        const cats = Array.from(new Set(data.photos.map((p: Photo) => p.category))) as string[];
        setCategories(cats.filter((c) => c !== "uncategorized").sort());
        setLoading(false);
      });
  }, []);

  const filtered =
    activeFilter === "all"
      ? photos.filter((p) => p.visible || isAdmin)
      : photos.filter(
          (p) => p.category === activeFilter && (p.visible || isAdmin)
        );

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);

  const navLightbox = useCallback(
    (dir: number) => {
      if (lightboxIndex === null) return;
      const next = lightboxIndex + dir;
      if (next >= 0 && next < filtered.length) setLightboxIndex(next);
    },
    [lightboxIndex, filtered.length]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navLightbox(-1);
      if (e.key === "ArrowRight") navLightbox(1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIndex, navLightbox]);

  const saveEdit = async (photo: Photo) => {
    const updated = photos.map((p) =>
      p.filename === photo.filename ? photo : p
    );
    setPhotos(updated);
    setEditingPhoto(null);
    await fetch("/api/gallery", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photos: updated }),
    });
  };

  if (loading) {
    return (
      <div className="gallery-page">
        <div className="gallery-loading">Loading gallery...</div>
      </div>
    );
  }

  return (
    <div className="gallery-page">
      {/* Nav */}
      <nav className="gallery-nav">
        <Link href="/" className="gallery-nav-logo">
          Zeno Arete
        </Link>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          {isAdmin && (
            <Link href="/admin/gallery" style={{ color: "var(--accent)" }}>
              Admin
            </Link>
          )}
          <Link href="/">Home</Link>
        </div>
      </nav>

      {/* Header */}
      <div className="gallery-header">
        <span className="section-label">The Villa</span>
        <h1>Gallery</h1>
        <p>Explore every corner of Villa Zeno Arete</p>
      </div>

      {/* Filter Tabs */}
      {categories.length > 0 && (
        <div className="filter-tabs">
          <button
            className={`filter-tab ${activeFilter === "all" ? "active" : ""}`}
            onClick={() => setActiveFilter("all")}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-tab ${activeFilter === cat ? "active" : ""}`}
              onClick={() => setActiveFilter(cat)}
            >
              {cat}
            </button>
          ))}
          {photos.some((p) => p.category === "uncategorized") && (
            <button
              className={`filter-tab ${activeFilter === "uncategorized" ? "active" : ""}`}
              onClick={() => setActiveFilter("uncategorized")}
            >
              Uncategorized
            </button>
          )}
        </div>
      )}

      {/* Grid */}
      <div className="gallery-grid">
        {filtered.map((photo, i) => (
          <div
            key={photo.filename}
            className="gallery-item"
            style={{
              animationDelay: `${Math.min(i * 0.05, 1)}s`,
              opacity: !photo.visible ? 0.4 : undefined,
            }}
            onClick={() => openLightbox(i)}
          >
            <img
              src={`/images/gallery/thumbs/${photo.filename}`}
              alt={photo.title || photo.filename}
              loading="lazy"
            />
            <div className="gallery-item-overlay">
              <div>
                {photo.title && <h3>{photo.title}</h3>}
                {photo.description && <p>{photo.description}</p>}
                {!photo.visible && (
                  <p style={{ color: "var(--accent)", fontSize: "0.7rem" }}>
                    Hidden
                  </p>
                )}
              </div>
            </div>
            {isAdmin && (
              <button
                className="gallery-item-edit"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingPhoto({ ...photo });
                }}
                title="Edit photo"
              >
                ✏️
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && filtered[lightboxIndex] && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}>
            ×
          </button>
          {lightboxIndex > 0 && (
            <button
              className="lightbox-nav lightbox-prev"
              onClick={(e) => {
                e.stopPropagation();
                navLightbox(-1);
              }}
            >
              ‹
            </button>
          )}
          {lightboxIndex < filtered.length - 1 && (
            <button
              className="lightbox-nav lightbox-next"
              onClick={(e) => {
                e.stopPropagation();
                navLightbox(1);
              }}
            >
              ›
            </button>
          )}
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={`/images/gallery/full/${filtered[lightboxIndex].filename}`}
              alt={filtered[lightboxIndex].title || filtered[lightboxIndex].filename}
            />
            <div className="lightbox-info">
              {filtered[lightboxIndex].title && (
                <h3>{filtered[lightboxIndex].title}</h3>
              )}
              {filtered[lightboxIndex].description && (
                <p>{filtered[lightboxIndex].description}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingPhoto && (
        <EditModal
          photo={editingPhoto}
          categories={categories}
          onSave={saveEdit}
          onClose={() => setEditingPhoto(null)}
        />
      )}

      {/* Footer */}
      <footer style={{ marginTop: "2rem" }}>
        <div className="links">
          <Link href="/">Home</Link>
          <a href="https://instagram.com/villazenoarete" target="_blank">
            Instagram
          </a>
          <a href="https://wa.me/628113807533" target="_blank">
            WhatsApp
          </a>
        </div>
        <p className="copy">
          &copy; 2026 Zeno Arete · Managed by Nusa Nova Group
        </p>
      </footer>
    </div>
  );
}

function EditModal({
  photo,
  categories,
  onSave,
  onClose,
}: {
  photo: Photo;
  categories: string[];
  onSave: (p: Photo) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState(photo);

  return (
    <div className="edit-modal" onClick={onClose}>
      <div className="edit-modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Edit Photo</h3>
        <div className="edit-field">
          <label>Title</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Photo title"
          />
        </div>
        <div className="edit-field">
          <label>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Photo description"
          />
        </div>
        <div className="edit-field">
          <label>Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="uncategorized">Uncategorized</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="edit-field">
          <label>
            <input
              type="checkbox"
              checked={form.visible}
              onChange={(e) => setForm({ ...form, visible: e.target.checked })}
              style={{ width: "auto", marginRight: "0.5rem" }}
            />
            Visible
          </label>
        </div>
        <div className="edit-actions">
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-fill" onClick={() => onSave(form)}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
