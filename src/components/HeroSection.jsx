import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch slides from backend
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/hero-carousel/slides`);
        const data = await res.json();

        if (data.success && data.data.length > 0) {
          // Only active slides and sorted by 'order'
          const activeSlides = data.data
            .filter((slide) => slide.isActive)
            .sort((a, b) => a.order - b.order)
            .map((slide) => ({
              ...slide,
              imageUrl: slide.imageUrl, // Cloudinary URL already full
            }));

          if (activeSlides.length === 0) throw new Error("No active slides");

          setSlides(activeSlides);
          setError(null);
        } else {
          throw new Error("No slides found");
        }
      } catch (err) {
        console.error("Error fetching slides:", err);
        setError("Failed to load carousel");

        // Fallback slide
        setSlides([
          {
            _id: "fallback",
            imageUrl:
              "https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, [API_URL]);

  // Auto slide
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const goToSlide = (index) => setCurrentSlide(index);

  if (loading) {
    return (
      <div style={styles.heroContainer} className="d-flex justify-content-center align-items-center">
        <div className="spinner-border text-light" role="status" style={{ width: "3rem", height: "3rem" }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.heroContainer}>
      {slides.map((slide, index) => (
        <div key={slide._id} className={`hero-slide ${index === currentSlide ? "active" : ""}`}>
          <img src={slide.imageUrl} alt={`Slide ${index + 1}`} style={styles.heroSlideImage} />
        </div>
      ))}

      {slides.length > 1 && (
        <>
          <button className="hero-nav-button prev" onClick={prevSlide} aria-label="Previous slide">
            &#10094;
          </button>
          <button className="hero-nav-button next" onClick={nextSlide} aria-label="Next slide">
            &#10095;
          </button>

          <div className="hero-indicators">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`hero-indicator ${index === currentSlide ? "active" : ""}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </>
      )}

      {/* CSS */}
      <style>{`
        .hero-slide {
          position: absolute; width: 100%; height: 100%;
          opacity: 0; transition: opacity 1s ease-in-out;
        }
        .hero-slide.active { opacity: 1; }

        .hero-nav-button {
          position: absolute; top: 50%; transform: translateY(-50%);
          background: rgba(255,255,255,0.3); border: none;
          width: 50px; height: 50px; border-radius: 50%;
          font-size: 1.5rem; cursor: pointer; z-index: 3;
          display: flex; align-items: center; justify-content: center;
        }
        .hero-nav-button:hover { background: rgba(255,255,255,0.5); }
        .hero-nav-button.prev { left: 20px; }
        .hero-nav-button.next { right: 20px; }

        .hero-indicators {
          position: absolute; bottom: 20px; left: 50%;
          transform: translateX(-50%); display: flex; gap: 10px; z-index: 3;
        }
        .hero-indicator {
          width: 12px; height: 12px; border-radius: 50%;
          background: rgba(255,255,255,0.5); border: none; cursor: pointer;
        }
        .hero-indicator.active {
          background: white; width: 30px; border-radius: 6px;
        }

        @media (max-width: 768px) {
          .hero-nav-button { width: 40px; height: 40px; font-size: 1.2rem; }
        }
      `}</style>
    </div>
  );
};

const styles = {
  heroContainer: {
    position: "relative",
    height: "500px",
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
  },
  heroSlideImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
};

export default HeroSection;
