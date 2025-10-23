/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Definir tipo para las traducciones
type Translations = {
  [key: string]: string;
};

type TranslationDictionary = {
  [key in Language]: Translations;
};

const translations: TranslationDictionary = {
  es: {
    // Login
    'login.title': 'LuminaGuide',
    'login.subtitle': 'Panel de Administración',
    'login.email': 'Email',
    'login.password': 'Contraseña',
    'login.button': 'Iniciar Sesión',
    'login.loading': 'Iniciando sesión...',
    
    // Admin Panel
    'admin.therapists': 'Terapeutas',
    'admin.blog': 'Blog',
    'admin.forum': 'Foro',
    'admin.logout': 'Cerrar Sesión',
    
    // Home
    'home.title': 'LuminaGuide',
    'home.subtitle': 'Tu guía de medicina alternativa',
    'home.welcome': 'Bienvenido a LuminaGuide',
    'home.description': 'Conectando personas con terapeutas de medicina alternativa',
    'home.therapists.title': 'Terapeutas Certificados',
    'home.therapists.desc': 'Profesionales verificados en medicina alternativa',
    'home.community.title': 'Comunidad',
    'home.community.desc': 'Foro para compartir experiencias',
    'home.admin.title': 'Admin Panel',
    'home.admin.desc': 'Gestión completa del sitio',
    'home.view.therapists': 'Ver Terapeutas',
    'home.community.forum': 'Foro Comunitario',
    'home.admin.panel': 'Panel Admin',
    'home.explore': 'Explorar',
    'home.participate': 'Participar',
    'home.access': 'Acceder',
    'home.mission.title': 'Misión',
    'home.mission.text': 'La misión de Lumina es conectar a las personas con profesionales de la salud y el bienestar, proporcionando una plataforma integral y accesible para encontrar apoyo y recursos para mejorar la calidad de vida.',
    'home.vision.title': 'Visión',
    'home.vision.text': 'La visión de Lumina es ser la plataforma líder en la conexión de personas con profesionales de la salud y el bienestar, reconocida por su compromiso con la calidad, la accesibilidad y la innovación.',
    'home.card.directory.title': 'Directorio de Terapeutas',
    'home.card.directory.desc': 'Explora nuestro directorio completo de profesionales certificados',
    'home.card.blog.title': 'Blog y Foro',
    'home.card.blog.desc': 'Lee artículos y participa en nuestra comunidad',
    'home.card.faq.title': 'Preguntas Frecuentes',
    'home.card.faq.desc': 'Encuentra respuestas a tus dudas más comunes',
    
    // Therapist Manager
    'therapist.title': 'Gestión de Terapeutas',
    'therapist.new': 'Nuevo Terapeuta',
    'therapist.cancel': 'Cancelar',
    'therapist.edit': 'Editar Terapeuta',
    'therapist.create': 'Crear',
    'therapist.update': 'Actualizar',
    'therapist.delete': 'Eliminar',
    'therapist.email': 'Email',
    'therapist.password': 'Contraseña',
    'therapist.nationalId': 'ID Nacional',
    'therapist.specialty': 'Especialidad',
    'therapist.location': 'Ubicación',
    'therapist.languages': 'Idiomas (separados por coma)',
    'therapist.dob': 'Fecha de Nacimiento',
    'therapist.bio': 'Biografía',
    'therapist.active': 'Activo',
    'therapist.inactive': 'Inactivo',
    
    // Common
    'common.loading': 'Cargando...',
    'common.save': 'Guardar',
    'common.edit': 'Editar',
    'common.delete': 'Eliminar',
    'common.back': 'Volver',

    // En 'es':
    'nav.home': 'Inicio',
    'nav.directory': 'Directorio',
    'nav.blog': 'Blog',
    'nav.forum': 'Foro',
    'nav.login': 'Login',
  },
  en: {
    // Login
    'login.title': 'LuminaGuide',
    'login.subtitle': 'Admin Panel',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.button': 'Login',
    'login.loading': 'Logging in...',
    
    // Admin Panel
    'admin.therapists': 'Therapists',
    'admin.blog': 'Blog',
    'admin.forum': 'Forum',
    'admin.logout': 'Logout',
    
    // Home
    'home.title': 'LuminaGuide',
    'home.subtitle': 'Your alternative medicine guide',
    'home.welcome': 'Welcome to LuminaGuide',
    'home.description': 'Connecting people with alternative medicine therapists',
    'home.therapists.title': 'Certified Therapists',
    'home.therapists.desc': 'Verified professionals in alternative medicine',
    'home.community.title': 'Community',
    'home.community.desc': 'Forum to share experiences',
    'home.admin.title': 'Admin Panel',
    'home.admin.desc': 'Complete site management',
    'home.view.therapists': 'View Therapists',
    'home.community.forum': 'Community Forum',
    'home.admin.panel': 'Admin Panel',
    'home.explore': 'Explore',
    'home.participate': 'Participate',
    'home.access': 'Access',
    'home.mission.title': 'Mission',
    'home.mission.text': "Lumina's mission is to connect people with health and wellness professionals, providing a comprehensive and accessible platform to find support and resources to improve quality of life.",
    'home.vision.title': 'Vision',
    'home.vision.text': "Lumina's vision is to be the leading platform in connecting people with health and wellness professionals, recognized for its commitment to quality, accessibility, and innovation.",
    'home.card.directory.title': 'Therapist Directory',
    'home.card.directory.desc': 'Explore our complete directory of certified professionals',
    'home.card.blog.title': 'Blog & Forum',
    'home.card.blog.desc': 'Read articles and participate in our community',
    'home.card.faq.title': 'Frequently Asked Questions',
    'home.card.faq.desc': 'Find answers to your most common questions',
    
    // Therapist Manager
    'therapist.title': 'Therapist Management',
    'therapist.new': 'New Therapist',
    'therapist.cancel': 'Cancel',
    'therapist.edit': 'Edit Therapist',
    'therapist.create': 'Create',
    'therapist.update': 'Update',
    'therapist.delete': 'Delete',
    'therapist.email': 'Email',
    'therapist.password': 'Password',
    'therapist.nationalId': 'National ID',
    'therapist.specialty': 'Specialty',
    'therapist.location': 'Location',
    'therapist.languages': 'Languages (comma separated)',
    'therapist.dob': 'Date of Birth',
    'therapist.bio': 'Biography',
    'therapist.active': 'Active',
    'therapist.inactive': 'Inactive',
    
    // Common
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.back': 'Back',

    // En 'en':
    'nav.home': 'Home',
    'nav.directory': 'Directory',
    'nav.blog': 'Blog',
    'nav.forum': 'Forum',
    'nav.login': 'Login',
  },
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('es');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};