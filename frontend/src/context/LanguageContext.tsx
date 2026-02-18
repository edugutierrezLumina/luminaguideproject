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
    'home.card.blog.title': 'Blog',
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

    // Nav
    'nav.home': 'Inicio',
    'nav.directory': 'Directorio',
    'nav.blog': 'Blog',
    'nav.forum': 'Foro',
    'nav.login': 'Login',

    // Blog & FAQ
    'blog.hero.title': 'Blog de Bienestar',
    'blog.hero.subtitle': 'Descubre artículos sobre salud holística y medicina alternativa',
    'blog.faq.open': 'Preguntas Frecuentes',
    'blog.faq.close': 'Cerrar',
    'blog.faq.title': 'Preguntas Frecuentes',
    'blog.loading': 'Cargando artículos...',
    'blog.empty.title': 'No hay artículos publicados',
    'blog.empty.subtitle': 'Vuelve pronto para ver nuevo contenido',
    'blog.video.unsupported': 'Tu navegador no soporta el elemento de video.',
    'blog.faq.q1': '¿Qué es la medicina alternativa?',
    'blog.faq.a1': 'La medicina alternativa abarca un conjunto de prácticas terapéuticas que se utilizan fuera de la medicina convencional. Su enfoque suele ser holístico, considerando el bienestar físico, mental y emocional del paciente. En muchos casos se emplea como complemento a los tratamientos médicos tradicionales, no como sustituto.',
    'blog.faq.q2': '¿Cómo elijo al terapeuta adecuado?',
    'blog.faq.a2': 'Es fundamental revisar la formación, certificaciones y experiencia profesional del terapeuta. También es recomendable consultar referencias y opiniones de otros pacientes. Un profesional competente debe actuar con ética, explicar claramente los tratamientos y respetar las decisiones del paciente.',
    'blog.faq.q3': '¿Las terapias alternativas son seguras?',
    'blog.faq.a3': 'Muchas terapias pueden ser seguras cuando son realizadas por profesionales capacitados, aunque no todas cuentan con respaldo científico suficiente. Siempre se debe informar al médico tratante antes de iniciar cualquier terapia alternativa, especialmente en casos de enfermedades o uso de medicamentos.',
    'blog.faq.q4': '¿Cuánto tiempo dura un tratamiento típico?',
    'blog.faq.a4': 'La duración del tratamiento depende del tipo de terapia, los objetivos terapéuticos y las necesidades del paciente. Algunos tratamientos pueden ser de corta duración, mientras que otros requieren seguimiento a mediano o largo plazo.',
    'blog.faq.q5': '¿Puedo combinar medicina convencional con alternativa?',
    'blog.faq.a5': 'Sí, muchas personas optan por un enfoque integrativo que combina medicina convencional y terapias alternativas. Esta combinación debe realizarse con supervisión médica para garantizar seguridad y eficacia.',
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
    'home.card.blog.title': 'Blog',
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

    // Nav
    'nav.home': 'Home',
    'nav.directory': 'Directory',
    'nav.blog': 'Blog',
    'nav.forum': 'Forum',
    'nav.login': 'Login',

    // Blog & FAQ
    'blog.hero.title': 'Wellness Blog',
    'blog.hero.subtitle': 'Discover articles on holistic health and alternative medicine',
    'blog.faq.open': 'Frequently Asked Questions',
    'blog.faq.close': 'Close',
    'blog.faq.title': 'Frequently Asked Questions',
    'blog.loading': 'Loading articles...',
    'blog.empty.title': 'No published articles',
    'blog.empty.subtitle': 'Check back soon for new content',
    'blog.video.unsupported': 'Your browser does not support the video tag.',
    'blog.faq.q1': 'What is alternative medicine?',
    'blog.faq.a1': 'Alternative medicine includes a range of therapeutic practices used outside conventional medical care. It generally follows a holistic approach, addressing physical, mental, and emotional well-being. It is often used as a complement to traditional medical treatments rather than a replacement.',
    'blog.faq.q2': 'How do I choose the right therapist?',
    'blog.faq.a2': "It is important to review the therapist's education, certifications, and professional experience. Patient reviews and references can also be helpful. A qualified practitioner should act ethically, communicate clearly, and respect patient choices.",
    'blog.faq.q3': 'Are alternative therapies safe?',
    'blog.faq.a3': 'Many alternative therapies can be safe when performed by trained professionals, although not all are supported by sufficient scientific evidence. Patients should always inform their physician before starting any alternative treatment, particularly if they have medical conditions or take medication.',
    'blog.faq.q4': 'How long does a typical treatment last?',
    'blog.faq.a4': "Treatment duration depends on the type of therapy, therapeutic goals, and the patient's individual needs. Some treatments are short-term, while others require medium- or long-term follow-up.",
    'blog.faq.q5': 'Can I combine conventional and alternative medicine?',
    'blog.faq.a5': 'Yes, many people choose an integrative approach that combines conventional medicine with alternative therapies. This should always be done under medical supervision to ensure safety and effectiveness.',
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

export { LanguageContext };

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};