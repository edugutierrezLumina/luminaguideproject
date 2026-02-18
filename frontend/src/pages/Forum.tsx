import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  PencilSquareIcon, 
  XMarkIcon,
  ChatBubbleLeftIcon,
  UserCircleIcon,
  QuestionMarkCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import './Forum.css';

interface Reply {
  _id: string;
  therapistName: string;
  content: string;
  createdAt: string;
}

interface ForumPost {
  _id: string;
  title: string;
  content: string;
  authorName: string;
  category?: string;
  tags?: string[];
  replies: Reply[];
  createdAt: string;
}

const Forum: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    content: '',
    authorName: '',
    authorEmail: '',
    category: '',
    tags: ''
  });

  const [errors, setErrors] = useState({
    title: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyError, setReplyError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await fetch(`${apiUrl}/forum/posts`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Forum posts loaded:', data.count);
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error('❌ Error fetching forum posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {
      title: '',
      content: ''
    };

    if (!newQuestion.title.trim()) {
      newErrors.title = 'El título es requerido';
    } else if (newQuestion.title.length > 200) {
      newErrors.title = `El título no puede superar 200 caracteres (${newQuestion.title.length}/200)`;
    }

    if (!newQuestion.content.trim()) {
      newErrors.content = 'El contenido es requerido';
    } else if (newQuestion.content.length < 20) {
      newErrors.content = `Mínimo 20 caracteres (${newQuestion.content.length}/20)`;
    }

    setErrors(newErrors);
    return !newErrors.title && !newErrors.content;
  };

  const handleContentChange = (value: string) => {
    setNewQuestion({...newQuestion, content: value});
    
    if (value.length > 0 && value.length < 20) {
      setErrors({...errors, content: `Mínimo 20 caracteres (${value.length}/20)`});
    } else {
      setErrors({...errors, content: ''});
    }
  };

  const handleTitleChange = (value: string) => {
    setNewQuestion({...newQuestion, title: value});
    
    if (value.length > 200) {
      setErrors({...errors, title: `Máximo 200 caracteres (${value.length}/200)`});
    } else {
      setErrors({...errors, title: ''});
    }
  };

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await fetch(`${apiUrl}/forum/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: newQuestion.title,
          content: newQuestion.content,
          authorName: newQuestion.authorName || 'Anonymous',
          authorEmail: newQuestion.authorEmail,
          category: newQuestion.category,
          tags: newQuestion.tags.split(',').map(t => t.trim()).filter(t => t)
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ ' + data.message);
        setNewQuestion({
          title: '',
          content: '',
          authorName: '',
          authorEmail: '',
          category: '',
          tags: ''
        });
        setErrors({ title: '', content: '' });
        setShowNewPostModal(false);
      } else {
        alert('❌ ' + data.message);
        
        if (data.field) {
          setErrors({
            ...errors,
            [data.field]: data.message
          });
        }
      }
    } catch (error) {
      console.error('Error submitting question:', error);
      alert('Error al enviar la pregunta');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReply = async (postId: string) => {
    if (!replyContent.trim()) {
      setReplyError('Por favor escribe una respuesta');
      return;
    }

    if (replyContent.length < 10) {
      setReplyError(`La respuesta debe tener al menos 10 caracteres (${replyContent.length}/10)`);
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const token = localStorage.getItem('token');

      const response = await fetch(`${apiUrl}/forum/posts/${postId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: replyContent })
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ Respuesta enviada exitosamente');
        setReplyContent('');
        setReplyingTo(null);
        setReplyError('');
        fetchPosts();
      } else {
        setReplyError(data.message);
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
      setReplyError('Error al enviar la respuesta');
    }
  };

  const formatDate = (date: string) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - postDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Hace 1 día';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    
    return postDate.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const togglePost = (postId: string) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  const isTherapist = user?.role === 'therapist';
  const isFormValid = newQuestion.title.length > 0 && 
                      newQuestion.title.length <= 200 && 
                      newQuestion.content.length >= 20;

  return (
    <div className="forum-page">
      {/* Hero Section */}
      <div className="forum-hero">
        <h1>Foro de Consultas</h1>
        <p>Haz preguntas anónimas y recibe respuestas de terapeutas profesionales</p>
        <button 
          className="new-question-btn"
          onClick={() => setShowNewPostModal(true)}
        >
          <PencilSquareIcon className="btn-icon" />
          Hacer una Pregunta
        </button>
      </div>

      {/* Modal para nueva pregunta */}
      {showNewPostModal && (
        <div className="modal-backdrop" onClick={() => setShowNewPostModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowNewPostModal(false)}>
              <XMarkIcon className="close-icon" />
            </button>
            
            <h2>Nueva Pregunta</h2>
            <form onSubmit={handleSubmitQuestion} className="question-form">
              <div className="form-group">
                <label>Título de tu pregunta *</label>
                <input
                  type="text"
                  value={newQuestion.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="¿Cuál es tu pregunta?"
                  className={errors.title ? 'input-error' : ''}
                  required
                />
                <div className="char-counter">
                  {newQuestion.title.length}/200 caracteres
                </div>
                {errors.title && (
                  <span className="error-message">
                    <ExclamationTriangleIcon className="error-icon" />
                    {errors.title}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>Descripción detallada *</label>
                <textarea
                  value={newQuestion.content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="Describe tu pregunta con más detalle... (mínimo 20 caracteres)"
                  rows={6}
                  className={errors.content ? 'input-error' : ''}
                  required
                />
                <div className={`char-counter ${newQuestion.content.length < 20 ? 'warning' : 'success'}`}>
                  {newQuestion.content.length < 20 ? (
                    <>
                      <ExclamationTriangleIcon className="counter-icon" />
                      {newQuestion.content.length}/20 caracteres mínimos
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="counter-icon" />
                      {newQuestion.content.length} caracteres
                    </>
                  )}
                </div>
                {errors.content && (
                  <span className="error-message">
                    <ExclamationTriangleIcon className="error-icon" />
                    {errors.content}
                  </span>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Tu nombre (opcional)</label>
                  <input
                    type="text"
                    value={newQuestion.authorName}
                    onChange={(e) => setNewQuestion({...newQuestion, authorName: e.target.value})}
                    placeholder="Anónimo"
                  />
                </div>

                <div className="form-group">
                  <label>Email (opcional)</label>
                  <input
                    type="email"
                    value={newQuestion.authorEmail}
                    onChange={(e) => setNewQuestion({...newQuestion, authorEmail: e.target.value})}
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Categoría (opcional)</label>
                <input
                  type="text"
                  value={newQuestion.category}
                  onChange={(e) => setNewQuestion({...newQuestion, category: e.target.value})}
                  placeholder="Ej: Acupuntura, Nutrición, etc."
                />
              </div>

              <div className="form-group">
                <label>Etiquetas (opcional)</label>
                <input
                  type="text"
                  value={newQuestion.tags}
                  onChange={(e) => setNewQuestion({...newQuestion, tags: e.target.value})}
                  placeholder="separa, con, comas"
                />
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={!isFormValid || isSubmitting}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Pregunta'}
              </button>

              <p className="disclaimer">
                Tu pregunta será revisada por un moderador antes de ser publicada
              </p>
            </form>
          </div>
        </div>
      )}

      {/* Lista de posts */}
      <div className="forum-feed">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Cargando preguntas...</p>
          </div>
        ) : posts.length > 0 ? (
          <div className="posts-list">
            {posts.map((post) => (
              <article key={post._id} className="forum-card">
                <div className="forum-card-header">
                  <div className="post-avatar">
                    <QuestionMarkCircleIcon className="avatar-icon" />
                  </div>
                  <div className="post-info">
                    <span className="post-author">{post.authorName}</span>
                    <span className="post-date">• {formatDate(post.createdAt)}</span>
                  </div>
                  {post.category && (
                    <span className="category-badge">{post.category}</span>
                  )}
                </div>

                <h3 className="forum-card-title">{post.title}</h3>
                <p className="forum-card-content">{post.content}</p>

                {post.tags && post.tags.length > 0 && (
                  <div className="tags-container">
                    {post.tags.map((tag, idx) => (
                      <span key={idx} className="tag">{tag}</span>
                    ))}
                  </div>
                )}

                <div className="forum-card-footer">
                  <button 
                    className="replies-btn"
                    onClick={() => togglePost(post._id)}
                  >
                    <ChatBubbleLeftIcon className="btn-icon-small" />
                    {post.replies.length} Respuesta{post.replies.length !== 1 ? 's' : ''}
                  </button>

                  {isTherapist && (
                    <button
                      className="reply-btn"
                      onClick={() => {
                        setReplyingTo(post._id);
                        setReplyError('');
                      }}
                    >
                      <PencilSquareIcon className="btn-icon-small" />
                      Responder
                    </button>
                  )}
                </div>

                {expandedPost === post._id && (
                  <div className="replies-section">
                    <h4>Respuestas:</h4>
                    {post.replies.length > 0 ? (
                      <div className="replies-list">
                        {post.replies.map((reply) => (
                          <div key={reply._id} className="reply-card">
                            <div className="reply-header">
                              <div className="therapist-avatar">
                                <UserCircleIcon className="avatar-icon" />
                              </div>
                              <div className="reply-info">
                                <span className="therapist-name">{reply.therapistName}</span>
                                <span className="reply-date">• {formatDate(reply.createdAt)}</span>
                              </div>
                            </div>
                            <p className="reply-content">{reply.content}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-replies">Aún no hay respuestas para esta pregunta</p>
                    )}
                  </div>
                )}

                {isTherapist && replyingTo === post._id && (
                  <div className="reply-form-container">
                    <textarea
                      value={replyContent}
                      onChange={(e) => {
                        setReplyContent(e.target.value);
                        if (e.target.value.length > 0 && e.target.value.length < 10) {
                          setReplyError(`Mínimo 10 caracteres (${e.target.value.length}/10)`);
                        } else {
                          setReplyError('');
                        }
                      }}
                      placeholder="Escribe tu respuesta... (mínimo 10 caracteres)"
                      rows={4}
                      className={`reply-textarea ${replyError ? 'input-error' : ''}`}
                    />
                    <div className={`char-counter ${replyContent.length < 10 ? 'warning' : 'success'}`}>
                      {replyContent.length < 10 ? (
                        <>
                          <ExclamationTriangleIcon className="counter-icon" />
                          {replyContent.length}/10 caracteres mínimos
                        </>
                      ) : (
                        <>
                          <CheckCircleIcon className="counter-icon" />
                          {replyContent.length} caracteres
                        </>
                      )}
                    </div>
                    {replyError && (
                      <span className="error-message">
                        <ExclamationTriangleIcon className="error-icon" />
                        {replyError}
                      </span>
                    )}
                    <div className="reply-actions">
                      <button
                        className="cancel-reply-btn"
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyContent('');
                          setReplyError('');
                        }}
                      >
                        Cancelar
                      </button>
                      <button
                        className="send-reply-btn"
                        onClick={() => handleSubmitReply(post._id)}
                        disabled={replyContent.length < 10}
                      >
                        Enviar Respuesta
                      </button>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="no-posts">
            <div className="no-posts-icon">
              <ChatBubbleLeftIcon className="no-posts-icon-svg" />
            </div>
            <h3>No hay preguntas publicadas aún</h3>
            <p>Sé el primero en hacer una pregunta</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Forum;