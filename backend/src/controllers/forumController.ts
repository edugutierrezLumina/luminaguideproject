import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import ForumPost from '../models/ForumPost';
import User from '../models/User';
import Therapist from '../models/Therapist';
import mongoose from 'mongoose';

// Crear pregunta anónima (PÚBLICO)
export const createForumPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content, authorName, authorEmail, category, tags } = req.body;

    // ✅ VALIDACIONES ESPECÍFICAS
    if (!title || !content) {
      res.status(400).json({
        success: false,
        message: 'El título y contenido son requeridos'
      });
      return;
    }

    // ✅ VALIDAR LONGITUD DE CONTENIDO
    if (content.length < 20) {
      res.status(400).json({
        success: false,
        message: 'El contenido debe tener al menos 20 caracteres',
        field: 'content',
        minLength: 20,
        currentLength: content.length
      });
      return;
    }

    // ✅ VALIDAR LONGITUD DE TÍTULO
    if (title.length > 200) {
      res.status(400).json({
        success: false,
        message: 'El título no puede superar los 200 caracteres',
        field: 'title',
        maxLength: 200,
        currentLength: title.length
      });
      return;
    }

    const post = new ForumPost({
      title,
      content,
      authorName: authorName || 'Anonymous',
      authorEmail,
      category,
      tags: Array.isArray(tags) ? tags : [],
      status: 'pending'
    });

    await post.save();

    res.status(201).json({
      success: true,
      message: 'Pregunta enviada. Será revisada por un moderador.',
      post: {
        id: post._id,
        title: post.title,
        status: post.status
      }
    });
  } catch (error: any) {
    console.error('Error creando pregunta:', error);

    // ✅ CAPTURAR ERRORES DE VALIDACIÓN DE MONGOOSE
    if (error.name === 'ValidationError') {
      const firstError = Object.values(error.errors)[0] as any;
      res.status(400).json({
        success: false,
        message: firstError.message || 'Error de validación',
        field: firstError.path,
        errors: error.errors
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
};

// Obtener preguntas aprobadas (PÚBLICO)
export const getApprovedPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const posts = await ForumPost.find({
      status: 'approved',
      isActive: true
    })
      .sort({ createdAt: -1 })
      .select('-authorEmail');

    res.status(200).json({
      success: true,
      count: posts.length,
      posts
    });
  } catch (error) {
    console.error('Error obteniendo posts:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
};

// Obtener un post por ID (PÚBLICO)
export const getPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const post = await ForumPost.findOne({
      _id: id,
      status: 'approved',
      isActive: true
    }).select('-authorEmail');

    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Pregunta no encontrada'
      });
      return;
    }

    res.status(200).json({
      success: true,
      post
    });
  } catch (error) {
    console.error('Error obteniendo post:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
};

// Agregar respuesta (SOLO TERAPEUTAS)
export const addReply = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (req.user?.role !== 'therapist') {
      res.status(403).json({
        success: false,
        message: 'Solo los terapeutas pueden responder'
      });
      return;
    }

    if (!content || content.length < 10) {
      res.status(400).json({
        success: false,
        message: 'La respuesta debe tener al menos 10 caracteres'
      });
      return;
    }

    const post = await ForumPost.findOne({
      _id: id,
      status: 'approved',
      isActive: true
    });

    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Pregunta no encontrada o no aprobada'
      });
      return;
    }

    // ✅ Obtener info del terapeuta y su perfil
    const user = await User.findById(req.user.userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
      return;
    }

    // ✅ Buscar el perfil de terapeuta para obtener especialidad
    const therapist = await Therapist.findOne({ userId: req.user.userId });
    
    // ✅ Usar email como nombre (ya que no tienes firstName/lastName)
    const therapistName = therapist 
      ? `${user.email} (${therapist.specialty})` 
      : user.email;

    // ✅ Convertir string a ObjectId correctamente
    post.replies.push({
      therapistId: new mongoose.Types.ObjectId(req.user.userId), // ✅ CORRECTO
      therapistName,
      content,
      createdAt: new Date()
    });

    await post.save();

    res.status(201).json({
      success: true,
      message: 'Respuesta agregada exitosamente',
      post
    });
  } catch (error) {
    console.error('Error agregando respuesta:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
};

// Obtener posts pendientes (ADMIN)
export const getPendingPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const posts = await ForumPost.find({
      status: 'pending'
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      posts
    });
  } catch (error) {
    console.error('Error obteniendo posts pendientes:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
};

// Aprobar/Rechazar post (ADMIN)
export const moderatePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    if (!['approve', 'reject'].includes(action)) {
      res.status(400).json({
        success: false,
        message: 'Acción inválida. Usa "approve" o "reject"'
      });
      return;
    }

    const post = await ForumPost.findById(id);

    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Post no encontrado'
      });
      return;
    }

    post.status = action === 'approve' ? 'approved' : 'rejected';
    await post.save();

    res.status(200).json({
      success: true,
      message: `Post ${action === 'approve' ? 'aprobado' : 'rechazado'} exitosamente`,
      post
    });
  } catch (error) {
    console.error('Error moderando post:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
};

// Eliminar post (ADMIN)
export const deletePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const post = await ForumPost.findByIdAndDelete(id);

    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Post no encontrado'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Post eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando post:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
};