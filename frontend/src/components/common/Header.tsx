import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext'; // ✅ IMPORTAR
import LanguageSelector from './LanguageSelector';
import './Header.css';

const Header: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth(); // ✅ OBTENER DATOS DE AUTH

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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

        {/* Logo 2: luminabottom.png (Cuadrado) */}
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
          <Link to="/therapists" className="nav-link">
            {t('nav.directory')}
          </Link>
          <Link to="/blog" className="nav-link">
            {t('nav.blog')}
          </Link>
          <Link to="/forum" className="nav-link">
            {t('nav.forum')}
          </Link>
        </nav>

        {/* Acciones (Lenguaje y Login/User Menu) */}
        <div className="header-actions">
          <LanguageSelector />
          
          {/* ✅ RENDERIZADO CONDICIONAL */}
          {user ? (
            // SI HAY USUARIO LOGUEADO
            <div className="user-menu">
              <div className="user-info">
                <span className="user-email">{user.email}</span>
                {isAdmin && (
                  <span className="user-role-badge">Admin</span>
                )}
              </div>
              <div className="user-actions-buttons">
                {isAdmin && (
                  <button 
                    className="admin-panel-btn" 
                    onClick={() => navigate('/admin')}
                  >
                     Panel
                  </button>
                )}
                <button 
                  className="logout-btn" 
                  onClick={handleLogout}
                >
                   Salir
                </button>
              </div>
            </div>
          ) : (
            // SI NO HAY USUARIO, MOSTRAR BOTÓN LOGIN
            <button 
              className="login-btn"
              onClick={() => navigate('/login')}
            >
              {t('nav.login')}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;