import ForumPost from '../models/ForumPost';
import User from '../models/User';
import Therapist from '../models/Therapist';
import mongoose from 'mongoose';
export const createForumPost = async (req, res) => {
    try {
        const { title, content, authorName, authorEmail, category, tags } = req.body;
        if (!title || !content) {
            res.status(400).json({
                success: false,
                message: 'El título y contenido son requeridos'
            });
            return;
        }
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
    }
    catch (error) {
        console.error('Error creando pregunta:', error);
        if (error.name === 'ValidationError') {
            const firstError = Object.values(error.errors)[0];
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
export const getApprovedPosts = async (req, res) => {
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
    }
    catch (error) {
        console.error('Error obteniendo posts:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor'
        });
    }
};
export const getPostById = async (req, res) => {
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
    }
    catch (error) {
        console.error('Error obteniendo post:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor'
        });
    }
};
export const addReply = async (req, res) => {
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
        const user = await User.findById(req.user.userId);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
            return;
        }
        const therapist = await Therapist.findOne({ userId: req.user.userId });
        const therapistName = therapist
            ? `${user.email} (${therapist.specialty})`
            : user.email;
        post.replies.push({
            therapistId: new mongoose.Types.ObjectId(req.user.userId),
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
    }
    catch (error) {
        console.error('Error agregando respuesta:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor'
        });
    }
};
export const getPendingPosts = async (req, res) => {
    try {
        const posts = await ForumPost.find({
            status: 'pending'
        }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: posts.length,
            posts
        });
    }
    catch (error) {
        console.error('Error obteniendo posts pendientes:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor'
        });
    }
};
export const moderatePost = async (req, res) => {
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
    }
    catch (error) {
        console.error('Error moderando post:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor'
        });
    }
};
export const deletePost = async (req, res) => {
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
    }
    catch (error) {
        console.error('Error eliminando post:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor'
        });
    }
};
//# sourceMappingURL=forumController.js.map