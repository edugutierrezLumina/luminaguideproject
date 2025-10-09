import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSelector from './LanguageSelector';
import './Header.css';

const Header: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <header className="main-header">
      <div className="header-container">
        {/* Logo 1: luminagold.png (Vertical) */}
        <div className="logo-main">
          <Link to="/">
            <img 
              src="/images/luminagold.png" 
              alt="LuminaGuide Logo"
              className="logo-image logo-vertical"
            />
          </Link>
        </div>

        {/* Logo 2: letterslumina.png (Cuadrado) */}
        <div className="logo-secondary">
          <Link to="/">
            <img 
              src="/images/luminabottom.png" 
              alt="LuminaGuide"
              className="logo-image logo-square"
            />
          </Link>
        </div>

        {/* Navegación Principal */}
        <nav className="main-nav">
          <Link to="/" className="nav-link">
            {t('nav.home')}
          </Link>
          {/* ✅ RUTA AL DIRECTORIO DE TERAPEUTAS */}
          <Link to="/therapists" className="nav-link">
            {t('nav.directory')}
          </Link>
          <Link to="/blog" className="nav-link">
            {t('nav.blog')}
          </Link>
          <Link to="/faq" className="nav-link">
            {t('nav.faq')}
          </Link>
        </nav>

        {/* Acciones (Lenguaje y Login) */}
        <div className="header-actions">
          <LanguageSelector />
          <button 
            className="login-btn"
            onClick={() => navigate('/login')}
          >
            {t('nav.login')}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;