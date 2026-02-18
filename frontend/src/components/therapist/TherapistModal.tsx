// frontend/src/components/therapist/TherapistModal.tsx
import React, { useEffect, useState } from 'react';
import { 
  XMarkIcon,
  EnvelopeIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
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
    
    // ✅ DEBUG
    console.log('🔍 Therapist:', therapist);
    console.log('📸 Profile Image:', therapist.profileImage);
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [therapist]);

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
      return therapist.userId?.email || 'Therapist';
    }
    
    return `${firstName} ${lastName}`;
  };

  const getImageUrl = () => {
    if (!therapist.profileImage) {
      console.log('❌ No profile image');
      return null;
    }

    if (therapist.profileImage.startsWith('http')) {
      console.log('✅ Full URL:', therapist.profileImage);
      return therapist.profileImage;
    }

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    const imagePath = therapist.profileImage.startsWith('/') 
      ? therapist.profileImage 
      : `/${therapist.profileImage}`;
    
    const fullUrl = `${apiUrl}${imagePath}`;
    console.log('🔗 Built URL:', fullUrl);
    
    return fullUrl;
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

  const imageUrl = getImageUrl();

  return (
    <>
      <div className="modal-backdrop" onClick={handleBackdropClick}>
        <div className="modal-container">
          
          <button className="modal-close-btn" onClick={onClose}>
            <XMarkIcon className="close-icon" />
          </button>

          <div className="modal-content">
            
            {/* Header */}
            <div className="modal-header">
              <div className="modal-profile-section">
                
                <div className="modal-avatar">
                  {imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt={getDisplayName()}
                      onError={(e) => {
                        console.error('❌ Image failed to load:', imageUrl);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : null}
                  {(!imageUrl || !therapist.profileImage) && (
                    <div className="avatar-placeholder-large">
                      {getInitials()}
                    </div>
                  )}
                </div>

                <div className="modal-profile-info">
                  <h2 className="modal-name">{getDisplayName()}</h2>
                  <p className="modal-specialty">{therapist.specialty}</p>
                  <div className="modal-location">
                    <MapPinIcon className="location-icon" />
                    <span>{therapist.location}</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Contact Button */}
            <div className="modal-actions">
              <button className="contact-btn" onClick={handleContactClick}>
                <EnvelopeIcon className="btn-icon" />
                Contact
              </button>
            </div>

            {/* Body */}
            <div className="modal-body">
              
              <div className="profile-section">
                <h3>About Me</h3>
                <p className="bio-text">
                  {therapist.bio || 'This therapist has not added a description yet.'}
                </p>
              </div>

              <div className="profile-section">
                <h3>Professional Information</h3>
                <div className="info-grid">
                  
                  {/* Specialty */}
                  <div className="info-card">
                    <div className="info-icon">
                      <SparklesIcon className="card-icon-heroic" />
                    </div>
                    <div className="info-text-container">
                      <p className="info-label">Specialty</p>
                      <p className="info-value">{therapist.specialty}</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="info-card">
                    <div className="info-icon">
                      <MapPinIcon className="card-icon-heroic" />
                    </div>
                    <div className="info-text-container">
                      <p className="info-label">Location</p>
                      <p className="info-value">{therapist.location}</p>
                    </div>
                  </div>

                  {/* Languages - ✅ COMO LISTA */}
                  <div className="info-card">
                    <div className="info-icon">
                      <ChatBubbleLeftRightIcon className="card-icon-heroic" />
                    </div>
                    <div className="info-text-container">
                      <p className="info-label">Languages</p>
                      {therapist.language.length > 0 ? (
                        <ul className="language-list">
                          {therapist.language.map((lang, index) => (
                            <li key={index} className="language-item">{lang}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="info-value">Not specified</p>
                      )}
                    </div>
                  </div>

                  {/* Age */}
                  <div className="info-card">
                    <div className="info-icon">
                      <UserIcon className="card-icon-heroic" />
                    </div>
                    <div className="info-text-container">
                      <p className="info-label">Age</p>
                      <p className="info-value">{calculateAge()} years</p>
                    </div>
                  </div>

                </div>
              </div>

              <div className="profile-section">
                <h3>Specialty Description</h3>
                <div className="specialty-description">
                  <p>Specialist in {therapist.specialty.toLowerCase()} with proven experience in the field.</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

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