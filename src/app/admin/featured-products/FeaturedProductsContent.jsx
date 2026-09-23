"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { getFeaturedProducts, deleteFeaturedProduct } from "../../../services/featuredProductService";
import { getGalleryImage } from "../../../utils/imageUtils";


export default function ManageFeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const data = await getFeaturedProducts();
      setProducts(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

async function handleDelete(id) {
  const result = await Swal.fire({
    title: "Delete Product?",
    text: "This product will be permanently deleted!",
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
    await deleteFeaturedProduct(id);
    loadProducts();

    Swal.fire({
      title: "Deleted!",
      text: "Product deleted successfully.",
      icon: "success",
      timer: 1800,
      showConfirmButton: false,
    });
  } catch (err) {
    console.error(err);

    Swal.fire({
      title: "Oops!",
      text: "Unable to delete the product. Please try again.",
      icon: "error",
      confirmButtonColor: "#d33",
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
          <h2>Featured Products</h2>

          <Link href="/admin/featured-products/add" className="btn btn-dark">
            Add Product
          </Link>
        </div>

        <div className="table-responsive">
          <table
            className="table table-bordered table-hover align-middle"
            style={{ minWidth: "760px" }}
          >
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Price</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product._id}>
                    <td width="110">
                      <img
                        src={getGalleryImage(product.images[0])}
                        alt={product.title}
                        className="img-fluid rounded"
                      />
                    </td>

                    <td>{product.title}</td>

                    <td>₹ {product.price}</td>

                    <td>{product.category || "—"}</td>

                    <td>
                      {product.inStock ? (
                        <span className="badge bg-success">In Stock</span>
                      ) : (
                        <span className="badge bg-secondary">Out</span>
                      )}
                    </td>

                    <td>
                      {product.active ? (
                        <span className="badge bg-primary">Active</span>
                      ) : (
                        <span className="badge bg-danger">Inactive</span>
                      )}
                    </td>

                    <td>
                      <div className="d-flex gap-2">
                        <Link
                          href={`/admin/featured-products/edit/${product._id}`}
                          className="btn btn-outline-dark btn-sm"
                        >
                          Edit
                        </Link>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(product._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    No featured products yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}