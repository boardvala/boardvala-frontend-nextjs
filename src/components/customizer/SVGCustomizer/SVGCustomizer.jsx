import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import SVGCanvas from "./SVGCanvas";
import { updateSVG } from "../../../utils/svgUtils";
import { addToCart } from "../../../services/cartService";
import { useNavigate } from "react-router-dom";

export default function SVGCustomizer({ product, svgUrl }) {
  const [template, setTemplate] = useState("");

  const [svg, setSvg] = useState("");

  const [values, setValues] = useState({});

  const navigate = useNavigate();

  // Build values object from editableFields
  useEffect(() => {
    if (!product) return;

    const initialValues = {};

    product.editableFields.forEach((field) => {
      initialValues[field.key] = {
        text: field.defaultValue,

        style: {
          fontFamily: field.defaultStyle.fontFamily,

          fontSize: field.defaultStyle.fontSize,

          fontColor: field.defaultStyle.fontColor,

          fontWeight: field.defaultStyle.fontWeight,
        },
      };
    });

    setValues(initialValues);
  }, [product]);

  // Load SVG
  useEffect(() => {
    if (svgUrl) {
      loadSVG();
    }
  }, [svgUrl]);

  // Update SVG whenever values change
  useEffect(() => {
    if (!template) return;

    const updated = updateSVG(
      template,

      values,
    );

    setSvg(updated);
  }, [values, template]);

  async function loadSVG() {
    try {
      const response = await fetch(svgUrl);

      const text = await response.text();

      setTemplate(text);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleAddToCart() {
    try {
      const customization = {};

      product.editableFields.forEach((field) => {
        customization[field.key] = values[field.key];
      });

      await addToCart({
        productId: product._id,

        product: {
          _id: product._id,

          name: product.name,

          price: product.price,

          previewImage: product.previewImage,
        },

        quantity: 1,

        customization,

        finalSvg: svg,
      });

      alert("Added to Cart Successfully");
      navigate("/cart");
    } catch (err) {
      console.log(err);

      alert("Unable to add to cart");
    }
  }

  return (
    <div
      className="row"
      style={{
        minHeight: "calc(100vh - 120px)",
      }}
    >
      {/* SVG Preview */}
      <div className="col-12 col-lg-8 order-1" >
        <SVGCanvas svg={svg} />
      </div>

      {/* Customization Panel */}
      <div
        className="col-12 col-lg-4 order-2 d-flex flex-column"
        style={{
          height: "calc(100vh - 100px)",
        }}
      >
        <div
          style={{
            flex: 1,
            overflowY: "auto",
          }}
        >
          <Sidebar product={product} values={values} setValues={setValues} />
        </div>

        <div className="pt-3 border-top bg-white">
          <button
            className="btn btn-success btn-lg w-100"
            onClick={handleAddToCart}
          >
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
}
