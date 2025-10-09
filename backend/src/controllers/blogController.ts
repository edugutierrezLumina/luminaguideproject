import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import BlogPost from '../models/BlogPost';

// Crear post de blog
export const createBlogPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, content, isPublished } = req.body;
    const files = req.files as Express.Multer.File[];

    if (!title || !content) {
      res.status(400).json({ message: 'Título y contenido son requeridos' });
      return;
    }

    // Separar imágenes y videos
    const images: string[] = [];
    const videos: string[] = [];

    if (files && files.length > 0) {
      files.forEach(file => {
        if (file.mimetype.startsWith('image/')) {
          images.push(`/uploads/${file.filename}`);
        } else if (file.mimetype.startsWith('video/')) {
          videos.push(`/uploads/${file.filename}`);
        }
      });
    }

    const blogPost = new BlogPost({
      title,
      content,
      author: req.user?.userId,
      images,
      videos,
      isPublished: isPublished || false
    });

    await blogPost.save();

    res.status(201).json({
      message: 'Post creado exitosamente',
      blogPost
    });
  } catch (error) {
    console.error('Error al crear post:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Obtener todos los posts
export const getAllBlogPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const blogPosts = await BlogPost.find()
      .populate('author', 'email')
      .sort({ createdAt: -1 });

    res.status(200).json({ blogPosts });
  } catch (error) {
    console.error('Error al obtener posts:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Obtener posts publicados (para frontend público)
export const getPublishedBlogPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const blogPosts = await BlogPost.find({ isPublished: true })
      .populate('author', 'email')
      .sort({ createdAt: -1 });

    res.status(200).json({ blogPosts });
  } catch (error) {
    console.error('Error al obtener posts publicados:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Actualizar post
export const updateBlogPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, content, isPublished } = req.body;

    const blogPost = await BlogPost.findById(id);
    if (!blogPost) {
      res.status(404).json({ message: 'Post no encontrado' });
      return;
    }

    if (title) blogPost.title = title;
    if (content) blogPost.content = content;
    if (isPublished !== undefined) blogPost.isPublished = isPublished;

    await blogPost.save();

    res.status(200).json({
      message: 'Post actualizado exitosamente',
      blogPost
    });
  } catch (error) {
    console.error('Error al actualizar post:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Eliminar post
export const deleteBlogPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const blogPost = await BlogPost.findByIdAndDelete(id);
    if (!blogPost) {
      res.status(404).json({ message: 'Post no encontrado' });
      return;
    }

    res.status(200).json({ message: 'Post eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar post:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};