"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import "../../styles/hero.css";

// TODO: या placeholder images तुमच्या स्वतःच्या product फोटोंनी बदला.
// public/ मध्ये ठेवल्यास "/hero/nameplate.jpg" असे द्या, किंवा Cloudinary URL.
const SLIDES = [
  {
    image: "/hero/home_name.png",
    eyebrow: "Personalized Name Plates",
    title: "Create a Name Plate Made for You",
    lead: "Choose your design, personalize it with your name and create a beautiful name plate for your home or office.",
  },
  {
    image: "/hero/family_photo.png",
    eyebrow: "Personalized Photo Frames",
    title: "Turn Your Memories Into Lasting Prints",
    lead: "Upload your favourite photo and create a personalized photo frame printed on premium materials.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1606166325683-e6deb697d301?w=1600&q=80",
    eyebrow: "Certificates & Awards",
    title: "Premium Printing for Certificates & Awards",
    lead: "Bring your certificates, awards and plaques to life with professional printing and premium finishing.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1600&q=80",
    eyebrow: "Your Design, Your Product",
    title: "Upload Anything, We'll Print It",
    lead: "From artwork and logos to quotes and photographs, turn your ideas into beautifully printed products.",
  },
];

const AUTO_MS = 4000;

export default function Hero() {
  const [current, setCurrent] = useState(0);

  // auto-slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, AUTO_MS);
    return () => clearInterval(timer);
  }, []);

  // Mobile touch + Desktop mouse slide
  const [touchStart, setTouchStart] = useState(null);
  const [mouseStart, setMouseStart] = useState(null);

  function handleTouchStart(e) {
    setTouchStart(e.touches[0].clientX);
  }

  function handleTouchEnd(e) {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;

    if (diff > 50) {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    } else if (diff < -50) {
      setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    }

    setTouchStart(null);
  }

  function handleMouseDown(e) {
    setMouseStart(e.clientX);
  }

  function handleMouseUp(e) {
    if (mouseStart === null) return;
    const diff = mouseStart - e.clientX;

    if (diff > 50) {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    } else if (diff < -50) {
      setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    }

    setMouseStart(null);
  }

  const slide = SLIDES[current];

  return (
    <section
      className="bv-hero"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{ cursor: "grab" }}
    >
      {/* सरकणाऱ्या background images */}
      {SLIDES.map((s, i) => (
        <div
          key={i}
          className={`bv-hero__slide ${i === current ? "active" : ""}`}
          style={{ backgroundImage: `url(${s.image})` }}
        />
      ))}

      <div className="bv-hero__overlay"></div>

      <div className="bv-hero__stage">
        <div className="container bv-hero__inner">
          <div className="bv-hero__text" key={current}>
            <span className="bv-hero__eyebrow">{slide.eyebrow}</span>

            <h1 className="bv-hero__title">{slide.title}</h1>

            <p className="bv-hero__lead">{slide.lead}</p>
          </div>

          <div className="d-flex flex-wrap gap-3">
            <Link href="/custom-design" className="bv-hero__cta-primary">
              Upload Your Design →
            </Link>

            <Link href="/products" className="bv-hero__cta-secondary">
              Browse Designs
            </Link>
          </div>
        </div>
      </div>

      {/* dots */}
      <div className="bv-hero__dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`bv-hero__dot ${i === current ? "active" : ""}`}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
