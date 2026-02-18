// frontend/src/components/admin/TherapistManager.tsx
import React, { useState, useEffect } from 'react';
import { 
  PhotoIcon, 
  XMarkIcon, 
  PencilIcon, 
  PauseIcon, 
  PlayIcon, 
  TrashIcon,
  PlusIcon,
  MapPinIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { therapistService } from '../../services/therapistService';
import type { Therapist } from '../../services/therapistService';
import './TherapistManager.css';

// ============================================
// FILTROS ESTÁTICOS PREDEFINIDOS
// ============================================

const STATIC_CATEGORIES = [
  'Energy & Spiritual Healing',
  'Bodywork & Massage',
  'Holistic & Natural Medicine',
  'Mental & Emotional Healing',
  'Movement & Embodiment',
  'Coaching & Guidance',
  'Integrative Medical',
  'Ceremony & Community',
  'Creative & Expressive Healing',
  'Specialized Modalities'
];

const STATIC_SPECIALTIES_BY_CATEGORY: Record<string, string[]> = {
  'Energy & Spiritual Healing': [
    'Reiki', 'Shamanic Healing', 'Crystal Healing', 'Energy Work', 'Chakra Balancing'
  ],
  'Bodywork & Massage': [
    'Deep Tissue Massage', 'Thai Massage', 'Reflexology', 'Craniosacral Therapy', 'Myofascial Release'
  ],
  'Holistic & Natural Medicine': [
    'Naturopathic Doctor', 'Herbalist', 'Ayurveda', 'Traditional Chinese Medicine', 'Homeopathy'
  ],
  'Mental & Emotional Healing': [
    'EMDR', 'Somatic Therapy', 'Hypnotherapy', 'Cognitive Behavioral Therapy', 'Trauma Therapy'
  ],
  'Movement & Embodiment': [
    'Yoga', 'Dance Therapy', 'Personal Trainer', 'Pilates', 'Qigong'
  ],
  'Coaching & Guidance': [
    'Life Coach', 'Soul Guide', 'Career Coach', 'Spiritual Mentor', 'Wellness Coach'
  ],
  'Integrative Medical': [
    'Integrative MD', 'Chiropractor', 'Acupuncturist', 'Physical Therapist', 'Osteopath'
  ],
  'Ceremony & Community': [
    'Cacao Ceremony', 'Sound Bath', 'Meditation', 'Breathwork Circle', "Women's Circle"
  ],
  'Creative & Expressive Healing': [
    'Art Therapy', 'Music Therapy', 'Writing Therapy', 'Drama Therapy', 'Poetry Therapy'
  ],
  'Specialized Modalities': [
    'Doula', 'Fertility Healing', 'Ancestral Healing', 'Past Life Regression', 'Medical Intuitive'
  ]
};

const STATIC_SESSION_TYPES = [
  'Individual', 
  'Group', 
  'Couples', 
  'Family', 
  'Retreats', 
  'Circles'
];

const STATIC_FOCUS_AREAS = [
  'Women',
  'Men',
  'LGBTQ+',
  'Children',
  'Families',
  'Trauma-Informed',
  'Neurodivergent-Friendly',
  'Cultural Healing',
  'Ancestral Healing'
];

const STATIC_LOCATION_TYPES = ['Online', 'In-person', 'Hybrid'];

const STATIC_LANGUAGES = [
  'English',
  'Spanish',
  'Bilingual',
  'Portuguese',
  'French',
  'German',
  'Mandarin'
];

const STATIC_DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

const STATIC_TIME_SLOTS = ['Morning', 'Afternoon', 'Evening'];

// ============================================
// INTERFACES
// ============================================

interface FilterOptions {
  categories: string[];
  specialtiesByCategory: Record<string, string[]>;
  allSpecialties: string[];
  sessionTypes: string[];
  focusAreas: string[];
  locationTypes: string[];
  languages: string[];
  daysOfWeek: string[];
  timeSlots: string[];
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const TherapistManager: React.FC = () => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    categories: [...STATIC_CATEGORIES],
    specialtiesByCategory: { ...STATIC_SPECIALTIES_BY_CATEGORY },
    allSpecialties: Object.values(STATIC_SPECIALTIES_BY_CATEGORY).flat(),
    sessionTypes: [...STATIC_SESSION_TYPES],
    focusAreas: [...STATIC_FOCUS_AREAS],
    locationTypes: [...STATIC_LOCATION_TYPES],
    languages: [...STATIC_LANGUAGES],
    daysOfWeek: [...STATIC_DAYS_OF_WEEK],
    timeSlots: [...STATIC_TIME_SLOTS]
  });

  const [showCustomSpecialty, setShowCustomSpecialty] = useState(false);
  const [customSpecialty, setCustomSpecialty] = useState('');

  const [showCustomLanguage, setShowCustomLanguage] = useState(false);
  const [customLanguage, setCustomLanguage] = useState('');

  const [formData, setFormData] = useState<Therapist>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    nationalId: '',
    specialty: '',
    category: '',
    additionalSpecialties: [],
    location: '',
    locationType: '',
    city: '',
    state: '',
    country: '',
    language: [],
    dateOfBirth: '',
    bio: '',
    credentials: '',
    yearsExperience: undefined,
    certifications: [],
    licensedCertified: false,
    sessionTypes: [],
    focusAreas: [],
    availability: {
      daysOfWeek: [],
      timeSlots: [],
      urgentAvailable: false,
      waitlist: false
    },
    hourlyRate: undefined,
    slidingScale: false,
    acceptsInsurance: false,
    freeConsultation: false,
    packagesAvailable: false,
    phone: '',
    website: ''
  });

  useEffect(() => {
    loadTherapists();
    loadFilterOptions();
  }, []);

  const loadFilterOptions = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await fetch(`${apiUrl}/therapists/filters`);

      if (response.ok) {
        const data = await response.json();
        
        setFilterOptions({
          categories: [...STATIC_CATEGORIES, ...(data.filters.categories || [])],
          specialtiesByCategory: {
            ...STATIC_SPECIALTIES_BY_CATEGORY,
            ...(data.filters.specialtiesByCategory || {})
          },
          allSpecialties: [
            ...Object.values(STATIC_SPECIALTIES_BY_CATEGORY).flat(),
            ...(data.filters.allSpecialties || [])
          ],
          sessionTypes: [...STATIC_SESSION_TYPES, ...(data.filters.sessionTypes || [])],
          focusAreas: [...STATIC_FOCUS_AREAS, ...(data.filters.focusAreas || [])],
          locationTypes: [...STATIC_LOCATION_TYPES],
          languages: [...STATIC_LANGUAGES, ...(data.filters.languages || [])],
          daysOfWeek: [...STATIC_DAYS_OF_WEEK],
          timeSlots: [...STATIC_TIME_SLOTS]
        });
        
        console.log('Filter options loaded successfully');
      }
    } catch (error) {
      console.error('Error loading filter options:', error);
      console.log('Using static filters only');
    }
  };

  const loadTherapists = async () => {
    try {
      setLoading(true);
      const data = await therapistService.getAll();
      setTherapists(data);
    } catch (error) {
      console.error('Error loading therapists:', error);
      alert('Error al cargar terapeutas');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Solo se permiten imágenes (JPEG, JPG, PNG, GIF, WEBP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar 5MB');
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingId && !imageFile) {
      alert('La foto del terapeuta es obligatoria');
      return;
    }

    const finalSpecialty = showCustomSpecialty && customSpecialty
      ? customSpecialty
      : formData.specialty;

    const finalLanguages = showCustomLanguage && customLanguage
      ? [...formData.language, customLanguage]
      : formData.language;

    try {
      const formDataToSend = new FormData();
      
      formDataToSend.append('email', formData.email || '');
      if (!editingId && formData.password) formDataToSend.append('password', formData.password);
      formDataToSend.append('firstName', formData.firstName || '');
      formDataToSend.append('lastName', formData.lastName || '');
      formDataToSend.append('nationalId', formData.nationalId);
      formDataToSend.append('specialty', finalSpecialty);
      if (formData.category) formDataToSend.append('category', formData.category);
      formDataToSend.append('location', formData.location);
      if (formData.locationType) formDataToSend.append('locationType', formData.locationType);
      if (formData.city) formDataToSend.append('city', formData.city);
      if (formData.state) formDataToSend.append('state', formData.state);
      formDataToSend.append('country', formData.country || 'United States');
      formDataToSend.append('language', finalLanguages.join(','));
      formDataToSend.append('dateOfBirth', formData.dateOfBirth);
      if (formData.bio) formDataToSend.append('bio', formData.bio);
      if (formData.credentials) formDataToSend.append('credentials', formData.credentials);
      if (formData.yearsExperience) formDataToSend.append('yearsExperience', formData.yearsExperience.toString());
      formDataToSend.append('licensedCertified', (formData.licensedCertified || false).toString());
      if (formData.sessionTypes && formData.sessionTypes.length > 0) 
        formDataToSend.append('sessionTypes', formData.sessionTypes.join(','));
      if (formData.focusAreas && formData.focusAreas.length > 0) 
        formDataToSend.append('focusAreas', formData.focusAreas.join(','));
      if (formData.hourlyRate) formDataToSend.append('hourlyRate', formData.hourlyRate.toString());
      formDataToSend.append('slidingScale', (formData.slidingScale || false).toString());
      formDataToSend.append('acceptsInsurance', (formData.acceptsInsurance || false).toString());
      formDataToSend.append('freeConsultation', (formData.freeConsultation || false).toString());
      formDataToSend.append('packagesAvailable', (formData.packagesAvailable || false).toString());
      if (formData.phone) formDataToSend.append('phone', formData.phone);
      if (formData.website) formDataToSend.append('website', formData.website);

      if (imageFile) {
        formDataToSend.append('profileImage', imageFile);
      }

      if (editingId) {
        await therapistService.update(editingId, formDataToSend);
        alert('Terapeuta actualizado exitosamente');
      } else {
        await therapistService.create(formDataToSend);
        alert('Terapeuta creado exitosamente');
      }

      resetForm();
      loadTherapists();
      loadFilterOptions();
    } catch (error) {
      console.error('Error saving therapist:', error);
      alert('Error al guardar terapeuta');
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const therapist = await therapistService.getById(id);
      setFormData({
        firstName: therapist.userId?.firstName || '',
        lastName: therapist.userId?.lastName || '',
        email: therapist.userId?.email || '',
        nationalId: therapist.nationalId,
        specialty: therapist.specialty,
        category: therapist.category || '',
        additionalSpecialties: therapist.additionalSpecialties || [],
        location: therapist.location,
        locationType: therapist.locationType || '',
        city: therapist.city || '',
        state: therapist.state || '',
        country: therapist.country || '',
        language: therapist.language,
        dateOfBirth: therapist.dateOfBirth.split('T')[0],
        bio: therapist.bio || '',
        credentials: therapist.credentials || '',
        yearsExperience: therapist.yearsExperience,
        certifications: therapist.certifications || [],
        licensedCertified: therapist.licensedCertified || false,
        sessionTypes: therapist.sessionTypes || [],
        focusAreas: therapist.focusAreas || [],
        availability: {
          daysOfWeek: therapist.availability?.daysOfWeek || [],
          timeSlots: therapist.availability?.timeSlots || [],
          urgentAvailable: therapist.availability?.urgentAvailable || false,
          waitlist: therapist.availability?.waitlist || false
        },
        hourlyRate: therapist.hourlyRate,
        slidingScale: therapist.slidingScale || false,
        acceptsInsurance: therapist.acceptsInsurance || false,
        freeConsultation: therapist.freeConsultation || false,
        packagesAvailable: therapist.packagesAvailable || false,
        phone: therapist.phone || '',
        website: therapist.website || ''
      });

      if (therapist.profileImage) {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        setImagePreview(`${apiUrl}${therapist.profileImage}`);
      }

      setEditingId(id);
      setShowForm(true);
    } catch (error) {
      console.error('Error loading therapist:', error);
      alert('Error al cargar terapeuta');
    }
  };

  const handleToggleStatus = async (id: string) => {
    const therapist = therapists.find(t => t._id === id);
    const action = therapist?.isActive ? 'desactivar' : 'activar';
    
    if (!window.confirm(`¿Estás seguro de ${action} este terapeuta?`)) return;

    try {
      await therapistService.toggleStatus(id);
      alert(`Terapeuta ${action === 'desactivar' ? 'desactivado' : 'activado'} exitosamente`);
      loadTherapists();
    } catch (error) {
      console.error('Error changing therapist status:', error);
      alert('Error al cambiar el estado del terapeuta');
    }
  };

  const handlePermanentDelete = async (id: string) => {
    const confirmed = window.confirm(
      'ADVERTENCIA: Esto eliminará PERMANENTEMENTE al terapeuta y su usuario de la base de datos.\n\n' +
      'Esta acción NO se puede deshacer.\n\n' +
      '¿Estás COMPLETAMENTE seguro de continuar?'
    );
    
    if (!confirmed) return;

    const doubleCheck = window.confirm(
      'ÚLTIMA CONFIRMACIÓN:\n\n' +
      'Se eliminará permanentemente:\n' +
      '- El perfil del terapeuta\n' +
      '- El usuario asociado\n' +
      '- Toda su información\n\n' +
      '¿Continuar con la eliminación?'
    );

    if (!doubleCheck) return;

    try {
      await therapistService.delete(id);
      alert('Terapeuta eliminado PERMANENTEMENTE de la base de datos');
      loadTherapists();
    } catch (error) {
      console.error('Error deleting therapist permanently:', error);
      alert('Error al eliminar terapeuta');
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      nationalId: '',
      specialty: '',
      category: '',
      additionalSpecialties: [],
      location: '',
      locationType: '',
      city: '',
      state: '',
      country: '',
      language: [],
      dateOfBirth: '',
      bio: '',
      credentials: '',
      yearsExperience: undefined,
      certifications: [],
      licensedCertified: false,
      sessionTypes: [],
      focusAreas: [],
      availability: {
        daysOfWeek: [],
        timeSlots: [],
        urgentAvailable: false,
        waitlist: false
      },
      hourlyRate: undefined,
      slidingScale: false,
      acceptsInsurance: false,
      freeConsultation: false,
      packagesAvailable: false,
      phone: '',
      website: ''
    });
    setEditingId(null);
    setShowForm(false);
    setShowCustomSpecialty(false);
    setCustomSpecialty('');
    setShowCustomLanguage(false);
    setCustomLanguage('');
    setImageFile(null);
    setImagePreview(null);
  };

  const handleLanguageToggle = (lang: string) => {
    const current = formData.language || [];
    if (current.includes(lang)) {
      setFormData({ ...formData, language: current.filter(l => l !== lang) });
    } else {
      setFormData({ ...formData, language: [...current, lang] });
    }
  };

  const getSpecialtiesForCategory = () => {
    if (!formData.category || formData.category === 'Other') {
      return filterOptions.allSpecialties;
    }
    return filterOptions.specialtiesByCategory[formData.category] || [];
  };

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="therapist-manager">
      <div className="manager-header">
        <h1>Gestión de Terapeutas</h1>
        <button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancelar' : '+ Nuevo Terapeuta'}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h2>{editingId ? 'Editar Terapeuta' : 'Nuevo Terapeuta'}</h2>
          <form onSubmit={handleSubmit}>
            
            {/* SECCIÓN DE FOTO (PRIMERA Y OBLIGATORIA) */}
            <div className="form-section photo-section">
              <h3>
                <PhotoIcon className="section-icon" style={{ width: '24px', height: '24px', display: 'inline-block', marginRight: '8px' }} />
                Foto del Terapeuta *
              </h3>
              
              {imagePreview ? (
                <div className="image-preview-container">
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                  <button type="button" className="remove-image-btn" onClick={handleRemoveImage}>
                    <XMarkIcon className="icon" />
                    Cambiar foto
                  </button>
                </div>
              ) : (
                <div className="image-upload-area">
                  <PhotoIcon className="upload-icon" />
                  <p>Sube una foto del terapeuta</p>
                  <label htmlFor="profileImage" className="upload-label">
                    Seleccionar archivo
                  </label>
                  <input
                    type="file"
                    id="profileImage"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                  <span className="upload-hint">JPEG, PNG, GIF, WEBP (máx. 5MB)</span>
                </div>
              )}
            </div>

            {/* SECCIÓN: INFORMACIÓN DE CUENTA */}
            <div className="form-section">
              <h3>Información de Cuenta</h3>

              <div className="form-row">
                <div className="form-group">
                  <label>Nombre *</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Nombre del terapeuta"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Apellido *</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Apellido del terapeuta"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={!!editingId}
                  />
                </div>

                {!editingId && (
                  <div className="form-group">
                    <label>Contraseña *</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required={!editingId}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* SECCIÓN: INFORMACIÓN BÁSICA */}
            <div className="form-section">
              <h3>Información Básica</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>ID Nacional *</label>
                  <input
                    type="text"
                    value={formData.nationalId}
                    onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Fecha de Nacimiento *</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            {/* SECCIÓN: ESPECIALIDAD Y CATEGORÍA */}
            <div className="form-section specialty-section">
              <h3>Especialidad y Categoría</h3>

              <div className="form-group">
                <label>Categoría Principal *</label>
                <select
                  value={formData.category}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      category: e.target.value,
                      specialty: ''
                    });
                    setShowCustomSpecialty(false);
                  }}
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  {filterOptions.categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="Other">Otra (agregar nueva)</option>
                </select>
              </div>

              {formData.category && !showCustomSpecialty && (
                <div className="form-group">
                  <label>Especialidad Principal *</label>
                  <select
                    value={formData.specialty}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setShowCustomSpecialty(true);
                        setFormData({ ...formData, specialty: '' });
                      } else {
                        setFormData({ ...formData, specialty: e.target.value });
                      }
                    }}
                    required
                  >
                    <option value="">Selecciona una especialidad</option>
                    {getSpecialtiesForCategory().map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                    <option value="__custom__">Agregar nueva especialidad</option>
                  </select>
                </div>
              )}

              {showCustomSpecialty && (
                <div className="form-group custom-specialty">
                  <label>Nueva Especialidad *</label>
                  <div className="custom-input-group">
                    <input
                      type="text"
                      value={customSpecialty}
                      onChange={(e) => setCustomSpecialty(e.target.value)}
                      placeholder="Escribe la nueva especialidad"
                      required
                    />
                    <button
                      type="button"
                      className="btn-cancel-custom"
                      onClick={() => {
                        setShowCustomSpecialty(false);
                        setCustomSpecialty('');
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                  <small className="form-hint">
                    Esta especialidad se agregará a la lista y estará disponible para futuros terapeutas
                  </small>
                </div>
              )}
            </div>

             <div className="form-section">
              <h3>
                <MapPinIcon className="section-icon" style={{ width: '24px', height: '24px', display: 'inline-block', marginRight: '8px' }} />
                Ubicación
              </h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Tipo de Ubicación</label>
                  <select
                    value={formData.locationType}
                    onChange={(e) => setFormData({ ...formData, locationType: e.target.value })}
                  >
                    <option value="">Selecciona...</option>
                    {filterOptions.locationTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Ciudad/Ubicación *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Ej: Portland, Oregon"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Ciudad</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Portland"
                  />
                </div>

                <div className="form-group">
                  <label>Estado</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="Oregon"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>País</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="United States"
                />
              </div>
            </div>

            {/* SECCIÓN: IDIOMAS */}
            <div className="form-section">
              <h3>
                <GlobeAltIcon className="section-icon" style={{ width: '24px', height: '24px', display: 'inline-block', marginRight: '8px' }} />
                Idiomas *
              </h3>
              <div className="form-group">
                <label>Selecciona los idiomas que habla el terapeuta</label>
                <div className="checkbox-group">
                  {filterOptions.languages.map(lang => (
                    <label key={lang} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.language.includes(lang)}
                        onChange={() => handleLanguageToggle(lang)}
                      />
                      {lang}
                    </label>
                  ))}
                  <label className="checkbox-label checkbox-custom-trigger">
                    <input
                      type="checkbox"
                      checked={showCustomLanguage}
                      onChange={(e) => setShowCustomLanguage(e.target.checked)}
                    />
                    <PlusIcon style={{ width: '14px', height: '14px', display: 'inline-block', marginRight: '4px' }} />
                    Otro (agregar nuevo)
                  </label>
                </div>

                {showCustomLanguage && (
                  <div className="custom-input-group" style={{ marginTop: '15px' }}>
                    <input
                      type="text"
                      value={customLanguage}
                      onChange={(e) => setCustomLanguage(e.target.value)}
                      placeholder="Escribe el nuevo idioma"
                    />
                    <button
                      type="button"
                      className="btn-cancel-custom"
                      onClick={() => {
                        setShowCustomLanguage(false);
                        setCustomLanguage('');
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                )}

                {formData.language.length === 0 && (
                  <small className="form-hint error">Debe seleccionar al menos un idioma</small>
                )}
              </div>
            </div>

            {/* SECCIÓN: SESIONES Y ENFOQUE */}
            <div className="form-section">
              <h3>Tipos de Sesión y Enfoque</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Tipos de Sesión</label>
                  <div className="checkbox-group">
                    {filterOptions.sessionTypes.map(type => (
                      <label key={type} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.sessionTypes?.includes(type)}
                          onChange={(e) => {
                            const current = formData.sessionTypes || [];
                            if (e.target.checked) {
                              setFormData({ ...formData, sessionTypes: [...current, type] });
                            } else {
                              setFormData({ ...formData, sessionTypes: current.filter(t => t !== type) });
                            }
                          }}
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Áreas de Enfoque</label>
                  <div className="checkbox-group">
                    {filterOptions.focusAreas.map(area => (
                      <label key={area} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.focusAreas?.includes(area)}
                          onChange={(e) => {
                            const current = formData.focusAreas || [];
                            if (e.target.checked) {
                              setFormData({ ...formData, focusAreas: [...current, area] });
                            } else {
                              setFormData({ ...formData, focusAreas: current.filter(a => a !== area) });
                            }
                          }}
                        />
                        {area}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* SECCIÓN: DISPONIBILIDAD */}
            <div className="form-section">
              <h3>Disponibilidad</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Días de la Semana</label>
                  <div className="checkbox-group">
                    {filterOptions.daysOfWeek.map(day => (
                      <label key={day} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.availability?.daysOfWeek?.includes(day) || false}
                          onChange={(e) => {
                            const current = formData.availability?.daysOfWeek || [];
                            const newDays = e.target.checked
                              ? [...current, day]
                              : current.filter(d => d !== day);
                            
                            setFormData({
                              ...formData,
                              availability: {
                                ...formData.availability,
                                daysOfWeek: newDays,
                                timeSlots: formData.availability?.timeSlots || [],
                                urgentAvailable: formData.availability?.urgentAvailable || false,
                                waitlist: formData.availability?.waitlist || false
                              }
                            });
                          }}
                        />
                        {day}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Horarios Disponibles</label>
                  <div className="checkbox-group">
                    {filterOptions.timeSlots.map(slot => (
                      <label key={slot} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.availability?.timeSlots?.includes(slot) || false}
                          onChange={(e) => {
                            const current = formData.availability?.timeSlots || [];
                            const newSlots = e.target.checked
                              ? [...current, slot]
                              : current.filter(s => s !== slot);
                            
                            setFormData({
                              ...formData,
                              availability: {
                                ...formData.availability,
                                daysOfWeek: formData.availability?.daysOfWeek || [],
                                timeSlots: newSlots,
                                urgentAvailable: formData.availability?.urgentAvailable || false,
                                waitlist: formData.availability?.waitlist || false
                              }
                            });
                          }}
                        />
                        {slot}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="checkbox-group-horizontal">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.availability?.urgentAvailable || false}
                    onChange={(e) => setFormData({
                      ...formData,
                      availability: {
                        ...formData.availability,
                        daysOfWeek: formData.availability?.daysOfWeek || [],
                        timeSlots: formData.availability?.timeSlots || [],
                        urgentAvailable: e.target.checked,
                        waitlist: formData.availability?.waitlist || false
                      }
                    })}
                  />
                  Disponible para casos urgentes
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.availability?.waitlist || false}
                    onChange={(e) => setFormData({
                      ...formData,
                      availability: {
                        ...formData.availability,
                        daysOfWeek: formData.availability?.daysOfWeek || [],
                        timeSlots: formData.availability?.timeSlots || [],
                        urgentAvailable: formData.availability?.urgentAvailable || false,
                        waitlist: e.target.checked
                      }
                    })}
                  />
                  Lista de espera disponible
                </label>
              </div>
            </div>

            {/* SECCIÓN: CREDENCIALES */}
            <div className="form-section">
              <h3>Credenciales y Experiencia</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Años de Experiencia</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.yearsExperience || ''}
                    onChange={(e) => setFormData({ ...formData, yearsExperience: parseInt(e.target.value) || undefined })}
                  />
                </div>

                <div className="form-group checkbox-single">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.licensedCertified || false}
                      onChange={(e) => setFormData({ ...formData, licensedCertified: e.target.checked })}
                    />
                    Licenciado/Certificado
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Credenciales</label>
                <input
                  type="text"
                  value={formData.credentials}
                  onChange={(e) => setFormData({ ...formData, credentials: e.target.value })}
                  placeholder="Ej: PhD, LCSW, RYT-500"
                />
              </div>

              <div className="form-group">
                <label>Biografía</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  placeholder="Cuéntanos sobre tu trayectoria y enfoque..."
                />
              </div>
            </div>

            {/* SECCIÓN: TARIFAS */}
            <div className="form-section">
              <h3>Tarifas y Servicios</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Tarifa por Hora (USD)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.hourlyRate || ''}
                    onChange={(e) => setFormData({ ...formData, hourlyRate: parseFloat(e.target.value) || undefined })}
                    placeholder="150"
                  />
                </div>
              </div>

              <div className="checkbox-group-horizontal">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.slidingScale || false}
                    onChange={(e) => setFormData({ ...formData, slidingScale: e.target.checked })}
                  />
                  Escala Móvil
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.acceptsInsurance || false}
                    onChange={(e) => setFormData({ ...formData, acceptsInsurance: e.target.checked })}
                  />
                  Acepta Seguro
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.freeConsultation || false}
                    onChange={(e) => setFormData({ ...formData, freeConsultation: e.target.checked })}
                  />
                  Consulta Gratis
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.packagesAvailable || false}
                    onChange={(e) => setFormData({ ...formData, packagesAvailable: e.target.checked })}
                  />
                  Paquetes Disponibles
                </label>
              </div>
            </div>

            {/* SECCIÓN: CONTACTO */}
            <div className="form-section">
              <h3>Información de Contacto</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Teléfono</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="form-group">
                  <label>Sitio Web</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://ejemplo.com"
                  />
                </div>
              </div>
            </div>

            {/* BOTONES DE ACCIÓN */}
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                {editingId ? 'Actualizar Terapeuta' : 'Crear Terapeuta'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* LISTA DE TERAPEUTAS */}
      <div className="therapists-list">
        <h2>Terapeutas Registrados ({therapists.length})</h2>
        
        {therapists.length === 0 ? (
          <div className="empty-state">
            <p>No hay terapeutas registrados aún.</p>
            <p>Haz clic en "Nuevo Terapeuta" para comenzar.</p>
          </div>
        ) : (
          <div className="therapists-grid">
            {therapists.map(therapist => (
              <div 
                key={therapist._id} 
                className={`therapist-card ${!therapist.isActive ? 'inactive' : ''}`}
              >
                {/* Imagen del terapeuta */}
                <div className="therapist-image">
                  {therapist.profileImage ? (
                    <img 
                      src={`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}${therapist.profileImage}`}
                      alt={`${therapist.userId?.firstName} ${therapist.userId?.lastName}`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=No+Image';
                      }}
                    />
                  ) : (
                    <div className="placeholder-image">
                      <PhotoIcon className="placeholder-icon" />
                    </div>
                  )}
                  {!therapist.isActive && (
                    <div className="inactive-badge">Inactivo</div>
                  )}
                </div>

                {/* Información del terapeuta */}
                <div className="therapist-info">
                  <h3>{therapist.userId?.firstName} {therapist.userId?.lastName}</h3>
                  <p className="specialty">{therapist.specialty}</p>
                  {therapist.category && (
                    <p className="category">{therapist.category}</p>
                  )}
                  <p className="location">
                    <MapPinIcon className="inline-icon" />
                    {therapist.location}
                  </p>
                  {therapist.language && therapist.language.length > 0 && (
                    <p className="languages">
                      <GlobeAltIcon className="inline-icon" />
                      {therapist.language.join(', ')}
                    </p>
                  )}
                  
                  {/* Información adicional */}
                  <div className="therapist-details">
                    {therapist.yearsExperience && (
                      <span className="detail-badge">{therapist.yearsExperience} años exp.</span>
                    )}
                    {therapist.licensedCertified && (
                      <span className="detail-badge">Certificado</span>
                    )}
                    {therapist.hourlyRate && (
                      <span className="detail-badge price">${therapist.hourlyRate}/hr</span>
                    )}
                  </div>

                  {/* Servicios */}
                  <div className="therapist-services">
                    {therapist.slidingScale && <span className="service-tag">Escala Móvil</span>}
                    {therapist.acceptsInsurance && <span className="service-tag">Acepta Seguro</span>}
                    {therapist.freeConsultation && <span className="service-tag">Consulta Gratis</span>}
                  </div>
                </div>

                {/* Acciones */}
                <div className="therapist-actions">
                  <button
                    className="btn-icon btn-edit"
                    onClick={() => handleEdit(therapist._id!)}
                    title="Editar"
                  >
                    <PencilIcon className="icon" />
                  </button>

                  <button
                    className={`btn-icon ${therapist.isActive ? 'btn-pause' : 'btn-play'}`}
                    onClick={() => handleToggleStatus(therapist._id!)}
                    title={therapist.isActive ? 'Desactivar' : 'Activar'}
                  >
                    {therapist.isActive ? (
                      <PauseIcon className="icon" />
                    ) : (
                      <PlayIcon className="icon" />
                    )}
                  </button>

                  <button
                    className="btn-icon btn-delete"
                    onClick={() => handlePermanentDelete(therapist._id!)}
                    title="Eliminar permanentemente"
                  >
                    <TrashIcon className="icon" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TherapistManager;