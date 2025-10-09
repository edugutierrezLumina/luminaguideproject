import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TherapistManager from '../components/admin/TherapistManager';
import BlogManager from '../components/admin/BlogManager';
import ForumModerator from '../components/admin/ForumModerator';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('therapists');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>LuminaGuide</h2>
          <p>Admin Panel</p>
        </div>

        <nav className="sidebar-nav">
          <Link
            to="/admin/therapists"
            className={activeTab === 'therapists' ? 'active' : ''}
            onClick={() => setActiveTab('therapists')}
          >
            👨‍⚕️ Terapeutas
          </Link>
          <Link
            to="/admin/blog"
            className={activeTab === 'blog' ? 'active' : ''}
            onClick={() => setActiveTab('blog')}
          >
            📝 Blog
          </Link>
          <Link
            to="/admin/forum"
            className={activeTab === 'forum' ? 'active' : ''}
            onClick={() => setActiveTab('forum')}
          >
            💬 Foro
          </Link>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <p>{user?.email}</p>
            <span className="user-role">{user?.role}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <Routes>
          <Route path="/" element={<TherapistManager />} />
          <Route path="/therapists" element={<TherapistManager />} />
          <Route path="/blog" element={<BlogManager />} />
          <Route path="/forum" element={<ForumModerator />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;