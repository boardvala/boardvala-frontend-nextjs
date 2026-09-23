"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getGalleryDesigns, deleteGalleryDesign } from "../../../services/galleryDesignService";
import { getGalleryImage } from "../../../utils/imageUtils";
import Swal from "sweetalert2";

export default function ManageGalleryDesigns() {
  const [designs, setDesigns] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDesigns();
  }, []);

  async function loadDesigns() {
    try {
      const data = await getGalleryDesigns();

      setDesigns(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    const result = await Swal.fire({
      title: "Delete Design?",
      text: "This design will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e53935",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await deleteGalleryDesign(id);

      loadDesigns();

      Swal.fire({
        title: "Deleted!",
        text: "Design deleted successfully.",
        icon: "success",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);

      Swal.fire({
        title: "Oops!",
        text: "Unable to delete the design. Please try again.",
        icon: "error",
        confirmButtonColor: "#e53935",
      });
    }
  }

  if (loading) {
    return (
        <div className="container py-5">
          <h3>Loading...</h3>
        </div>
    );
  }

  return (
    <>
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Gallery Designs</h2>

          <Link href="/admin/gallery/add" className="btn btn-dark">
            Add Design
          </Link>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Featured</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {designs.map((design) => (
                <tr key={design._id}>
                  <td width="120">
                    <img
                      src={getGalleryImage(design.images[0])}
                      alt={design.title}
                      className="img-fluid rounded"
                    />
                  </td>

                  <td>{design.title}</td>

                  <td>{design.category}</td>

                  <td>
                    {design.featured ? (
                      <span className="badge bg-success">Yes</span>
                    ) : (
                      <span className="badge bg-secondary">No</span>
                    )}
                  </td>

                  <td>
                    {design.active ? (
                      <span className="badge bg-primary">Active</span>
                    ) : (
                      <span className="badge bg-danger">Inactive</span>
                    )}
                  </td>

                  <td>
                    <div className="d-flex gap-2">
                      <Link
                        href={`/admin/gallery/edit/${design._id}`}
                        className="btn btn-outline-dark btn-sm"
                      >
                        Edit
                      </Link>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(design._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
