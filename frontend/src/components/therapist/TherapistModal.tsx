import React, { useEffect, useState } from 'react';
import ContactModal from './ContactModal';
import './TherapistModal.css';

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
  dateOfBirth: Date;
  profileImage?: string;
  bio?: string;
}

interface TherapistModalProps {
  therapist: Therapist;
  onClose: () => void;
}

const TherapistModal: React.FC<TherapistModalProps> = ({ therapist, onClose }) => {
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

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
    
    if (firstName === 'Therapist' || !firstName || !lastName) {
      return therapist.userId?.email || 'Terapeuta';
    }
    
    return `${firstName} ${lastName}`;
  };

  const calculateAge = () => {
    const birthDate = new Date(therapist.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleContactClick = () => {
    setShowContactModal(true);
  };

  const handleContactClose = () => {
    setShowContactModal(false);
  };

  return (
    <>
      <div className="modal-backdrop" onClick={handleBackdropClick}>
        <div className="modal-container">
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>

          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-profile-section">
                <div className="modal-avatar">
                  {therapist.profileImage ? (
                    <img 
                      src={therapist.profileImage} 
                      alt={getDisplayName()}
                    />
                  ) : (
                    <div className="avatar-placeholder-large">
                      {getInitials()}
                    </div>
                  )}
                </div>

                <div className="modal-profile-info">
                  <h2 className="modal-name">
                    {getDisplayName()}
                  </h2>
                  <p className="modal-specialty">{therapist.specialty}</p>
                  <div className="modal-location">
                    <i className="icon">📍</i>
                    <span>{therapist.location}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button className="contact-btn" onClick={handleContactClick}>
                <i className="icon">✉️</i>
                Contactar
              </button>
            </div>

            <div className="modal-body">
              <div className="profile-section">
                <h3>Sobre mí</h3>
                <p className="bio-text">
                  {therapist.bio || 'Este terapeuta aún no ha agregado una descripción.'}
                </p>
              </div>

              <div className="profile-section">
                <h3>Información Profesional</h3>
                <div className="info-grid">
                  <div className="info-card">
                    <div className="info-icon">🌿</div>
                    <div>
                      <p className="info-label">Especialidad</p>
                      <p className="info-value">{therapist.specialty}</p>
                    </div>
                  </div>

                  <div className="info-card">
                    <div className="info-icon">📍</div>
                    <div>
                      <p className="info-label">Ubicación</p>
                      <p className="info-value">{therapist.location}</p>
                    </div>
                  </div>

                  <div className="info-card">
                    <div className="info-icon">💬</div>
                    <div>
                      <p className="info-label">Idiomas</p>
                      <p className="info-value">{therapist.language.join(', ')}</p>
                    </div>
                  </div>

                  <div className="info-card">
                    <div className="info-icon">👤</div>
                    <div>
                      <p className="info-label">Edad</p>
                      <p className="info-value">{calculateAge()} años</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="profile-section">
                <h3>Descripción de la Especialidad</h3>
                <div className="specialty-description">
                  <p>Especialista en {therapist.specialty.toLowerCase()} con experiencia comprobada en el campo.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Contacto */}
      {showContactModal && (
        <ContactModal 
          therapistName={getDisplayName()}
          onClose={handleContactClose}
        />
      )}
    </>
  );
};

export default TherapistModal;