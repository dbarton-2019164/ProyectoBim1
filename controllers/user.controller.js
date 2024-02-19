const { response } = require("express");
const bcrypt = require("bcrypt");
const Usuario = require("../models/usuario.model");

const agregarUsuario = async (req, res) => {
  const { nombre, correo, password, role } = req.body;
  try {
    // Verificar si el correo ya está registrado
    const usuarioExistente = await Usuario.findOne({ correo });
    if (usuarioExistente) {
      return res.status(400).json({ msg: "El correo ya está registrado" });
    }
    // Hash de la contraseña
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(password, salt);
    // Crear nuevo usuario
    const usuario = new Usuario({ nombre, correo, password: hashedPassword, role });
    await usuario.save();
    res.status(200).json({ msg: "Usuario creado exitosamente", usuario });
  } catch (error) {
    res.status(500).json({ msg: "Error al agregar el usuario", error: error.message });
  }
};

const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.status(200).json({ usuarios });
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener los usuarios", error: error.message });
  }
};

const obtenerUsuarioPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }
    res.status(200).json({ usuario });
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener el usuario", error: error.message });
  }
};

const editarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, role } = req.body;
  try {
    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }
    usuario.nombre = nombre;
    usuario.correo = correo;
    usuario.role = role;
    await usuario.save();
    res.status(200).json({ msg: "Usuario actualizado exitosamente", usuario });
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar el usuario", error: error.message });
  }
};

const eliminarUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }
    await Usuario.findByIdAndDelete(id);
    res.status(200).json({ msg: "Usuario eliminado exitosamente", usuario });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar el usuario", error: error.message });
  }
};

module.exports = {
  agregarUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  editarUsuario,
  eliminarUsuario
};
