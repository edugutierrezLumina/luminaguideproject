import React, { useState, useEffect } from 'react';
import TherapistCard from './TherapistCard';
import TherapistModal from './TherapistModal';
import './TherapistDirectory.css';

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

interface Therapist {
  _id: string;
  userId: User;
  specialty: string;
  location: string;
  language: string[];
  dateOfBirth: Date;
  profileImage?: string;
  bio?: string;
  isActive: boolean;
}

const TherapistDirectory: React.FC = () => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [filteredTherapists, setFilteredTherapists] = useState<Therapist[]>([]);
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Estados de filtros
  const [filters, setFilters] = useState({
    specialty: '',
    location: '',
    language: ''
  });

  // Opciones dinámicas de filtros basadas en los terapeutas cargados
  const [filterOptions, setFilterOptions] = useState({
    specialties: [] as string[],
    locations: [] as string[],
    languages: [] as string[]
  });

  useEffect(() => {
    fetchTherapists();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, therapists]);

  const fetchTherapists = async () => {
    setLoading(true);
    try {
      // ✅ Obtener URL del API desde variables de entorno
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const url = `${apiUrl}/therapists/public`;
      
      console.log('📡 Fetching therapists from:', url);
      
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Therapists loaded:', data.therapists?.length || 0);
        
        setTherapists(data.therapists || []);
        setFilteredTherapists(data.therapists || []);
        extractFilterOptions(data.therapists || []);
      } else {
        console.error('❌ Response error:', response.status, response.statusText);
        const errorData = await response.text();
        console.error('Error details:', errorData);
      }
    } catch (error) {
      console.error('❌ Error fetching therapists:', error);
      console.error('💡 Make sure backend is running on http://localhost:8080');
      console.error('💡 Check that VITE_API_URL is set correctly in .env');
    } finally {
      setLoading(false);
    }
  };

  // Extraer opciones únicas para filtros dinámicos
  const extractFilterOptions = (therapistsList: Therapist[]) => {
    const specialties = [...new Set(therapistsList.map(t => t.specialty))];
    const locations = [...new Set(therapistsList.map(t => t.location))];
    const allLanguages = therapistsList.flatMap(t => t.language);
    const languages = [...new Set(allLanguages)];

    setFilterOptions({
      specialties: specialties.sort(),
      locations: locations.sort(),
      languages: languages.sort()
    });
  };

  const applyFilters = () => {
    let filtered = [...therapists];

    if (filters.specialty) {
      filtered = filtered.filter(t => t.specialty === filters.specialty);
    }

    if (filters.location) {
      filtered = filtered.filter(t => 
        t.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.language) {
      filtered = filtered.filter(t => t.language.includes(filters.language));
    }

    setFilteredTherapists(filtered);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const clearFilters = () => {
    setFilters({ specialty: '', location: '', language: '' });
  };

  const handleViewMore = (therapist: Therapist) => {
    setSelectedTherapist(therapist);
  };

  const closeModal = () => {
    setSelectedTherapist(null);
  };

  return (
    <div className="therapist-directory">
      {/* Header del directorio */}
      <div className="directory-hero">
        <h1>Directorio de Terapeutas</h1>
        <p>Encuentra al profesional ideal para tu bienestar</p>
      </div>

      {/* Sección de Filtros */}
      <div className="filters-section">
        <div className="filters-container">
          <div className="filter-group">
            <label htmlFor="specialty-filter">
              <i className="icon">🌿</i>
              Especialidad
            </label>
            <select
              id="specialty-filter"
              value={filters.specialty}
              onChange={(e) => handleFilterChange('specialty', e.target.value)}
            >
              <option value="">Todas las especialidades</option>
              {filterOptions.specialties.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="location-filter">
              <i className="icon">📍</i>
              Ciudad
            </label>
            <select
              id="location-filter"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            >
              <option value="">Todas las ciudades</option>
              {filterOptions.locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="language-filter">
              <i className="icon">💬</i>
              Idioma
            </label>
            <select
              id="language-filter"
              value={filters.language}
              onChange={(e) => handleFilterChange('language', e.target.value)}
            >
              <option value="">Todos los idiomas</option>
              {filterOptions.languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          <button className="clear-filters-btn" onClick={clearFilters}>
            Limpiar Filtros
          </button>
        </div>

        <div className="results-summary">
          <p>
            <strong>{filteredTherapists.length}</strong> terapeuta{filteredTherapists.length !== 1 ? 's' : ''} encontrado{filteredTherapists.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Grid de Cards */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando terapeutas...</p>
        </div>
      ) : filteredTherapists.length > 0 ? (
        <div className="therapists-grid">
          {filteredTherapists.map(therapist => (
            <TherapistCard
              key={therapist._id}
              therapist={therapist}
              onViewMore={() => handleViewMore(therapist)}
            />
          ))}
        </div>
      ) : (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h3>No se encontraron terapeutas</h3>
          <p>Intenta ajustar los filtros para ver más resultados</p>
          <button onClick={clearFilters} className="try-again-btn">
            Ver todos los terapeutas
          </button>
        </div>
      )}

      {/* Modal de Perfil Completo */}
      {selectedTherapist && (
        <TherapistModal therapist={selectedTherapist} onClose={closeModal} />
      )}
    </div>
  );
};

export default TherapistDirectory;