// frontend/src/pages/Home.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserGroupIcon, 
  DocumentTextIcon,
  QuestionMarkCircleIcon, 
  SparklesIcon, 
  EyeIcon 
} from '@heroicons/react/24/outline';
import { useLanguage } from '../context/LanguageContext';
import CardSlider from '../components/home/CardSlider';
import './Home.css';

const Home: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

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
            <div className="icon">
              <SparklesIcon className="mission-vision-icon" />
            </div>
            <h3>{t('home.mission.title')}</h3>
            <p>{t('home.mission.text')}</p>
          </div>

          <div className="vision-card">
            <div className="icon">
              <EyeIcon className="mission-vision-icon" />
            </div>
            <h3>{t('home.vision.title')}</h3>
            <p>{t('home.vision.text')}</p>
          </div>

        </div>
      </section>

      {/* Cards de navegación */}
      <section className="navigation-cards-section">
        <div className="navigation-cards-container">
          
          {/* Card 1: Directorio de Terapeutas */}
          <div className="nav-card" onClick={() => navigate('/therapists')}>
            <div className="card-icon">
              <UserGroupIcon className="nav-card-icon" />
            </div>
            <h4>{t('home.card.directory.title')}</h4>
            <p>{t('home.card.directory.desc')}</p>
            <span className="card-arrow">→</span>
          </div>

          {/* Card 2: Blog */}
          <div className="nav-card" onClick={() => navigate('/blog')}>
            <div className="card-icon">
              <DocumentTextIcon className="nav-card-icon" />
            </div>
            <h4>{t('home.card.blog.title')}</h4>
            <p>{t('home.card.blog.desc')}</p>
            <span className="card-arrow">→</span>
          </div>

          {/* Card 3: Preguntas Frecuentes (FAQ) → Foro */}
          <div className="nav-card" onClick={() => navigate('/forum')}>
            <div className="card-icon">
              <QuestionMarkCircleIcon className="nav-card-icon" />
            </div>
            <h4>{t('home.card.faq.title')}</h4>
            <p>{t('home.card.faq.desc')}</p>
            <span className="card-arrow">→</span>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;