const { response } = require("express");
const Categoria = require("../models/categoria.model");

const getCategorias = async (req, res = response) => {
  try {
    const categorias = await Categoria.find();
    res.status(200).json({ categorias });
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener las categorías", error: error.message });
  }
};

const getCategoriaById = async (req, res) => {
  const { id } = req.params;
  try {
    const categoria = await Categoria.findById(id);
    if (!categoria) {
      return res.status(404).json({ msg: "Categoría no encontrada" });
    }
    res.status(200).json({ categoria });
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener la categoría", error: error.message });
  }
};

const crearCategoria = async (req, res) => {
  const { nombre } = req.body;
  try {
    const categoriaExistente = await Categoria.findOne({ nombre });
    if (categoriaExistente) {
      return res.status(400).json({ msg: "La categoría ya existe" });
    }
    const categoria = new Categoria({ nombre });
    await categoria.save();
    res.status(200).json({ msg: "Categoría creada exitosamente", categoria });
  } catch (error) {
    res.status(500).json({ msg: "Error al crear la categoría", error: error.message });
  }
};

const actualizarCategoria = async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  try {
    const categoria = await Categoria.findById(id);
    if (!categoria) {
      return res.status(404).json({ msg: "Categoría no encontrada" });
    }
    categoria.nombre = nombre;
    await categoria.save();
    res.status(200).json({ msg: "Categoría actualizada exitosamente", categoria });
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar la categoría", error: error.message });
  }
};

const eliminarCategoria = async (req, res) => {
  const { id } = req.params;
  try {
    const categoria = await Categoria.findById(id);
    if (!categoria) {
      return res.status(404).json({ msg: "Categoría no encontrada" });
    }
    await Categoria.findByIdAndDelete(id);
    res.status(200).json({ msg: "Categoría eliminada exitosamente", categoria });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar la categoría", error: error.message });
  }
};

module.exports = {
  getCategorias,
  getCategoriaById,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria
};
