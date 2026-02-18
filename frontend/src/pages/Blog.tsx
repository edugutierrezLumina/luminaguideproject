import React, { useState, useEffect } from 'react';
import './Blog.css';
import { useLanguage } from '../context/LanguageContext';

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

const Blog: React.FC = () => {
  const { t, language } = useLanguage();

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFAQ, setShowFAQ] = useState(false);
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null);

  const faqKeys = [1, 2, 3, 4, 5];

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
    const diffDays = Math.ceil(
      Math.abs(now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (language === 'en') {
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return '1 day ago';
      if (diffDays < 7) return `${diffDays} days ago`;
      return postDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Hace 1 día';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return postDate.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getMediaUrl = (path: string): string => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    if (path.startsWith('http')) return path;
    if (path.startsWith('/')) return `${apiUrl}${path}`;
    return `${apiUrl}/${path}`;
  };

  const getVideoType = (videoPath: string): string => {
    const ext = videoPath.split('.').pop()?.toLowerCase() || '';
    const typeMap: { [key: string]: string } = {
      mp4: 'video/mp4', webm: 'video/webm', ogg: 'video/ogg',
      mov: 'video/quicktime', avi: 'video/x-msvideo', m4v: 'video/mp4',
    };
    return typeMap[ext] || 'video/mp4';
  };

  return (
    <div className="blog-page-reddit">
      {/* Hero Section */}
      <div className="blog-hero">
        <h1>{t('blog.hero.title')}</h1>
        <p>{t('blog.hero.subtitle')}</p>

        <button
          className={`faq-toggle-btn ${showFAQ ? 'faq-toggle-btn--open' : ''}`}
          onClick={() => setShowFAQ(!showFAQ)}
        >
          {showFAQ ? (
            <>
              <span className="faq-close-circle">✕</span>
              {t('blog.faq.close')}
            </>
          ) : (
            t('blog.faq.open')
          )}
        </button>
      </div>

      {/* FAQ Section */}
      {showFAQ && (
        <div className="faq-section">
          <h2>{t('blog.faq.title')}</h2>
          <div className="faq-container">
            {faqKeys.map((n, index) => (
              <div
                key={n}
                className={`faq-item ${openFAQIndex === index ? 'open' : ''}`}
              >
                <button
                  className="faq-question"
                  onClick={() => toggleFAQ(index)}
                >
                  <span>{t(`blog.faq.q${n}`)}</span>
                  <span className="faq-icon">
                    {openFAQIndex === index ? '−' : '+'}
                  </span>
                </button>
                {openFAQIndex === index && (
                  <div className="faq-answer">
                    <p>{t(`blog.faq.a${n}`)}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Blog Feed */}
      <div className="blog-feed">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>{t('blog.loading')}</p>
          </div>
        ) : posts.length > 0 ? (
          <div className="posts-feed">
            {posts.map((post) => (
              <article key={post._id} className="reddit-card">
                <div className="card-header">
                  <div className="post-avatar"><span>👤</span></div>
                  <div className="post-info">
                    <span className="post-author">{post.author?.email || 'Admin'}</span>
                    <span className="post-date">• {formatDate(post.createdAt)}</span>
                  </div>
                </div>

                <h2 className="card-title">{post.title}</h2>

                <div className="card-body">
                  <p className="post-text">{post.content}</p>

                  {post.images && post.images.length > 0 && (
                    <div className="media-container">
                      {post.images.length === 1 ? (
                        <div className="single-image">
                          <img
                            src={getMediaUrl(post.images[0])}
                            alt="Post content"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        </div>
                      ) : (
                        <div className="image-grid">
                          {post.images.map((img, idx) => (
                            <div key={idx} className="grid-image">
                              <img
                                src={getMediaUrl(img)}
                                alt={`Post content ${idx + 1}`}
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {post.videos && post.videos.length > 0 && (
                    <div className="video-container">
                      {post.videos.map((video, idx) => (
                        <div key={idx} className="video-player">
                          <video controls preload="metadata">
                            <source src={getMediaUrl(video)} type={getVideoType(video)} />
                            {t('blog.video.unsupported')}
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
            <h3>{t('blog.empty.title')}</h3>
            <p>{t('blog.empty.subtitle')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;