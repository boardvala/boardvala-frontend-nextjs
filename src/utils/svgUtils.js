export function updateSVG(svg, values) {

    const parser = new DOMParser();

    const xml = parser.parseFromString(svg, "image/svg+xml");

    Object.keys(values).forEach((key) => {

        const node = xml.getElementById(key);

        if (!node) return;

        const field = values[key];

        node.textContent = field.text;

        node.setAttribute(
            "font-family",
            field.style.fontFamily
        );

        node.setAttribute(
            "font-size",
            field.style.fontSize
        );

        node.setAttribute(
            "fill",
            field.style.fontColor
        );

        node.setAttribute(
            "font-weight",
            field.style.fontWeight
        );

    });

    return new XMLSerializer().serializeToString(xml);

}