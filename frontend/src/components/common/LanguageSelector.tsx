import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './LanguageSelector.css';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="language-selector">
      <button
        className={language === 'es' ? 'active' : ''}
        onClick={() => setLanguage('es')}
        title="Español"
      >
        🇪🇸 ES
      </button>
      <button
        className={language === 'en' ? 'active' : ''}
        onClick={() => setLanguage('en')}
        title="English"
      >
        🇺🇸 EN
      </button>
    </div>
  );
};

export default LanguageSelector;