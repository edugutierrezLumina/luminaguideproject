import React, { useState, useEffect } from 'react';
import './Blog.css';

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  images?: string[];
  videos?: string[];
  author?: {
    email: string;
  };
  isPublished: boolean;
  createdAt: Date;
}

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFAQ, setShowFAQ] = useState(false);
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      id: 1,
      question: '¿Qué es la medicina alternativa?',
      answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    },
    {
      id: 2,
      question: '¿Cómo elijo al terapeuta adecuado?',
      answer: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },
    {
      id: 3,
      question: '¿Las terapias alternativas son seguras?',
      answer: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'
    },
    {
      id: 4,
      question: '¿Cuánto tiempo dura un tratamiento típico?',
      answer: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.'
    },
    {
      id: 5,
      question: '¿Puedo combinar medicina convencional con alternativa?',
      answer: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa.'
    }
  ];

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await fetch(`${apiUrl}/blog/published`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Blog posts loaded:', data.blogPosts?.length || 0);
        setPosts(data.blogPosts || []);
      } else {
        console.error('❌ Error loading posts:', response.status);
      }
    } catch (error) {
      console.error('❌ Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFAQ = (index: number) => {
    setOpenFAQIndex(openFAQIndex === index ? null : index);
  };

  const formatDate = (date: Date) => {
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

  const getMediaUrl = (path: string): string => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    
    if (path.startsWith('http')) {
      return path;
    }
    
    if (path.startsWith('/')) {
      return `${apiUrl}${path}`;
    }
    
    return `${apiUrl}/${path}`;
  };

  const getVideoType = (videoPath: string): string => {
    const extension = videoPath.split('.').pop()?.toLowerCase() || '';
    
    const typeMap: { [key: string]: string } = {
      'mp4': 'video/mp4',
      'webm': 'video/webm',
      'ogg': 'video/ogg',
      'mov': 'video/quicktime',
      'avi': 'video/x-msvideo',
      'm4v': 'video/mp4'
    };
    
    return typeMap[extension] || 'video/mp4';
  };

  return (
    <div className="blog-page-reddit">
      {/* Hero Section */}
      <div className="blog-hero">
        <h1>Blog de Bienestar</h1>
        <p>Descubre artículos sobre salud holística y medicina alternativa</p>
        
        <button 
          className="faq-toggle-btn"
          onClick={() => setShowFAQ(!showFAQ)}
        >
          {showFAQ ? '✕ Cerrar FAQ' : '❓ Ver Preguntas Frecuentes'}
        </button>
      </div>

      {/* FAQ Section */}
      {showFAQ && (
        <div className="faq-section">
          <h2>Preguntas Frecuentes</h2>
          <div className="faq-container">
            {faqItems.map((item, index) => (
              <div 
                key={item.id} 
                className={`faq-item ${openFAQIndex === index ? 'open' : ''}`}
              >
                <button 
                  className="faq-question"
                  onClick={() => toggleFAQ(index)}
                >
                  <span>{item.question}</span>
                  <span className="faq-icon">
                    {openFAQIndex === index ? '−' : '+'}
                  </span>
                </button>
                {openFAQIndex === index && (
                  <div className="faq-answer">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Blog Feed - Estilo Reddit */}
      <div className="blog-feed">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Cargando artículos...</p>
          </div>
        ) : posts.length > 0 ? (
          <div className="posts-feed">
            {posts.map((post) => (
              <article key={post._id} className="reddit-card">
                {/* Header del post */}
                <div className="card-header">
                  <div className="post-avatar">
                    <span>👤</span>
                  </div>
                  <div className="post-info">
                    <span className="post-author">
                      {post.author?.email || 'Admin'}
                    </span>
                    <span className="post-date">
                      • {formatDate(post.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Título del post */}
                <h2 className="card-title">{post.title}</h2>

                {/* Contenido del post */}
                <div className="card-body">
                  <p className="post-text">{post.content}</p>

                  {/* Imágenes */}
                  {post.images && post.images.length > 0 && (
                    <div className="media-container">
                      {post.images.length === 1 ? (
                        <div className="single-image">
                          <img 
                            src={getMediaUrl(post.images[0])} 
                            alt="Post content"
                            onError={(e) => {
                              console.error('Error loading image');
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      ) : (
                        <div className="image-grid">
                          {post.images.map((img, idx) => (
                            <div key={idx} className="grid-image">
                              <img 
                                src={getMediaUrl(img)} 
                                alt={`Post content ${idx + 1}`}
                                onError={(e) => {
                                  console.error('Error loading image');
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Videos con reproductor nativo */}
                  {post.videos && post.videos.length > 0 && (
                    <div className="video-container">
                      {post.videos.map((video, idx) => (
                        <div key={idx} className="video-player">
                          <video 
                            controls
                            preload="metadata"
                            onError={() => {
                              console.error('Error loading video:', video);
                            }}
                          >
                            <source 
                              src={getMediaUrl(video)} 
                              type={getVideoType(video)}
                            />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                
              </article>
            ))}
          </div>
        ) : (
          <div className="no-posts">
            <div className="no-posts-icon">📝</div>
            <h3>No hay artículos publicados</h3>
            <p>Vuelve pronto para ver nuevo contenido</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;