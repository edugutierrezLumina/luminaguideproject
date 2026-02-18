// frontend/src/components/therapist/TherapistDirectory.tsx
import React, { useState, useEffect } from 'react';
import { 
  FunnelIcon, 
  MapPinIcon, 
  LanguageIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
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
  const [filters, setFilters] = useState({
    specialty: '',
    location: '',
    language: ''
  });
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
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/therapists/public`);
      if (response.ok) {
        const data = await response.json();
        setTherapists(data.therapists);
        setFilteredTherapists(data.therapists);
        extractFilterOptions(data.therapists);
      }
    } catch (error) {
      console.error('Error fetching therapists:', error);
    } finally {
      setLoading(false);
    }
  };

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
      filtered = filtered.filter(t => t.location.toLowerCase().includes(filters.location.toLowerCase()));
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
      
      {/* Header */}
      <div className="directory-hero">
        <UserGroupIcon className="hero-icon" />
        <h1>Therapist Directory</h1>
        <p>Find the ideal professional for your well-being</p>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filters-container">
          
          {/* Specialty Filter */}
          <div className="filter-group">
            <label htmlFor="specialty-filter">
              <FunnelIcon className="filter-icon" />
              Specialty
            </label>
            <select
              id="specialty-filter"
              value={filters.specialty}
              onChange={(e) => handleFilterChange('specialty', e.target.value)}
            >
              <option value="">All specialties</option>
              {filterOptions.specialties.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div className="filter-group">
            <label htmlFor="location-filter">
              <MapPinIcon className="filter-icon" />
              City
            </label>
            <select
              id="location-filter"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            >
              <option value="">All cities</option>
              {filterOptions.locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Language Filter */}
          <div className="filter-group">
            <label htmlFor="language-filter">
              <LanguageIcon className="filter-icon" />
              Language
            </label>
            <select
              id="language-filter"
              value={filters.language}
              onChange={(e) => handleFilterChange('language', e.target.value)}
            >
              <option value="">All languages</option>
              {filterOptions.languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          <button className="clear-filters-btn" onClick={clearFilters}>
            <XMarkIcon className="btn-icon" />
            Clear Filters
          </button>
        </div>

        {/* Results Summary */}
        <div className="results-summary">
          <p>
            <strong>{filteredTherapists.length}</strong> therapist{filteredTherapists.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      {/* Therapists Grid */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading therapists...</p>
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
          <div className="no-results-icon">
            <MagnifyingGlassIcon />
          </div>
          <h3>No therapists found</h3>
          <p>Try adjusting the filters to see more results</p>
          <button onClick={clearFilters} className="try-again-btn">
            View all therapists
          </button>
        </div>
      )}

      {/* Therapist Modal */}
      {selectedTherapist && (
        <TherapistModal
          therapist={selectedTherapist}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default TherapistDirectory;