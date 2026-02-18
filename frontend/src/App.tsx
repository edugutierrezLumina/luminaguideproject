import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Home from './pages/Home';
import TherapistDirectory from './components/therapist/TherapistDirectory';
import Blog from './pages/Blog'; 
import './App.css';
import Forum from './pages/Forum'

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            
            <main style={{ flex: 1 }}>
              <Routes>
                {/* Rutas Públicas */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/therapists" element={<TherapistDirectory />} />
                <Route path="/blog" element={<Blog />} /> 
                <Route path="/forum" element={<Forum />} />
                
                {/* Rutas Protegidas */}
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                
                {/* Redirección por defecto */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;