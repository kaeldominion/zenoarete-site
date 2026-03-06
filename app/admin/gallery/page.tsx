"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "../../globals.css";

interface Photo {
  filename: string;
  title: string;
  description: string;
  category: string;
  visible: boolean;
  order: number;
}

export default function AdminGallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/check")
      .then((r) => r.json())
      .then((data) => {
        if (!data.admin) {
          router.push("/admin/login");
          return;
        }
        return fetch("/api/gallery").then((r) => r.json());
      })
      .then((data) => {
        if (data) {
          setPhotos(data.photos);
          setLoading(false);
        }
      });
  }, [router]);

  const categories = Array.from(new Set(photos.map((p) => p.category))).sort();

  const toggleSelect = (filename: string) => {
    const next = new Set(selected);
    if (next.has(filename)) next.delete(filename);
    else next.add(filename);
    setSelected(next);
  };

  const selectAll = () => {
    if (selected.size === photos.length) setSelected(new Set());
    else setSelected(new Set(photos.map((p) => p.filename)));
  };

  const bulkAction = (action: "hide" | "show" | "delete") => {
    setPhotos((prev) =>
      prev.map((p) => {
        if (!selected.has(p.filename)) return p;
        if (action === "hide") return { ...p, visible: false };
        if (action === "show") return { ...p, visible: true };
        if (action === "delete") return { ...p, visible: false };
        return p;
      })
    );
    setDirty(true);
    setSelected(new Set());
  };

  const updatePhoto = (updated: Photo) => {
    setPhotos((prev) =>
      prev.map((p) => (p.filename === updated.filename ? updated : p))
    );
    setEditingPhoto(null);
    setDirty(true);
  };

  const saveAll = async () => {
    setSaving(true);
    await fetch("/api/gallery", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photos }),
    });
    setSaving(false);
    setDirty(false);
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--muted)" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: "4rem" }}>
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem 2rem",
          background: "#111",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          position: "sticky",
          top: 0,
          zIndex: 100,
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 400, margin: 0 }}>
            Gallery Admin
          </h1>
          <Link href="/gallery" style={{ fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "var(--muted)" }}>
            View Gallery
          </Link>
        </div>
        <div style={{ display: "flex", gap: "0.8rem", alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
            {photos.length} photos · {photos.filter((p) => p.visible).length} visible
          </span>
          {dirty && (
            <button className="btn btn-fill" onClick={saveAll} disabled={saving} style={{ padding: "0.5rem 1.5rem", fontSize: "0.7rem" }}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          )}
          <button className="btn" onClick={logout} style={{ padding: "0.5rem 1rem", fontSize: "0.65rem" }}>
            Logout
          </button>
        </div>
      </div>

      {/* Bulk actions */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          padding: "1rem 2rem",
          alignItems: "center",
          flexWrap: "wrap",
          background: "#0d0d0d",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <button className="btn" onClick={selectAll} style={{ padding: "0.4rem 1rem", fontSize: "0.65rem" }}>
          {selected.size === photos.length ? "Deselect All" : "Select All"}
        </button>
        {selected.size > 0 && (
          <>
            <span style={{ fontSize: "0.8rem", color: "var(--accent)" }}>
              {selected.size} selected
            </span>
            <button className="btn" onClick={() => bulkAction("hide")} style={{ padding: "0.4rem 1rem", fontSize: "0.65rem" }}>
              Hide Selected
            </button>
            <button className="btn" onClick={() => bulkAction("show")} style={{ padding: "0.4rem 1rem", fontSize: "0.65rem" }}>
              Show Selected
            </button>
            <button className="btn" onClick={() => bulkAction("delete")} style={{ padding: "0.4rem 1rem", fontSize: "0.65rem", borderColor: "#e74c3c", color: "#e74c3c" }}>
              Delete Selected
            </button>
          </>
        )}
        <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <input
            placeholder="New category..."
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            style={{
              padding: "0.4rem 0.6rem",
              background: "#0a0a0a",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "var(--text)",
              fontFamily: "var(--font-body)",
              fontSize: "0.8rem",
              borderRadius: "4px",
              width: "150px",
            }}
          />
          {newCategory && selected.size > 0 && (
            <button
              className="btn"
              style={{ padding: "0.4rem 0.8rem", fontSize: "0.65rem" }}
              onClick={() => {
                setPhotos((prev) =>
                  prev.map((p) => (selected.has(p.filename) ? { ...p, category: newCategory } : p))
                );
                setDirty(true);
                setSelected(new Set());
                setNewCategory("");
              }}
            >
              Set Category
            </button>
          )}
        </div>
      </div>

      {/* Photo grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "4px",
          padding: "1rem 2rem",
        }}
      >
        {photos.map((photo) => (
          <div
            key={photo.filename}
            style={{
              position: "relative",
              aspectRatio: "1",
              overflow: "hidden",
              border: selected.has(photo.filename) ? "2px solid var(--accent)" : "2px solid transparent",
              opacity: photo.visible ? 1 : 0.4,
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            <img
              src={`/images/gallery/thumbs/${photo.filename}`}
              alt={photo.title || photo.filename}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              loading="lazy"
              onClick={() => toggleSelect(photo.filename)}
            />
            {/* Filename label */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                background: "rgba(0,0,0,0.7)",
                padding: "0.3rem 0.4rem",
                fontSize: "0.6rem",
                color: "var(--text)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {photo.title || photo.filename.replace(/\.[^.]+$/, "")}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingPhoto({ ...photo });
                }}
                style={{
                  background: "var(--accent)",
                  border: "none",
                  color: "#0a0a0a",
                  padding: "0.15rem 0.4rem",
                  fontSize: "0.6rem",
                  cursor: "pointer",
                  borderRadius: "2px",
                  flexShrink: 0,
                }}
              >
                Edit
              </button>
            </div>
            {!photo.visible && (
              <div
                style={{
                  position: "absolute",
                  top: "4px",
                  left: "4px",
                  background: "rgba(231,76,60,0.9)",
                  padding: "0.1rem 0.4rem",
                  fontSize: "0.6rem",
                  color: "#fff",
                  borderRadius: "2px",
                }}
              >
                Hidden
              </div>
            )}
            {photo.category !== "uncategorized" && (
              <div
                style={{
                  position: "absolute",
                  top: "4px",
                  right: "4px",
                  background: "rgba(201,169,110,0.9)",
                  padding: "0.1rem 0.4rem",
                  fontSize: "0.55rem",
                  color: "#0a0a0a",
                  borderRadius: "2px",
                }}
              >
                {photo.category}
              </div>
            )}
            {/* Checkbox */}
            <input
              type="checkbox"
              checked={selected.has(photo.filename)}
              onChange={() => toggleSelect(photo.filename)}
              style={{
                position: "absolute",
                top: "4px",
                left: "4px",
                zIndex: 5,
                accentColor: "var(--accent)",
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingPhoto && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1100,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setEditingPhoto(null)}
        >
          <div
            style={{
              background: "#151515",
              border: "1px solid rgba(255,255,255,0.1)",
              padding: "2rem",
              borderRadius: "8px",
              width: "90%",
              maxWidth: "500px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontFamily: "var(--font-display)", marginBottom: "1rem", fontWeight: 400 }}>
              Edit: {editingPhoto.filename}
            </h3>
            <img
              src={`/images/gallery/thumbs/${editingPhoto.filename}`}
              alt=""
              style={{ width: "100%", maxHeight: "200px", objectFit: "cover", borderRadius: "4px", marginBottom: "1rem" }}
            />
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "var(--muted)", marginBottom: "0.3rem" }}>Title</label>
              <input
                value={editingPhoto.title}
                onChange={(e) => setEditingPhoto({ ...editingPhoto, title: e.target.value })}
                style={{ width: "100%", padding: "0.6rem", background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text)", fontFamily: "var(--font-body)", borderRadius: "4px" }}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "var(--muted)", marginBottom: "0.3rem" }}>Description</label>
              <textarea
                value={editingPhoto.description}
                onChange={(e) => setEditingPhoto({ ...editingPhoto, description: e.target.value })}
                style={{ width: "100%", padding: "0.6rem", background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text)", fontFamily: "var(--font-body)", borderRadius: "4px", minHeight: "80px" }}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "var(--muted)", marginBottom: "0.3rem" }}>Category</label>
              <input
                value={editingPhoto.category}
                onChange={(e) => setEditingPhoto({ ...editingPhoto, category: e.target.value })}
                list="category-list"
                style={{ width: "100%", padding: "0.6rem", background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text)", fontFamily: "var(--font-body)", borderRadius: "4px" }}
              />
              <datalist id="category-list">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ fontSize: "0.8rem", color: "var(--text)", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={editingPhoto.visible}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, visible: e.target.checked })}
                  style={{ marginRight: "0.5rem", accentColor: "var(--accent)" }}
                />
                Visible
              </label>
            </div>
            <div style={{ display: "flex", gap: "0.8rem" }}>
              <button className="btn" onClick={() => setEditingPhoto(null)} style={{ flex: 1 }}>
                Cancel
              </button>
              <button className="btn btn-fill" onClick={() => updatePhoto(editingPhoto)} style={{ flex: 1 }}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
