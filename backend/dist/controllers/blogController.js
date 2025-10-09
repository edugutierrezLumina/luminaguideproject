"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlogPost = exports.updateBlogPost = exports.getPublishedBlogPosts = exports.getAllBlogPosts = exports.createBlogPost = void 0;
const BlogPost_1 = __importDefault(require("../models/BlogPost"));
const createBlogPost = async (req, res) => {
    try {
        const { title, content, isPublished } = req.body;
        const files = req.files;
        if (!title || !content) {
            res.status(400).json({ message: 'Título y contenido son requeridos' });
            return;
        }
        const images = [];
        const videos = [];
        if (files && files.length > 0) {
            files.forEach(file => {
                if (file.mimetype.startsWith('image/')) {
                    images.push(`/uploads/${file.filename}`);
                }
                else if (file.mimetype.startsWith('video/')) {
                    videos.push(`/uploads/${file.filename}`);
                }
            });
        }
        const blogPost = new BlogPost_1.default({
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
    }
    catch (error) {
        console.error('Error al crear post:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};
exports.createBlogPost = createBlogPost;
const getAllBlogPosts = async (req, res) => {
    try {
        const blogPosts = await BlogPost_1.default.find()
            .populate('author', 'email')
            .sort({ createdAt: -1 });
        res.status(200).json({ blogPosts });
    }
    catch (error) {
        console.error('Error al obtener posts:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};
exports.getAllBlogPosts = getAllBlogPosts;
const getPublishedBlogPosts = async (req, res) => {
    try {
        const blogPosts = await BlogPost_1.default.find({ isPublished: true })
            .populate('author', 'email')
            .sort({ createdAt: -1 });
        res.status(200).json({ blogPosts });
    }
    catch (error) {
        console.error('Error al obtener posts publicados:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};
exports.getPublishedBlogPosts = getPublishedBlogPosts;
const updateBlogPost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, isPublished } = req.body;
        const blogPost = await BlogPost_1.default.findById(id);
        if (!blogPost) {
            res.status(404).json({ message: 'Post no encontrado' });
            return;
        }
        if (title)
            blogPost.title = title;
        if (content)
            blogPost.content = content;
        if (isPublished !== undefined)
            blogPost.isPublished = isPublished;
        await blogPost.save();
        res.status(200).json({
            message: 'Post actualizado exitosamente',
            blogPost
        });
    }
    catch (error) {
        console.error('Error al actualizar post:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};
exports.updateBlogPost = updateBlogPost;
const deleteBlogPost = async (req, res) => {
    try {
        const { id } = req.params;
        const blogPost = await BlogPost_1.default.findByIdAndDelete(id);
        if (!blogPost) {
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
exports.deleteBlogPost = deleteBlogPost;
//# sourceMappingURL=blogController.js.map