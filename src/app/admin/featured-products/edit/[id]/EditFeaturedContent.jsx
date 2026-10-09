"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  getFeaturedProduct,
  updateFeaturedProduct,
  deleteFeaturedProductImage,
  addFeaturedProductImages,
} from "../../../../../services/featuredProductService";
import { getGalleryImage } from "../../../../../utils/imageUtils";

export default function EditFeaturedProduct() {
  const router = useRouter();
  const { id } = useParams();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    material: "",
    size: "",
    thickness: "",
    waterproof: false,
    inStock: true,
    active: true,
    isCustomizable: false,
  });
  const [sizes, setSizes] = useState([]);

  const [images, setImages] = useState([]); // सध्याच्या images फक्त दाखवायला
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        const product = await getFeaturedProduct(id);

        setForm({
          title: product.title || "",
          description: product.description || "",
          price: product.price ?? "",
          category: product.category || "",
          material: product.material || "",
          size: product.size || "",
          thickness: product.thickness || "",
          waterproof: !!product.waterproof,
          inStock: !!product.inStock,
          active: !!product.active,
          isCustomizable: !!product.isCustomizable,
        });
        setSizes(product.sizes || []);
        setImages(product.images || []);
      } catch (err) {
        console.log(err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Unable to load product. Please try again.",
        });
        router.push("/admin/featured-products");
      } finally {
        setFetching(false);
      }
    }
    loadProduct();
  }, [id, router]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleAddImages(e) {
    const files = Array.from(e.target.files || []);
    // Reset input so the same file can be selected again later
    e.target.value = "";

    if (files.length === 0) return;

    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    const MAX_NAME_LENGTH = 100;

    const ALLOWED_TYPES = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    // 1. File type check
    const invalidType = files.filter(
      (file) => !ALLOWED_TYPES.includes(file.type),
    );

    if (invalidType.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Invalid file type",
        text: "Only JPG, PNG, WebP and GIF images are allowed.",
      });
      return;
    }

    // 2. File size check
    const oversized = files.filter((file) => file.size > MAX_SIZE);

    if (oversized.length > 0) {
      Swal.fire({
        icon: "error",
        title: "File too large",
        text: `Max file size is 10 MB. ${oversized.length} file(s) exceed the limit.`,
      });
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
      return;
    }

    const remainingSlots = 5 - images.length;

    if (remainingSlots <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Maximum images reached",
        text: "A featured product can have maximum 5 images.",
      });
      return;
    }

    if (files.length > remainingSlots) {
      Swal.fire({
        icon: "warning",
        title: "Maximum 5 images allowed",
        text: `You can add only ${remainingSlots} more image${
          remainingSlots > 1 ? "s" : ""
        }.`,
      });
      return;
    }

    try {
      setImageLoading(true);

      const response = await addFeaturedProductImages(id, files);

      setImages(response.images || []);

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Images added successfully.",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (err) {
      console.log(err);

      Swal.fire({
        icon: "error",
        title: "Upload failed",
        text:
          err.response?.data?.message ||
          "Unable to add images. Please try again.",
      });
    } finally {
      setImageLoading(false);
    }
  }

  async function handleDeleteImage(image) {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete image?",
      text: "This image will be permanently removed.",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc3545",
    });

    if (!result.isConfirmed) return;

    try {
      setImageLoading(true);

      const response = await deleteFeaturedProductImage(id, image._id);

      setImages(response.images || []);

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Image deleted successfully.",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (err) {
      console.log(err);

      Swal.fire({
        icon: "error",
        title: "Delete failed",
        text:
          err.response?.data?.message ||
          "Unable to delete image. Please try again.",
      });
    } finally {
      setImageLoading(false);
    }
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

    try {
      setLoading(true);

      // टप्पा १ — details + price (images नाही), plain JSON
      await updateFeaturedProduct(id, {
        title: form.title,
        description: form.description,
        price: form.price,
        category: form.category,
        material: form.material,
        size: form.size,
        thickness: form.thickness,
        waterproof: form.waterproof,
        inStock: form.inStock,
        active: form.active,
        isCustomizable: form.isCustomizable,
        sizes: sizes,
      });
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Product updated successfully.",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      router.push("/admin/featured-products");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unable to update product.",
      });
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="container py-5">
        <h3>Loading...</h3>
      </div>
    );
  }

  return (
    <>
      <div className="container py-5">
        <div className="card shadow">
          <div className="card-header">
            <h3>Edit Featured Product</h3>
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
                  <label>Category</label>
                  <input
                    className="form-control"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="e.g. Home Decor (optional)"
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

                {/* Customizable (LED Frame) */}
                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="isCustomizable"
                    checked={form.isCustomizable}
                    onChange={(e) =>
                      setForm({ ...form, isCustomizable: e.target.checked })
                    }
                  />
                  <label className="form-check-label" htmlFor="isCustomizable">
                    <strong>Customizable</strong> — Customer must upload photo
                    (LED Frame)
                  </label>
                </div>

                {/* Sizes — only if customizable */}
                {form.isCustomizable && (
                  <div className="card border-0 bg-light p-3 mb-3">
                    <h6 className="fw-bold mb-3">
                      <i className="bi bi-rulers me-2"></i>Frame Sizes & Pricing
                    </h6>

                    {sizes.map((s, i) => (
                      <div
                        key={i}
                        className="d-flex gap-2 mb-2 align-items-center"
                      >
                        <input
                          className="form-control form-control-sm"
                          placeholder="Name (A4)"
                          value={s.name || ""}
                          onChange={(e) => {
                            const updated = [...sizes];
                            updated[i].name = e.target.value;
                            setSizes(updated);
                          }}
                          style={{ maxWidth: "100px" }}
                        />
                        <input
                          className="form-control form-control-sm"
                          placeholder="Dimensions (8×12 inch)"
                          value={s.dimensions || ""}
                          onChange={(e) => {
                            const updated = [...sizes];
                            updated[i].dimensions = e.target.value;
                            setSizes(updated);
                          }}
                          style={{ maxWidth: "160px" }}
                        />
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          placeholder="Price (₹)"
                          value={s.price || ""}
                          onChange={(e) => {
                            const updated = [...sizes];
                            updated[i].price = e.target.value;
                            setSizes(updated);
                          }}
                          style={{ maxWidth: "110px" }}
                        />
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() =>
                            setSizes(sizes.filter((_, idx) => idx !== i))
                          }
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-dark mt-1"
                      onClick={() =>
                        setSizes([
                          ...sizes,
                          { name: "", dimensions: "", price: "" },
                        ])
                      }
                    >
                      <i className="bi bi-plus-lg me-1"></i>Add Size
                    </button>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="fw-semibold mb-0">Product Images</label>

                  <span className="text-muted small">
                    {images.length} / 5 images
                  </span>
                </div>

                <div className="row g-3">
                  {images.map((img, i) => (
                    <div className="col-6 col-md-3" key={img._id || i}>
                      <div className="position-relative">
                        <img
                          src={getGalleryImage(img)}
                          alt={`Product ${i + 1}`}
                          className="img-fluid rounded border"
                          style={{
                            width: "100%",
                            height: 150,
                            objectFit: "cover",
                          }}
                        />

                        <button
                          type="button"
                          className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                          onClick={() => handleDeleteImage(img)}
                          disabled={imageLoading}
                          title="Delete image"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Images */}
                {images.length < 5 && (
                  <div className="mt-3">
                    <label className="btn btn-outline-dark">
                      <i className="bi bi-plus-lg me-1"></i>

                      {imageLoading ? "Processing..." : "Add Images"}

                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        hidden
                        disabled={imageLoading}
                        onChange={handleAddImages}
                      />
                    </label>

                    <small className="text-muted d-block mt-2">
                      You can add {5 - images.length} more image
                      {5 - images.length !== 1 ? "s" : ""}. Maximum 5 images.
                    </small>
                  </div>
                )}

                {images.length === 5 && (
                  <small className="text-success d-block mt-2">
                    <i className="bi bi-check-circle me-1"></i>
                    Maximum 5 images uploaded.
                  </small>
                )}
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

              <div className="d-flex gap-2">
                <button className="btn btn-dark" disabled={loading}>
                  {loading ? "Updating..." : "Update Product"}
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => router.push("/admin/featured-products")}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
