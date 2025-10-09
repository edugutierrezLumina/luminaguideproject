import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        {/* Logo versión footer - Rectángulo horizontal */}
        <div className="footer-logo">
          <img src="/images/letterslumina.png" alt="LuminaGuide" className="footer-logo-img" />
        </div>

        {/* Terms and Conditions texto clickable */}
        <a href="/terms" className="terms-link" target="_blank" rel="noopener noreferrer">
          Terms and Conditions
        </a>

        {/* Redes sociales con íconos en botones redondos */}
        <div className="social-icons">
          <a href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer" className="social-btn">
            <img src="/images/tiktok.svg" alt="TikTok" />
          </a>
          <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="social-btn">
            <img src="/images/facebook.svg" alt="Facebook" />
          </a>
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="social-btn">
            <img src="/images/instagram.svg" alt="Instagram" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;