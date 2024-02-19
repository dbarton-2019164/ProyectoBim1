const { response } = require("express");
const Producto = require("../models/producto.model");

const agregarProducto = async (req, res) => {
  const { nombre, descripcion, precio, cantidad_disponible, categoria } = req.body;
  try {
    const producto = new Producto({ nombre, descripcion, precio, cantidad_disponible, categoria });
    await producto.save();
    res.status(200).json({ msg: "Producto agregado exitosamente", producto });
  } catch (error) {
    res.status(500).json({ msg: "Error al agregar el producto", error: error.message });
  }
};

const obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.find().populate("categoria", "nombre");
    res.status(200).json({ productos });
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener los productos", error: error.message });
  }
};

const obtenerProductoPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await Producto.findById(id).populate("categoria", "nombre");
    if (!producto) {
      return res.status(404).json({ msg: "Producto no encontrado" });
    }
    res.status(200).json({ producto });
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener el producto", error: error.message });
  }
};

const editarProducto = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, cantidad_disponible, categoria } = req.body;
  try {
    const producto = await Producto.findById(id);
    if (!producto) {
      return res.status(404).json({ msg: "Producto no encontrado" });
    }
    producto.nombre = nombre;
    producto.descripcion = descripcion;
    producto.precio = precio;
    producto.cantidad_disponible = cantidad_disponible;
    producto.categoria = categoria;
    await producto.save();
    res.status(200).json({ msg: "Producto actualizado exitosamente", producto });
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar el producto", error: error.message });
  }
};

const eliminarProducto = async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await Producto.findById(id);
    if (!producto) {
      return res.status(404).json({ msg: "Producto no encontrado" });
    }
    await Producto.findByIdAndDelete(id);
    res.status(200).json({ msg: "Producto eliminado exitosamente", producto });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar el producto", error: error.message });
  }
};

module.exports = {
  agregarProducto,
  obtenerProductos,
  obtenerProductoPorId,
  editarProducto,
  eliminarProducto
};
