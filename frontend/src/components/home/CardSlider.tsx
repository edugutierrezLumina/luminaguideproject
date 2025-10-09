import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './CardSlider.css';

interface Slide {
  id: number;
  titleKey: string;
  descKey: string;
  image: string;
}

const slides: Slide[] = [
  { id: 1, titleKey: '', descKey: '', image: '/images/slide1.jpg' },
  { id: 2, titleKey: '', descKey: '', image: '/images/slide2.jpg' },
  { id: 3, titleKey: '', descKey: '', image: '/images/slide3.jpg' },
  { id: 4, titleKey: '', descKey: '', image: '/images/slide4.jpg' },
  { id: 5, titleKey: '', descKey: '', image: '/images/slide5.jpg' },
  { id: 6, titleKey: '', descKey: '', image: '/images/slide6.jpg' },
];

const CardSlider: React.FC = () => {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  }, []);

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 10000); // Cambiar cada 10 segundos

    return () => clearInterval(interval);
  }, [nextSlide]);

  const getCardClass = (index: number) => {
    const diff = (index - activeIndex + slides.length) % slides.length;

    if (diff === 0) return 'card active';
    if (diff === 1) return 'card next';
    if (diff === slides.length - 1) return 'card prev';
    return 'card hidden';
  };

  return (
    <div className="card-slider-container">
      <div className="slider-wrapper">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={getCardClass(index)}
            onClick={() => goToSlide(index)}
          >
            <img src={slide.image} alt={t(slide.titleKey)} />
            <div className="card-content">
              <h2>{t(slide.titleKey)}</h2>
              <p>{t(slide.descKey)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="slider-indicators">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            className={`indicator ${index === activeIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          >
            {index === activeIndex && (
              <div 
                className="progress-ring"
                style={{
                  animation: `progressRing 10s linear`,
                }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CardSlider;