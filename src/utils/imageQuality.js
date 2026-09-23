/**
 * Image quality checker — uploaded image print size साठी पुरेशी आहे का ते DPI ने ठरवतो.
 *
 * DPI = image pixels ÷ print size (inches).
 * fixed materials — size आधीच inches; banner — feet, म्हणून ×12 करून inches.
 * banner दुरून बघतात → कमी DPI चालतो; nameplate जवळून → जास्त हवा.
 */

// material प्रकारानुसार DPI मान (नंतर tune करता येतील)
const THRESHOLDS = {
  fixed: { excellent: 100, good: 72 }, // जवळून बघतात
  banner: { excellent: 50, good: 25 }, // दुरून बघतात
};

/**
 * DPI वरून quality ठरवतो.
 * परत: { level, dpi, message } — level = "excellent" | "good" | "low"
 */
function gradeDpi(dpi, type) {
  const t = THRESHOLDS[type] || THRESHOLDS.fixed;

  if (dpi >= t.excellent) {
    return {
      level: "excellent",
      dpi: Math.round(dpi),
      message: "Great! The image quality is best for the selected size.",
    };
  }

  if (dpi >= t.good) {
    return {
      level: "good",
      dpi: Math.round(dpi),
      message:
        "The image quality is acceptable at the selected size, but a higher-resolution image would look sharper.",
    };
  }

  return {
    level: "low",
    dpi: Math.round(dpi),
    message:
      "The image quality may look blurry at the selected size. Consider uploading a higher-resolution image.",
  };
}

/**
 * मुख्य function.
 * @param pixelW, pixelH  — image चे actual pixels (naturalWidth/Height)
 * @param printW, printH  — print size (inches मध्ये — banner साठी आधीच feet×12 करून द्या)
 * @param type            — "fixed" किंवा "banner"
 * परत: { level, dpi, message } किंवा null (चुकीचे inputs)
 */
export function checkImageQuality(pixelW, pixelH, printW, printH, type) {
  const pw = Number(pixelW);
  const ph = Number(pixelH);
  const iw = Number(printW);
  const ih = Number(printH);

  if (!pw || !ph || !iw || !ih) return null;

  // image आणि print चा long/short side जुळवा (orientation-agnostic)
  const pxLong = Math.max(pw, ph);
  const pxShort = Math.min(pw, ph);
  const inLong = Math.max(iw, ih);
  const inShort = Math.min(iw, ih);

  // प्रत्येक दिशेचा DPI, आणि worst case (सर्वात कमी) घ्या
  const dpiLong = pxLong / inLong;
  const dpiShort = pxShort / inShort;
  const dpi = Math.min(dpiLong, dpiShort);

  return gradeDpi(dpi, type);
}

/**
 * fixed frameSize string ("12 x 6 inch") मधून inches काढतो.
 * परत: { w, h } किंवा null
 */
export function parseFrameInches(frameSize) {
  const match = frameSize?.match(/(\d+(?:\.\d+)?)\s*[xX*]\s*(\d+(?:\.\d+)?)/);
  if (!match) return null;
  return { w: Number(match[1]), h: Number(match[2]) };
}