import React, { useState, useEffect } from 'react';
import { 
  ClockIcon, 
  CheckCircleIcon, 
  XMarkIcon, 
  TrashIcon,
  UserIcon,
  EnvelopeIcon,
  CalendarIcon,
  ChatBubbleLeftIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { forumService } from '../../services/forumService';
import type { ForumPost } from '../../services/forumService';
import './ForumModerator.css';

const ForumModerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');
  const [pendingPosts, setPendingPosts] = useState<ForumPost[]>([]);
  const [approvedPosts, setApprovedPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab === 'pending') {
      fetchPendingPosts();
    } else {
      fetchApprovedPosts();
    }
  }, [activeTab]);

  const fetchPendingPosts = async () => {
    setLoading(true);
    try {
      const posts = await forumService.getPending();
      console.log('✅ Pending posts loaded:', posts.length);
      setPendingPosts(posts);
    } catch (error) {
      console.error('Error fetching pending posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovedPosts = async () => {
    setLoading(true);
    try {
      const posts = await forumService.getApproved();
      console.log('✅ Approved posts loaded:', posts.length);
      setApprovedPosts(posts);
    } catch (error) {
      console.error('Error fetching approved posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModerate = async (postId: string, action: 'approve' | 'reject') => {
    try {
      await forumService.moderate(postId, action);
      alert(`Pregunta ${action === 'approve' ? 'aprobada' : 'rechazada'} exitosamente`);
      fetchPendingPosts();
    } catch (error) {
      console.error('Error moderating post:', error);
      alert('Error al moderar la pregunta');
    }
  };

  const handleDelete = async (postId: string, isApproved: boolean = false) => {
    if (!window.confirm('¿Estás seguro de eliminar esta pregunta?')) {
      return;
    }

    try {
      await forumService.delete(postId);
      alert('Pregunta eliminada');
      
      if (isApproved) {
        fetchApprovedPosts();
      } else {
        fetchPendingPosts();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error al eliminar la pregunta');
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderPost = (post: ForumPost, isPending: boolean = false) => (
    <div key={post._id} className="pending-post-card">
      <div className="post-header">
        <div className="post-meta">
          <span className="author">
            <UserIcon className="icon-inline" />
            {post.authorName}
          </span>
          {post.authorEmail && (
            <span className="email">
              <EnvelopeIcon className="icon-inline" />
              {post.authorEmail}
            </span>
          )}
          <span className="date">
            <CalendarIcon className="icon-inline" />
            {formatDate(post.createdAt)}
          </span>
        </div>
        {post.category && (
          <span className="category-tag">
            <TagIcon className="icon-inline-small" />
            {post.category}
          </span>
        )}
      </div>

      <h3 className="post-title">{post.title}</h3>
      <p className="post-content">{post.content}</p>

      {post.tags && post.tags.length > 0 && (
        <div className="tags">
          {post.tags.map((tag, idx) => (
            <span key={idx} className="tag">
              <TagIcon className="icon-inline-tiny" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {post.replies && post.replies.length > 0 && (
        <div className="replies-preview">
          <ChatBubbleLeftIcon className="icon-inline" />
          <p className="replies-count">
            {post.replies.length} Respuesta{post.replies.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      <div className="post-actions">
        {isPending ? (
          <>
            <button
              className="approve-btn"
              onClick={() => post._id && handleModerate(post._id, 'approve')}
            >
              <CheckCircleIcon className="btn-icon" />
              Aprobar
            </button>
            <button
              className="reject-btn"
              onClick={() => post._id && handleModerate(post._id, 'reject')}
            >
              <XMarkIcon className="btn-icon" />
              Rechazar
            </button>
          </>
        ) : null}
        
        <button
          className="delete-btn"
          onClick={() => post._id && handleDelete(post._id, !isPending)}
        >
          <TrashIcon className="btn-icon" />
          Eliminar
        </button>
      </div>
    </div>
  );

  return (
    <div className="forum-moderator">
      <div className="moderator-header">
        <h1>Moderación del Foro</h1>
        <p>Gestiona las preguntas del foro</p>
      </div>

      {/* Tabs */}
      <div className="moderator-tabs">
        <button
          className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          <ClockIcon className="tab-icon" />
          Pendientes ({pendingPosts.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'approved' ? 'active' : ''}`}
          onClick={() => setActiveTab('approved')}
        >
          <CheckCircleIcon className="tab-icon" />
          Aprobadas ({approvedPosts.length})
        </button>
      </div>

      {/* Contenido */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando preguntas...</p>
        </div>
      ) : (
        <>
          {activeTab === 'pending' ? (
            pendingPosts.length > 0 ? (
              <div className="pending-posts-list">
                {pendingPosts.map((post) => renderPost(post, true))}
              </div>
            ) : (
              <div className="no-pending">
                <CheckCircleIcon className="no-pending-icon" />
                <h3>No hay preguntas pendientes</h3>
                <p>Todas las preguntas han sido revisadas</p>
              </div>
            )
          ) : (
            approvedPosts.length > 0 ? (
              <div className="pending-posts-list">
                {approvedPosts.map((post) => renderPost(post, false))}
              </div>
            ) : (
              <div className="no-pending">
                <ChatBubbleLeftIcon className="no-pending-icon" />
                <h3>No hay preguntas aprobadas</h3>
                <p>Aprueba algunas preguntas para que aparezcan aquí</p>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
};

export default ForumModerator;