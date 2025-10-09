import React, { useState, useEffect } from 'react';
import { forumService } from '../../services/forumService';
import type { ForumPost } from '../../services/forumService';
import './ForumModerator.css';

const ForumModerator: React.FC = () => {
  const [pendingPosts, setPendingPosts] = useState<ForumPost[]>([]);
  const [approvedPosts, setApprovedPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');

  useEffect(() => {
    loadPosts();
  }, [activeTab]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      if (activeTab === 'pending') {
        const data = await forumService.getPending();
        setPendingPosts(data);
      } else {
        const data = await forumService.getApproved();
        setApprovedPosts(data);
      }
    } catch (error) {
      console.error('Error loading forum posts:', error);
      alert('Error al cargar posts del foro');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await forumService.approve(id);
      alert('Post aprobado exitosamente');
      loadPosts();
    } catch (error) {
      console.error('Error approving post:', error);
      alert('Error al aprobar post');
    }
  };

  const handleReject = async (id: string) => {
    if (!window.confirm('¿Estás seguro de rechazar este post?')) return;

    try {
      await forumService.delete(id);
      alert('Post rechazado y eliminado');
      loadPosts();
    } catch (error) {
      console.error('Error rejecting post:', error);
      alert('Error al rechazar post');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar este post aprobado?')) return;

    try {
      await forumService.delete(id);
      alert('Post eliminado exitosamente');
      loadPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error al eliminar post');
    }
  };

  const posts = activeTab === 'pending' ? pendingPosts : approvedPosts;

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="forum-moderator">
      <div className="manager-header">
        <h1>Moderación de Foro</h1>
        <div className="tabs">
          <button
            className={activeTab === 'pending' ? 'active' : ''}
            onClick={() => setActiveTab('pending')}
          >
            Pendientes ({pendingPosts.length})
          </button>
          <button
            className={activeTab === 'approved' ? 'active' : ''}
            onClick={() => setActiveTab('approved')}
          >
            Aprobados ({approvedPosts.length})
          </button>
        </div>
      </div>

      <div className="forum-posts">
        {posts.length === 0 ? (
          <p className="no-data">
            No hay posts {activeTab === 'pending' ? 'pendientes' : 'aprobados'}
          </p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="forum-post-card">
              <div className="post-header">
                <div>
                  <h4>{post.authorName}</h4>
                  <small>
                    {new Date(post.createdAt!).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </small>
                </div>
                <span className={`status ${post.isApproved ? 'approved' : 'pending'}`}>
                  {post.isApproved ? 'Aprobado' : 'Pendiente'}
                </span>
              </div>

              <div className="post-content">
                <p>{post.content}</p>
              </div>

              <div className="post-actions">
                {activeTab === 'pending' ? (
                  <>
                    <button onClick={() => handleApprove(post._id!)} className="btn-approve">
                      ✓ Aprobar
                    </button>
                    <button onClick={() => handleReject(post._id!)} className="btn-reject">
                      ✕ Rechazar
                    </button>
                  </>
                ) : (
                  <button onClick={() => handleDelete(post._id!)} className="btn-delete">
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ForumModerator;