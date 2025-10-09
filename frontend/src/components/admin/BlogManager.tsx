import React, { useState, useEffect } from 'react';
import { blogService } from '../../services/blogService';
import type { BlogPost } from '../../services/blogService';
import './BlogManager.css';

const BlogManager: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isPublished: false,
  });
  const [files, setFiles] = useState<FileList | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await blogService.getAll();
      setPosts(data);
    } catch (error) {
      console.error('Error loading posts:', error);
      alert('Error al cargar posts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Actualizar post existente
        await blogService.update(editingId, formData);
        alert('Post actualizado exitosamente');
      } else {
        // Crear nuevo post con archivos
        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('content', formData.content);
        formDataToSend.append('isPublished', String(formData.isPublished));

        if (files) {
          Array.from(files).forEach((file) => {
            formDataToSend.append('files', file);
          });
        }

        await blogService.create(formDataToSend);
        alert('Post creado exitosamente');
      }
      resetForm();
      loadPosts();
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Error al guardar post');
    }
  };

  const handleEdit = (post: BlogPost) => {
    setFormData({
      title: post.title,
      content: post.content,
      isPublished: post.isPublished,
    });
    setEditingId(post._id!);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar este post?')) return;

    try {
      await blogService.delete(id);
      alert('Post eliminado exitosamente');
      loadPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error al eliminar post');
    }
  };

  const togglePublish = async (post: BlogPost) => {
    try {
      await blogService.update(post._id!, { isPublished: !post.isPublished });
      alert(`Post ${!post.isPublished ? 'publicado' : 'despublicado'} exitosamente`);
      loadPosts();
    } catch (error) {
      console.error('Error toggling publish:', error);
      alert('Error al cambiar estado');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      isPublished: false,
    });
    setFiles(null);
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="blog-manager">
      <div className="manager-header">
        <h1>Gestión de Blog</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : '+ Nuevo Post'}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h2>{editingId ? 'Editar Post' : 'Nuevo Post'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Título *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Título del post"
                required
              />
            </div>

            <div className="form-group">
              <label>Contenido *</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={8}
                placeholder="Escribe el contenido del post..."
                required
              />
            </div>

            {!editingId && (
              <div className="form-group">
                <label>Imágenes y Videos</label>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={(e) => setFiles(e.target.files)}
                />
                <small>Máximo 20MB por archivo. Formatos: JPG, PNG, GIF, MP4, MOV</small>
              </div>
            )}

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                />
                Publicar inmediatamente
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingId ? 'Actualizar' : 'Crear'} Post
              </button>
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="posts-list">
        {posts.length === 0 ? (
          <p className="no-data">No hay posts creados</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="post-card">
              <div className="post-header">
                <div>
                  <h3>{post.title}</h3>
                  <small>
                    {new Date(post.createdAt!).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </small>
                </div>
                <span className={`status ${post.isPublished ? 'published' : 'draft'}`}>
                  {post.isPublished ? 'Publicado' : 'Borrador'}
                </span>
              </div>

              <div className="post-body">
                <p>{post.content.substring(0, 200)}...</p>
                {post.images && post.images.length > 0 && (
                  <div className="media-info">📷 {post.images.length} imagen(es)</div>
                )}
                {post.videos && post.videos.length > 0 && (
                  <div className="media-info">🎥 {post.videos.length} video(s)</div>
                )}
              </div>

              <div className="post-actions">
                <button onClick={() => handleEdit(post)} className="btn-edit">
                  Editar
                </button>
                <button onClick={() => togglePublish(post)} className="btn-toggle">
                  {post.isPublished ? 'Despublicar' : 'Publicar'}
                </button>
                <button onClick={() => handleDelete(post._id!)} className="btn-delete">
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

export default BlogManager;