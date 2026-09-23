export function parseSVG(svgString) {

    const parser = new DOMParser();

    const svgDocument = parser.parseFromString(

        svgString,

        "image/svg+xml"

    );

    return svgDocument;

}

export function serializeSVG(svgDocument) {

    return new XMLSerializer().serializeToString(

        svgDocument

    );

}