"use client";

import { useState } from "react";

export default function FAQ() {
  const faqs = [
    {
      question: "Can I upload my own design?",
      answer:
        "Absolutely. If you already have a design, simply upload it, choose the material and required size, and we'll manufacture it for you.",
    },
    {
      question: "What materials are available?",
      answer:
        "Right now we manufacture on premium MDF, Acrylic, Sunboard and Vinyl finishes. Banner also available",
    },
    {
      question: "How long does production take?",
      answer:
        "Production time depends on the design and size selected. Most orders are manufactured within a few working days before dispatch.",
    },
    {
      question: "Do you deliver across India?",
      answer:
        "Yes. We deliver safely across India using trusted courier partners.",
    },
    {
      question: "What file formats can I upload?",
      answer:
        "You can upload JPG, PNG, SVG files for custom manufacturing.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(0);

  function toggle(index) {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  }

  return (
    <section className="py-5 bg-light">
      <style>{`
        .faq-wrap { max-width: 760px; margin: 0 auto; }
        .faq-item {
          background: #fff;
          border: 1px solid #eef0f2;
          border-radius: 14px;
          margin-bottom: 14px;
          overflow: hidden;
          box-shadow: 0 4px 14px rgba(15,23,42,.04);
        }
        .faq-q {
          width: 100%;
          text-align: left;
          background: transparent;
          border: none;
          padding: 18px 20px;
          font-weight: 600;
          font-size: 1.02rem;
          color: #0f172a;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          cursor: pointer;
        }
        .faq-q:hover { background: #f8fafc; }
        .faq-icon {
          flex-shrink: 0;
          width: 26px; height: 26px;
          border-radius: 50%;
          background: #2563eb;
          color: #fff;
          display: grid;
          place-items: center;
          font-size: 1.1rem;
          line-height: 1;
          transition: transform .2s ease;
        }
        .faq-item.open .faq-icon { transform: rotate(45deg); }
        .faq-a {
          max-height: 0;
          overflow: hidden;
          transition: max-height .25s ease;
        }
        .faq-item.open .faq-a { max-height: 320px; }
        .faq-a-inner {
          padding: 0 20px 18px;
          color: #475569;
          line-height: 1.6;
        }
      `}</style>

      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold mb-2">Frequently Asked Questions</h2>
          <p className="text-muted fs-5 mb-0">
            Answers to common questions about uploading, sizes, and delivery.
          </p>
        </div>

        <div className="faq-wrap">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div className={`faq-item ${isOpen ? "open" : ""}`} key={index}>
                <button
                  type="button"
                  className="faq-q"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <span className="faq-icon">+</span>
                </button>

                <div className="faq-a">
                  <div className="faq-a-inner">{faq.answer}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}