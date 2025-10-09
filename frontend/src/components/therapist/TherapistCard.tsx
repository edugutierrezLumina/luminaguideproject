import React from 'react';
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
  location: string;
  language: string[];
  profileImage?: string;
  bio?: string;
}

interface TherapistCardProps {
  therapist: Therapist;
  onViewMore: () => void;
}

const TherapistCard: React.FC<TherapistCardProps> = ({ therapist, onViewMore }) => {
  const getInitials = () => {
    // ✅ Manejo seguro de firstName y lastName
    const firstName = therapist.userId?.firstName || '';
    const lastName = therapist.userId?.lastName || '';
    
    if (!firstName && !lastName) {
      // Si no hay nombres, usar las primeras 2 letras del email
      const email = therapist.userId?.email || 'TH';
      return email.substring(0, 2).toUpperCase();
    }
    
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getDisplayName = () => {
    // ✅ Mostrar nombre completo o email si no hay nombre
    const firstName = therapist.userId?.firstName;
    const lastName = therapist.userId?.lastName;
    
    if (firstName === 'Therapist' || !firstName || !lastName) {
      // Si son valores por defecto, mostrar solo el email
      return therapist.userId?.email || 'Terapeuta';
    }
    
    return `${firstName} ${lastName}`;
  };

  return (
    <div className="therapist-card">
      <div className="card-header">
        <div className="therapist-avatar">
          {therapist.profileImage ? (
            <img 
              src={therapist.profileImage} 
              alt={getDisplayName()}
            />
          ) : (
            <div className="avatar-placeholder">
              {getInitials()}
            </div>
          )}
        </div>
      </div>

      <div className="card-body">
        <h3 className="therapist-name">
          {getDisplayName()}
        </h3>
        
        <span className="specialty-badge">{therapist.specialty}</span>

        <div className="therapist-info">
          <div className="info-item">
            <i className="icon">📍</i>
            <span>{therapist.location}</span>
          </div>
          <div className="info-item">
            <i className="icon">💬</i>
            <span>{therapist.language.join(', ')}</span>
          </div>
        </div>

        {therapist.bio && (
          <p className="therapist-bio">
            {therapist.bio.substring(0, 100)}
            {therapist.bio.length > 100 ? '...' : ''}
          </p>
        )}
      </div>

      <div className="card-footer">
        <button className="view-more-btn" onClick={onViewMore}>
          Ver Perfil Completo
        </button>
      </div>
    </div>
  );
};

export default TherapistCard;