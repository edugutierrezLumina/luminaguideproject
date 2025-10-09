"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteForumPost = exports.approveForumPost = exports.getApprovedForumPosts = exports.getPendingForumPosts = exports.createForumPost = void 0;
const ForumPost_1 = __importDefault(require("../models/ForumPost"));
const createForumPost = async (req, res) => {
    try {
        const { content, authorName } = req.body;
        if (!content || !authorName) {
            res.status(400).json({ message: 'Contenido y nombre del autor son requeridos' });
            return;
        }
        const forumPost = new ForumPost_1.default({
            content,
            authorName,
            isApproved: false
        });
        await forumPost.save();
        res.status(201).json({
            message: 'Post enviado para aprobación',
            forumPost
        });
    }
    catch (error) {
        console.error('Error al crear post del foro:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};
exports.createForumPost = createForumPost;
const getPendingForumPosts = async (req, res) => {
    try {
        const forumPosts = await ForumPost_1.default.find({ isApproved: false })
            .sort({ createdAt: -1 });
        res.status(200).json({ forumPosts });
    }
    catch (error) {
        console.error('Error al obtener posts pendientes:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};
exports.getPendingForumPosts = getPendingForumPosts;
const getApprovedForumPosts = async (req, res) => {
    try {
        const forumPosts = await ForumPost_1.default.find({ isApproved: true })
            .sort({ createdAt: -1 });
        res.status(200).json({ forumPosts });
    }
    catch (error) {
        console.error('Error al obtener posts aprobados:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};
exports.getApprovedForumPosts = getApprovedForumPosts;
const approveForumPost = async (req, res) => {
    try {
        const { id } = req.params;
        const forumPost = await ForumPost_1.default.findById(id);
        if (!forumPost) {
            res.status(404).json({ message: 'Post no encontrado' });
            return;
        }
        forumPost.isApproved = true;
        forumPost.approvedBy = req.user?.userId;
        await forumPost.save();
        res.status(200).json({
            message: 'Post aprobado exitosamente',
            forumPost
        });
    }
    catch (error) {
        console.error('Error al aprobar post:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};
exports.approveForumPost = approveForumPost;
const deleteForumPost = async (req, res) => {
    try {
        const { id } = req.params;
        const forumPost = await ForumPost_1.default.findByIdAndDelete(id);
        if (!forumPost) {
            res.status(404).json({ message: 'Post no encontrado' });
            return;
        }
        res.status(200).json({ message: 'Post eliminado exitosamente' });
    }
    catch (error) {
        console.error('Error al eliminar post:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};
exports.deleteForumPost = deleteForumPost;
//# sourceMappingURL=forumController.js.map