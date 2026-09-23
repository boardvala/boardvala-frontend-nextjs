export default function Sidebar({
  product,

  values,

  setValues,
}) {
  function handleTextChange(key, value) {
    setValues((prev) => ({
      ...prev,

      [key]: {
        ...prev[key],

        text: value,
      },
    }));
  }

  function handleStyleChange(key, styleKey, value) {
    setValues((prev) => ({
      ...prev,

      [key]: {
        ...prev[key],

        style: {
          ...prev[key].style,

          [styleKey]: value,
        },
      },
    }));
  }

  if (!product) {
    return (
      <div className="card shadow">
        <div className="card-body">Loading...</div>
      </div>
    );
  }

  return (
    <div className="card shadow">
      <div className="card-header">
        <h5 className="mb-0">Customize Name Plate</h5>
      </div>

      <div className="card-body">
        {product.editableFields.map((field) => (
          <div key={field.key} className="border rounded p-3 mb-4">
            <h6 className="mb-3">{field.label}</h6>

            {/* Text */}

            <div className="mb-3">
              <label>Text</label>

              <input
                className="form-control"
                value={values[field.key]?.text || ""}
                onChange={(e) =>
                  handleTextChange(
                    field.key,

                    e.target.value,
                  )
                }
              />
            </div>

            {/* Font Family */}

            <div className="mb-3">
              <label>Font Family</label>

              <select
                className="form-select"
                value={values[field.key]?.style.fontFamily || "Arial"}
                onChange={(e) =>
                  handleStyleChange(field.key, "fontFamily", e.target.value)
                }
              >
                <option value="Arial">Arial</option>
                <option value="'Times New Roman'">Times New Roman</option>
                <option value="Verdana">Verdana</option>
                <option value="Georgia">Georgia</option>
                <option value="Tahoma">Tahoma</option>
              </select>
            </div>

            {/* Font Size */}

            <div className="mb-3">
              <label>Font Size</label>

              <input
                type="range"
                min="10"
                max="100"
                value={values[field.key]?.style.fontSize || 40}
                className="form-range"
                onChange={(e) =>
                  handleStyleChange(
                    field.key,

                    "fontSize",

                    Number(e.target.value),
                  )
                }
              />

              <div>{values[field.key]?.style.fontSize} px</div>
            </div>

            {/* Font Weight */}

            <div className="mb-3">
              <label>Font Weight</label>

              <select
                className="form-select"
                value={values[field.key]?.style.fontWeight || "700"}
                onChange={(e) =>
                  handleStyleChange(
                    field.key,

                    "fontWeight",

                    e.target.value,
                  )
                }
              >
                <option value="300">300</option>

                <option value="400">400</option>

                <option value="500">500</option>

                <option value="600">600</option>

                <option value="700">700</option>

                <option value="800">800</option>
              </select>
            </div>

            {/* Font Color */}

            <div className="mb-3">
              <label>Font Color</label>

              <input
                type="color"
                className="form-control form-control-color"
                value={values[field.key]?.style.fontColor || "#ffffff"}
                onChange={(e) =>
                  handleStyleChange(
                    field.key,

                    "fontColor",

                    e.target.value,
                  )
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
