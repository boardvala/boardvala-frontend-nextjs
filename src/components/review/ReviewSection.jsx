import { useEffect, useState } from "react";

import {
  createReview,
  getGalleryReviews,
  getProductReviews,
  getFeaturedProductReviews,
} from "../../services/reviewService";

export default function ReviewSection({
  productId,
  galleryDesignId,
  featuredProductId,
}) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    loadReviews();
  }, [productId, galleryDesignId, featuredProductId]);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      setMessage("");
    }, 3000);
    return () => clearTimeout(timer);
  }, [message]);

  async function loadReviews() {
    try {
      setLoading(true);
      let data = [];

      if (productId) {
        data = await getProductReviews(productId);
      } else if (featuredProductId) {
        data = await getFeaturedProductReviews(featuredProductId);
      } else {
        data = await getGalleryReviews(galleryDesignId);
      }

      setReviews(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setSubmitting(true);

      await createReview({
        ...form,
        product: productId || null,
        galleryDesign: galleryDesignId || null,
        featuredProduct: featuredProductId || null,
      });

      setForm({
        name: "",
        email: "",
        rating: 5,
        comment: "",
      });

      loadReviews();

      setMessage("Thank you! Your review has been submitted successfully.");
      setMessageType("success");
    } catch (err) {
      console.log(err);
      setMessage("Unable to submit your review. Please try again.");
      setMessageType("danger");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="container py-5">
      <hr className="mb-5" />

      <h3 className="fw-bold mb-4">Customer Reviews</h3>

      {message && <div className={`alert alert-${messageType}`}>{message}</div>}

      <div className="card shadow-sm mb-5">
        <div className="card-body">
          <h5 className="mb-4">Write a Review</h5>

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Name</label>
                <input
                  className="form-control"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Rating</label>
              <div>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() =>
                      setForm({
                        ...form,
                        rating: star,
                      })
                    }
                    style={{
                      cursor: "pointer",
                      fontSize: "2rem",
                      color: star <= form.rating ? "#ffc107" : "#dee2e6",
                      transition: "0.2s",
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label>Comment</label>
              <textarea
                rows="4"
                className="form-control"
                name="comment"
                value={form.comment}
                onChange={handleChange}
                required
              />
            </div>

            <button className="btn btn-dark" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border"></div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="alert alert-light border">No reviews yet.</div>
      ) : (
        reviews.map((review) => (
          <div key={review._id} className="card shadow-sm mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <h5>{review.name}</h5>
                <small className="text-muted">
                  {new Date(review.createdAt).toLocaleDateString()}
                </small>
              </div>

              <div className="text-warning fs-5 mb-2">
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </div>

              <p className="mb-0">{review.comment}</p>
            </div>
          </div>
        ))
      )}
    </section>
  );
}