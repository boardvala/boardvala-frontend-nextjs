"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { createGalleryDesign } from "../../../../services/galleryDesignService";
import { getAllPricing } from "../../../../services/pricingService";


export default function AddGalleryDesign() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    featured: false,
    active: true,
  });

  const [images, setImages] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pricing मधून materials आणा (dynamic dropdown)
  useEffect(() => {
    async function loadMaterials() {
      try {
        const data = await getAllPricing();
        const list = (data || []).map((p) => p.material);
        setMaterials(list);
      } catch (err) {
        console.log(err);
      }
    }
    loadMaterials();
  }, []);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleImages(e) {
  const files = Array.from(e.target.files);
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  const MAX_NAME_LENGTH = 100; // characters
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

  // 1. File type check — फक्त images
  const invalidType = files.filter((file) => !ALLOWED_TYPES.includes(file.type));
  if (invalidType.length > 0) {
    Swal.fire({
      icon: "error",
      title: "Invalid file type",
      text: "Only JPG, PNG, WebP and GIF images are allowed.",
    });
    e.target.value = "";
    return;
  }

  // 2. File size check — max 10MB
  const oversized = files.filter((file) => file.size > MAX_SIZE);
  if (oversized.length > 0) {
    Swal.fire({
      icon: "error",
      title: "File too large",
      text: `Max file size is 10 MB. ${oversized.length} file(s) exceed the limit.`,
    });
    e.target.value = "";
    return;
  }

  // 3. File name length check
  const longName = files.filter((file) => file.name.length > MAX_NAME_LENGTH);
  if (longName.length > 0) {
    Swal.fire({
      icon: "error",
      title: "File name too long",
      text: `File name should be under ${MAX_NAME_LENGTH} characters.`,
    });
    e.target.value = "";
    return;
  }

  setImages(files);
}

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.category) {
      Swal.fire({
        icon: "warning",
        title: "Material required",
        text: "Please select a material.",
      });
      return;
    }

    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("category", form.category);
    data.append("featured", form.featured);
    data.append("active", form.active);

    images.forEach((image) => {
      data.append("images", image);
    });

    try {
      setLoading(true);
      await createGalleryDesign(data);

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "added successfully.",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      router.push("/admin/gallery");
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unable to save design. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="container py-5">
        <div className="card shadow">
          <div className="card-header">
            <h3>Add Gallery Design</h3>
          </div>

          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label>Title</label>
                <input
                  className="form-control"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label>Description</label>
                <textarea
                  className="form-control"
                  rows="4"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label>Material</label>
                <select
                  className="form-select"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Material --</option>
                  {materials.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label>Design Images</label>
                <input
                  type="file"
                  className="form-control"
                  multiple
                  accept="image/*"
                  onChange={handleImages}
                  required
                />
                <small className="text-muted">Upload up to 5 images.</small>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={handleChange}
                />
                <label className="form-check-label">Featured Design</label>
              </div>

              <div className="form-check mb-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="active"
                  checked={form.active}
                  onChange={handleChange}
                />
                <label className="form-check-label">Active</label>
              </div>

              <button className="btn btn-dark" disabled={loading}>
                {loading ? "Saving..." : "Save Design"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
