import {
  PRODUCT_IMAGE_URL,
  SVG_TEMPLATE_URL,
  REQUEST_DESIGN_URL,
  GALLERY_IMAGE_URL,
} from "../config/config";

// Product Preview
export function getProductImage(image) {
  if (!image) return "";

  // New Cloudinary format
  if (typeof image === "object" && image.url) {
    return image.url;
  }

  // Old local format
  return `${PRODUCT_IMAGE_URL}/${image}`;
}

// SVG Template
export function getSVGTemplate(svg) {
  if (!svg) return "";

  // New Cloudinary format
  if (typeof svg === "object" && svg.url) {
    return svg.url;
  }

  // Old local format
  return `${SVG_TEMPLATE_URL}/${svg}`;
}

// Custom Design Upload
export function getRequestImage(image) {
  if (!image) return "";

  if (typeof image === "object" && image.url) {
    return image.url;
  }

  return `${REQUEST_DESIGN_URL}/${image}`;
}

// Gallery Image
export function getGalleryImage(image) {
  if (!image) return "";

  if (typeof image === "object" && image.url) {
    return image.url;
  }

  return `${GALLERY_IMAGE_URL}/${image}`;
}