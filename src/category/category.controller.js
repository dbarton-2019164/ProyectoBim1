import { response, request } from "express";
import categoryModel from "./category.model.js";

export const registerCategory = async (req, res) => {
    const { name } = req.body;
    const usuarioAutenticado = req.usuario;
    if (usuarioAutenticado.role !== "ADMIN_ROLE") {
        return res.status(400).json({
            msg: "you cannot access this function"
        });
    }
    try {
        const category = new categoryModel({ name });
        await category.save();
        res.status(200).json({
            category,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

};

export const deleteCategory = async (req, res) => {
    const { id } = req.params;
    const usuarioAutenticado = req.usuario;
    if (usuarioAutenticado.role !== "ADMIN_ROLE") {
        return res.status(400).json({
            msg: "you cannot access this function"
        });
    }
    await categoryModel.findByIdAndUpdate(id, { condition: false });
    const result = await categoryModel.findById(id);
    res.status(200).json({
        msg: "Category deleted successfully",
        result
    });
}

export const updateCategory = async (req, res) => {
    const { id } = req.params;
    const usuarioAutenticado = req.usuario;
    if (usuarioAutenticado.role !== "ADMIN_ROLE") {
        return res.status(400).json({
            msg: "You cannot access this function"
        });
    }
    const { name } = req.body;
    await categoryModel.findByIdAndUpdate(id, { name: name });
    const result =  await categoryModel.findById(id);
    res.status(200).json({
        msg: "Category updated successfully",
        result
    });
}

export const showCategories = async (req, res) => {
    const usuarioAutenticado = req.usuario;
    if (usuarioAutenticado.role !== "ADMIN_ROLE") {
        return res.status(400).json({
            msg: "You cannot access this function"
        });
    }

    const categories = await categoryModel.find({condition : true});
    res.status(200).json({
        categories
    });
}