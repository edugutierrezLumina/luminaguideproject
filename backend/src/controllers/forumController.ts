import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import ForumPost from '../models/ForumPost';

// Crear post en foro (anónimo)
export const createForumPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { content, authorName } = req.body;

    if (!content || !authorName) {
      res.status(400).json({ message: 'Contenido y nombre del autor son requeridos' });
      return;
    }

    const forumPost = new ForumPost({
      content,
      authorName,
      isApproved: false
    });

    await forumPost.save();

    res.status(201).json({
      message: 'Post enviado para aprobación',
      forumPost
    });
  } catch (error) {
    console.error('Error al crear post del foro:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Obtener posts pendientes de aprobación
export const getPendingForumPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const forumPosts = await ForumPost.find({ isApproved: false })
      .sort({ createdAt: -1 });

    res.status(200).json({ forumPosts });
  } catch (error) {
    console.error('Error al obtener posts pendientes:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Obtener posts aprobados
export const getApprovedForumPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const forumPosts = await ForumPost.find({ isApproved: true })
      .sort({ createdAt: -1 });

    res.status(200).json({ forumPosts });
  } catch (error) {
    console.error('Error al obtener posts aprobados:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Aprobar post del foro
export const approveForumPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const forumPost = await ForumPost.findById(id);
    if (!forumPost) {
      res.status(404).json({ message: 'Post no encontrado' });
      return;
    }

    forumPost.isApproved = true;
    forumPost.approvedBy = req.user?.userId as any;
    await forumPost.save();

    res.status(200).json({
      message: 'Post aprobado exitosamente',
      forumPost
    });
  } catch (error) {
    console.error('Error al aprobar post:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Rechazar/eliminar post del foro
export const deleteForumPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const forumPost = await ForumPost.findByIdAndDelete(id);
    if (!forumPost) {
      res.status(404).json({ message: 'Post no encontrado' });
      return;
    }

    res.status(200).json({ message: 'Post eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar post:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};