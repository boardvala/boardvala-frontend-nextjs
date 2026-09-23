"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";

import {
  getAllPricing,
  updatePricing,
  createPricing,
  createMaterial,
  deleteMaterial,
  addFrameSize,
  deleteFrameSize,
  updateFrameSize,
  updateBannerSettings,
} from "../../../services/pricingService";

export default function AdminPricing() {
  const [pricing, setPricing] = useState([]);
  const [newMaterial, setNewMaterial] = useState("");
  const [newMaterialType, setNewMaterialType] = useState("fixed");
  const [showFrameModal, setShowFrameModal] = useState(false);

  const [isEditFrame, setIsEditFrame] = useState(false);

  const [frameForm, setFrameForm] = useState({
    material: "",
    width: "",
    height: "",
    oldFrameSize: "",
    price: "",
  });

  // banner settings चा local edit state (material नुसार)
  const [bannerForms, setBannerForms] = useState({});

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPricing();
  }, []);

  async function loadPricing() {
    try {
      const data = await getAllPricing();
      setPricing(data);

      // banner materials चे local forms भरा
      const forms = {};
      data.forEach((item) => {
        if (item.pricingType === "banner") {
          forms[item.material] = {
            ratePerSqFt: item.ratePerSqFt || "",
            availableRolls: (item.availableRolls || []).join(", "),
            minOrderValue: item.minOrderValue || "",
            maxLength: item.maxLength || "",
          };
        }
      });
      setBannerForms(forms);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  function handlePriceChange(material, index, value) {
    setPricing((prev) =>
      prev.map((item) => {
        if (item.material !== material) return item;

        const framePrices = [...item.framePrices];
        framePrices[index] = {
          ...framePrices[index],
          price: Number(value),
        };

        return { ...item, framePrices };
      }),
    );
  }

  async function handleSave(material) {
    try {
      const current = pricing.find((item) => item.material === material);

      try {
        await updatePricing(material, current.framePrices);
      } catch (err) {
        if (err.response?.status === 404) {
          await createPricing({
            material,
            framePrices: current.framePrices,
          });
        } else {
          throw err;
        }
      }

      alert(`${material} pricing saved successfully.`);
      loadPricing();
    } catch (err) {
      console.log(err);
      alert("Unable to save pricing.");
    }
  }

  async function handleCreateMaterial() {
    if (!newMaterial.trim()) return;

    try {
      await createMaterial(newMaterial, newMaterialType);
      setNewMaterial("");
      setNewMaterialType("fixed");
      loadPricing();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Unable to create material");
    }
  }

  async function handleDeleteMaterial(material) {
    if (!window.confirm(`Delete "${material}"?`)) return;

    try {
      await deleteMaterial(material);
      loadPricing();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Unable to delete material");
    }
  }

  async function handleAddFrameSize() {
    if (!frameForm.width || !frameForm.height) {
      alert("Please enter width and height.");
      return;
    }

    if (!frameForm.price) return;

    try {
      await addFrameSize(frameForm.material, {
        frameSize: `${frameForm.width} x ${frameForm.height} inch`,
        price: Number(frameForm.price),
      });

      setShowFrameModal(false);
      loadPricing();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Unable to add frame size");
    }
  }

  async function handleDeleteFrameSize(material, frameSize) {
    if (!window.confirm(`Delete ${frameSize}?`)) return;

    try {
      await deleteFrameSize(material, frameSize);
      loadPricing();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Unable to delete frame size");
    }
  }

  async function handleUpdateFrameSize() {
    try {
      await updateFrameSize(frameForm.material, frameForm.oldFrameSize, {
        newFrameSize: `${frameForm.width} x ${frameForm.height} inch`,
        price: Number(frameForm.price),
      });

      setShowFrameModal(false);
      loadPricing();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Unable to update frame size");
    }
  }

  // banner settings — local form बदल
  function handleBannerChange(material, field, value) {
    setBannerForms((prev) => ({
      ...prev,
      [material]: {
        ...prev[material],
        [field]: value,
      },
    }));
  }

  // banner settings save
  async function handleSaveBanner(material) {
    const f = bannerForms[material];
    if (!f) return;

    try {
      await updateBannerSettings(material, {
        ratePerSqFt: f.ratePerSqFt,
        availableRolls: f.availableRolls, // "3, 4, 5, 6" — backend parse करतो
        minOrderValue: f.minOrderValue,
        maxLength: f.maxLength,
      });

      alert(`${material} banner settings saved successfully.`);
      loadPricing();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Unable to save banner settings");
    }
  }

  if (loading) {
    return <div className="container py-5">Loading...</div>;
  }

  return (
    <>
      <div className="container py-5">
        <h2 className="mb-4">Pricing Management</h2>

        {/* Add Material — type निवड सह */}
        <div className="card shadow mb-4">
          <div className="card-body">
            <div className="row g-2">
              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Enter new material name"
                  value={newMaterial}
                  onChange={(e) => setNewMaterial(e.target.value)}
                />
              </div>

              <div className="col-md-3">
                <select
                  className="form-select"
                  value={newMaterialType}
                  onChange={(e) => setNewMaterialType(e.target.value)}
                >
                  <option value="fixed">Fixed sizes</option>
                  <option value="banner">Banner (per sq.ft)</option>
                </select>
              </div>

              <div className="col-md-3">
                <button
                  className="btn btn-success w-100"
                  onClick={handleCreateMaterial}
                >
                  + Add Material
                </button>
              </div>
            </div>
          </div>
        </div>

        {pricing.map((material) => (
          <div className="card shadow mb-4" key={material.material}>
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="mb-0">
                {material.material}
                <span
                  className="badge bg-secondary ms-2"
                  style={{ fontSize: 12 }}
                >
                  {material.pricingType === "banner" ? "Banner" : "Fixed"}
                </span>
              </h4>

              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDeleteMaterial(material.material)}
              >
                Delete
              </button>
            </div>

            <div className="card-body">
              {material.pricingType === "banner" ? (
                /* ---- Banner settings UI ---- */
                <div className="row g-3">
                  <div className="col-md-3">
                    <label className="form-label fw-semibold">
                      Rate (₹ / sq.ft)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={bannerForms[material.material]?.ratePerSqFt || ""}
                      onChange={(e) =>
                        handleBannerChange(
                          material.material,
                          "ratePerSqFt",
                          e.target.value,
                        )
                      }
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label fw-semibold">
                      Available Rolls (ft)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="3, 4, 5, 6"
                      value={
                        bannerForms[material.material]?.availableRolls || ""
                      }
                      onChange={(e) =>
                        handleBannerChange(
                          material.material,
                          "availableRolls",
                          e.target.value,
                        )
                      }
                    />
                    <small className="text-muted">Comma separated</small>
                  </div>

                  <div className="col-md-3">
                    <label className="form-label fw-semibold">
                      Min Order (₹)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={
                        bannerForms[material.material]?.minOrderValue || ""
                      }
                      onChange={(e) =>
                        handleBannerChange(
                          material.material,
                          "minOrderValue",
                          e.target.value,
                        )
                      }
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label fw-semibold">
                      Max Length (ft)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={bannerForms[material.material]?.maxLength || ""}
                      onChange={(e) =>
                        handleBannerChange(
                          material.material,
                          "maxLength",
                          e.target.value,
                        )
                      }
                    />
                  </div>

                  <div className="col-12">
                    <button
                      className="btn btn-dark"
                      onClick={() => handleSaveBanner(material.material)}
                    >
                      Save {material.material}
                    </button>
                  </div>
                </div>
              ) : (
                /* ---- Fixed materials UI (framePrices) ---- */
                <>
                  <div className="mb-3">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => {
                        setIsEditFrame(false);
                        setFrameForm({
                          material: material.material,
                          width: "",
                          height: "",
                          oldFrameSize: "",
                          price: "",
                        });
                        setShowFrameModal(true);
                      }}
                    >
                      + Add Frame Size
                    </button>
                  </div>

                  {material.framePrices.map((frame, index) => (
                    <div
                      className="row mb-3 align-items-center"
                      key={frame.frameSize}
                    >
                      <div className="col-md-4">
                        <label className="fw-semibold">{frame.frameSize}</label>
                      </div>

                      <div className="col-md-3">
                        <input
                          type="number"
                          className="form-control"
                          value={frame.price}
                          onChange={(e) =>
                            handlePriceChange(
                              material.material,
                              index,
                              e.target.value,
                            )
                          }
                        />
                      </div>

                      <div className="col-md-5 d-flex gap-2 mt-2 mt-md-0">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            setIsEditFrame(true);
                            const size =
                              frame.frameSize.match(/(\d+)\s*x\s*(\d+)/i);
                            setFrameForm({
                              material: material.material,
                              oldFrameSize: frame.frameSize,
                              width: size ? size[1] : "",
                              height: size ? size[2] : "",
                              price: frame.price,
                            });
                            setShowFrameModal(true);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            handleDeleteFrameSize(
                              material.material,
                              frame.frameSize,
                            )
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    className="btn btn-dark"
                    onClick={() => handleSave(material.material)}
                  >
                    Save {material.material}
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {showFrameModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isEditFrame ? "Edit Frame Size" : "Add Frame Size"}
                </h5>

                <button
                  className="btn-close"
                  onClick={() => setShowFrameModal(false)}
                />
              </div>

              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-5">
                    <label className="form-label">Width (inch)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={frameForm.width}
                      onChange={(e) =>
                        setFrameForm({ ...frameForm, width: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-2 d-flex align-items-end justify-content-center">
                    <h4 className="mb-2">×</h4>
                  </div>

                  <div className="col-5">
                    <label className="form-label">Height (inch)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={frameForm.height}
                      onChange={(e) =>
                        setFrameForm({ ...frameForm, height: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Price (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter price"
                    value={frameForm.price}
                    onChange={(e) =>
                      setFrameForm({ ...frameForm, price: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowFrameModal(false)}
                >
                  Cancel
                </button>

                <button
                  className={`btn ${
                    isEditFrame ? "btn-primary" : "btn-success"
                  }`}
                  onClick={() => {
                    if (isEditFrame) {
                      handleUpdateFrameSize();
                    } else {
                      handleAddFrameSize();
                    }
                  }}
                >
                  {isEditFrame ? "Update Frame Size" : "Save Frame Size"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}