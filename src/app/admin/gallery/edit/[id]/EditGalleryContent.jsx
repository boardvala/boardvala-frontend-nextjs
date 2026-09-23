"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  getGalleryDesign,
  updateGalleryDesign,
  deleteGalleryDesignImage,
  addGalleryDesignImages,
} from "../../../../../services/galleryDesignService";
import { getAllPricing } from "../../../../../services/pricingService";
import { getGalleryImage } from "../../../../../utils/imageUtils";


export default function EditGalleryDesign() {
  const router = useRouter();
  const { id } = useParams();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    featured: false,
    active: true,
  });

  const [images, setImages] = useState([]); // सध्याच्या images फक्त दाखवायला
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [imageLoading, setImageLoading] = useState(false);

  // materials (dynamic) + design (आधीचा data)
  useEffect(() => {
    async function load() {
      try {
        const [design, pricing] = await Promise.all([
          getGalleryDesign(id),
          getAllPricing(),
        ]);

        setForm({
          title: design.title || "",
          description: design.description || "",
          category: design.category || "",
          featured: !!design.featured,
          active: !!design.active,
        });

        setImages(design.images || []);
        setMaterials((pricing || []).map((p) => p.material));
      } catch (err) {
        console.log(err);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Unable to load design.",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
        router.push("/admin/gallery");
      } finally {
        setFetching(false);
      }
    }
    load();
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

    // Allow selecting the same file again
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

    // 1. File type
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

    // 2. File size
    const oversized = files.filter((file) => file.size > MAX_SIZE);

    if (oversized.length > 0) {
      Swal.fire({
        icon: "error",
        title: "File too large",
        text: `Max file size is 10 MB. ${oversized.length} file(s) exceed the limit.`,
      });
      return;
    }

    // 3. File name length
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
        text: "A gallery design can have maximum 5 images.",
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

      const response = await addGalleryDesignImages(id, files);

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

      const response = await deleteGalleryDesignImage(id, image._id);

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

    if (!form.category) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "warning",
        title: "Please select a material.",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      return;
    }

    try {
      setLoading(true);

      // टप्पा १ — फक्त details (images नाही), plain JSON
      await updateGalleryDesign(id, {
        title: form.title,
        description: form.description,
        category: form.category,
        featured: form.featured,
        active: form.active,
      });

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Updated successfully.",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      router.push("/admin/gallery");
    } catch (err) {
      console.log(err);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Unable to update design.",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
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
            <h3>Edit Gallery Design</h3>
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

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="fw-semibold mb-0">Design Images</label>

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
                          alt={`Design ${i + 1}`}
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

                {images.length < 5 && (
                  <div className="mt-3">
                    <label className="btn btn-outline-dark">
                      <i className="bi bi-plus-lg me-1"></i>

                      {imageLoading ? "Processing..." : "Add Images"}

                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
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

              <div className="d-flex gap-2">
                <button className="btn btn-dark" disabled={loading}>
                  {loading ? "Updating..." : "Update Design"}
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => router.push("/admin/gallery")}
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
