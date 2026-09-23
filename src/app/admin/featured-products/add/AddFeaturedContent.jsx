"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { createFeaturedProduct } from "../../../../services/featuredProductService";


export default function AddFeaturedProduct() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    material: "",
    size: "",
    thickness: "",
    waterproof: false,
    category: "",
    inStock: true,
    active: true,
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

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
    const ALLOWED_TYPES = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    // 1. File type check — फक्त images
    const invalidType = files.filter(
      (file) => !ALLOWED_TYPES.includes(file.type),
    );
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

    if (Number(form.price) <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Price required",
        text: "Please enter a valid price",
      });
      return;
    }

    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("price", form.price);
    data.append("material", form.material);
    data.append("size", form.size);
    data.append("thickness", form.thickness);
    data.append("waterproof", form.waterproof);
    data.append("category", form.category);
    data.append("inStock", form.inStock);
    data.append("active", form.active);

    images.forEach((image) => {
      data.append("images", image);
    });

    try {
      setLoading(true);
      await createFeaturedProduct(data);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "added successfully.",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      router.push("/admin/featured-products");
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add. Please try again.",
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
            <h3>Add Featured Product</h3>
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

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Material</label>
                  <input
                    className="form-control"
                    name="material"
                    value={form.material}
                    onChange={handleChange}
                    placeholder="e.g. Acrylic, MDF, Sunboard"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Size</label>
                  <input
                    className="form-control"
                    name="size"
                    value={form.size}
                    onChange={handleChange}
                    placeholder="e.g. 12 × 12 inch"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Thickness</label>
                  <input
                    className="form-control"
                    name="thickness"
                    value={form.thickness}
                    onChange={handleChange}
                    placeholder="e.g. 3 mm"
                  />
                </div>

                <div className="col-md-6 mb-3 d-flex align-items-end">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="waterproof"
                      checked={form.waterproof}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">Waterproof</label>
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <label>Category</label>
                  <input
                    className="form-control"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="e.g. Home Decor (optional)"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label>Product Images</label>
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
                  name="inStock"
                  checked={form.inStock}
                  onChange={handleChange}
                />
                <label className="form-check-label">In Stock</label>
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
                {loading ? "Saving..." : "Save Product"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}


