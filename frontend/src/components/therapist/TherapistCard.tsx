import React from 'react';
import { MapPinIcon, ChatBubbleLeftIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import './TherapistCard.css';

interface User {
  firstName?: string;
  lastName?: string;
  email: string;
}

interface Therapist {
  _id: string;
  userId: User;
  specialty: string;
  category?: string;
  location: string;
  language: string[];
  profileImage?: string;
  bio?: string;
  credentials?: string;
  yearsExperience?: number;
}

interface TherapistCardProps {
  therapist: Therapist;
  onViewMore: () => void;
}

const TherapistCard: React.FC<TherapistCardProps> = ({ therapist, onViewMore }) => {
  const getInitials = () => {
    const firstName = therapist.userId?.firstName || '';
    const lastName = therapist.userId?.lastName || '';
    
    if (!firstName && !lastName) {
      const email = therapist.userId?.email || 'TH';
      return email.substring(0, 2).toUpperCase();
    }
    
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getDisplayName = () => {
    const firstName = therapist.userId?.firstName;
    const lastName = therapist.userId?.lastName;
    
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }
    
    return therapist.userId?.email || 'Therapist';
  };

  // ✅ CONSTRUIR URL COMPLETA DE LA IMAGEN
  const getImageUrl = () => {
    if (!therapist.profileImage) return null;
    
    // Si ya es una URL completa (http/https)
    if (therapist.profileImage.startsWith('http')) {
      return therapist.profileImage;
    }
    
    // Si es ruta relativa, construir URL completa
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    return `${apiUrl}${therapist.profileImage}`;
  };

  const imageUrl = getImageUrl();

  return (
    <div className="therapist-card-horizontal">
      {/* FOTO A LA IZQUIERDA */}
      <div className="therapist-photo-section">
        <div className="therapist-avatar-horizontal">
          {imageUrl ? (
            <>
              <img 
                src={imageUrl}
                alt={getDisplayName()}
                onLoad={() => console.log('✅ Image loaded:', imageUrl)}
                onError={(e) => {
                  console.error('❌ Image failed to load:', imageUrl);
                  e.currentTarget.style.display = 'none';
                  const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                  if (placeholder) placeholder.style.display = 'flex';
                }}
              />
              <div className="avatar-placeholder-horizontal" style={{ display: 'none' }}>
                {getInitials()}
              </div>
            </>
          ) : (
            <div className="avatar-placeholder-horizontal">
              {getInitials()}
            </div>
          )}
        </div>
      </div>

      {/* INFO A LA DERECHA */}
      <div className="therapist-info-section">
        {/* NOMBRE Y CATEGORÍA ARRIBA */}
        <div className="therapist-header-info">
          <h3 className="therapist-name-horizontal">
            {getDisplayName()}
          </h3>
          
          {/* CATEGORÍA PRINCIPAL */}
          {therapist.category && (
            <span className="category-badge-horizontal">{therapist.category}</span>
          )}
          
          {/* ESPECIALIZACIÓN DEBAJO */}
          <span className="specialty-text-horizontal">{therapist.specialty}</span>
        </div>

        {/* UBICACIÓN E IDIOMAS CON HEROICONS */}
        <div className="therapist-details">
          <div className="detail-item">
            <MapPinIcon className="detail-icon" />
            <span>{therapist.location}</span>
          </div>
          <div className="detail-item">
            <ChatBubbleLeftIcon className="detail-icon" />
            <span>{therapist.language.join(', ')}</span>
          </div>
        </div>

        {/* CERTIFICADOS/CREDENCIALES CON HEROICON */}
        {therapist.credentials && (
          <div className="credentials-section">
            <AcademicCapIcon className="credentials-icon" />
            <span className="credentials-text">{therapist.credentials}</span>
          </div>
        )}

        {/* BOTÓN VER PERFIL - SIEMPRE VISIBLE */}
        <div className="card-footer-horizontal">
          <button className="view-profile-btn-horizontal" onClick={onViewMore}>
            View Full Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default TherapistCard;