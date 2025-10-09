import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import CardSlider from '../components/home/CardSlider';
import './Home.css';

const Home: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="home-page">

      {/* Slider de tarjetas */}
      <section className="hero-slider">
        <CardSlider />
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision-section">
        <div className="mission-vision-container">
          <div className="mission-card">
            <div className="icon">🎯</div>
            <h3>{t('home.mission.title')}</h3>
            <p>{t('home.mission.text')}</p>
          </div>
          <div className="vision-card">
            <div className="icon">🌟</div>
            <h3>{t('home.vision.title')}</h3>
            <p>{t('home.vision.text')}</p>
          </div>
        </div>
      </section>

      {/* Cards de navegación */}
      <section className="navigation-cards-section">
        <div className="navigation-cards-container">
          <Link to="/portfolio" className="nav-card">
            <div className="card-icon">👨‍⚕️</div>
            <h4>{t('home.card.directory.title')}</h4>
            <p>{t('home.card.directory.desc')}</p>
            <span className="card-arrow">→</span>
          </Link>
          <Link to="/forum" className="nav-card">
            <div className="card-icon">📝</div>
            <h4>{t('home.card.blog.title')}</h4>
            <p>{t('home.card.blog.desc')}</p>
            <span className="card-arrow">→</span>
          </Link>
          <Link to="/faq" className="nav-card">
            <div className="card-icon">❓</div>
            <h4>{t('home.card.faq.title')}</h4>
            <p>{t('home.card.faq.desc')}</p>
            <span className="card-arrow">→</span>
          </Link>
        </div>
      </section>

      {/* Footer al final */}
      
    </div>
  );
};

export default Home;