import DOMPurify from "dompurify";

export default function SVGCanvas({ svg }) {

    if (!svg) {

        return (

            <div className="card shadow">

                <div
                    className="card-body d-flex justify-content-center align-items-center"
                    style={{
                        minHeight: "500px"
                    }}
                >

                    <h5 className="text-muted">
                        Loading SVG...
                    </h5>

                </div>

            </div>

        );

    }

    return (

        <div className="card shadow">

            <div className="card-header d-flex justify-content-between">

                <h5 className="mb-0">
                    Live Preview
                </h5>

            </div>

            <div
                className="card-body text-center"
                style={{
                    overflow: "auto",
                    minHeight: "500px",
                    background: "#f8f9fa"
                }}
            >

                <div

                    style={{
                        display: "inline-block",
                        maxWidth: "100%"
                    }}

                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(svg)
                    }}

                />

            </div>

        </div>

    );

}