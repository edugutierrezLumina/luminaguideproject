import React, { useState, useEffect } from 'react';
import { therapistService } from '../../services/therapistService';
import type { Therapist } from '../../services/therapistService';
import './TherapistManager.css';

const TherapistManager: React.FC = () => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Therapist>({
    email: '',
    password: '',
    nationalId: '',
    specialty: '',
    location: '',
    language: [],
    dateOfBirth: '',
    bio: '',
  });

  useEffect(() => {
    loadTherapists();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await therapistService.update(editingId, formData);
        alert('Terapeuta actualizado exitosamente');
      } else {
        await therapistService.create(formData);
        alert('Terapeuta creado exitosamente');
      }
      resetForm();
      loadTherapists();
    } catch (error) {
      console.error('Error saving therapist:', error);
      alert('Error al guardar terapeuta');
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const therapist = await therapistService.getById(id);
      setFormData({
        email: therapist.userId?.email || '',
        nationalId: therapist.nationalId,
        specialty: therapist.specialty,
        location: therapist.location,
        language: therapist.language,
        dateOfBirth: therapist.dateOfBirth.split('T')[0],
        bio: therapist.bio || '',
      });
      setEditingId(id);
      setShowForm(true);
    } catch (error) {
      console.error('Error loading therapist:', error);
      alert('Error al cargar terapeuta');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar este terapeuta?')) return;
    
    try {
      await therapistService.delete(id);
      alert('Terapeuta eliminado exitosamente');
      loadTherapists();
    } catch (error) {
      console.error('Error deleting therapist:', error);
      alert('Error al eliminar terapeuta');
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      nationalId: '',
      specialty: '',
      location: '',
      language: [],
      dateOfBirth: '',
      bio: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const languages = e.target.value.split(',').map(lang => lang.trim());
    setFormData({ ...formData, language: languages });
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
                <label>Especialidad *</label>
                <input
                  type="text"
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  placeholder="Ej: Acupuntura"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Ubicación *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Ej: Bogotá, Colombia"
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

            <div className="form-group">
              <label>Idiomas (separados por coma) *</label>
              <input
                type="text"
                value={formData.language.join(', ')}
                onChange={handleLanguageChange}
                placeholder="Español, Inglés"
                required
              />
            </div>

            <div className="form-group">
              <label>Biografía</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                placeholder="Descripción profesional del terapeuta..."
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingId ? 'Actualizar' : 'Crear'} Terapeuta
              </button>
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="therapists-grid">
        {therapists.length === 0 ? (
          <p className="no-data">No hay terapeutas registrados</p>
        ) : (
          therapists.map((therapist) => (
            <div key={therapist._id} className="therapist-card">
              <div className="card-header">
                <h3>{therapist.specialty}</h3>
                <span className={`status ${therapist.isActive ? 'active' : 'inactive'}`}>
                  {therapist.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <div className="card-body">
                <p><strong>ID:</strong> {therapist.nationalId}</p>
                <p><strong>Ubicación:</strong> {therapist.location}</p>
                <p><strong>Idiomas:</strong> {therapist.language.join(', ')}</p>
                {therapist.bio && <p className="bio">{therapist.bio}</p>}
              </div>
              <div className="card-actions">
                <button onClick={() => handleEdit(therapist._id!)} className="btn-edit">
                  Editar
                </button>
                <button onClick={() => handleDelete(therapist._id!)} className="btn-delete">
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TherapistManager;