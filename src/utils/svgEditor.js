export function updateTextElement(

    svgDocument,

    id,

    value

) {

    const element = svgDocument.getElementById(id);

    if (!element) return;

    element.textContent = value;

}

export function updateStyle(

    svgDocument,

    id,

    styles

) {

    const element = svgDocument.getElementById(id);

    if (!element) return;

    Object.entries(styles).forEach(

        ([key, value]) => {

            element.setAttribute(

                key,

                value

            );

        }

    );

}