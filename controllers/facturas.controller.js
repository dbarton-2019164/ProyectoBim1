const { response } = require("express");
const Factura = require("../models/factura.model");

const obtenerFacturasPorUsuario = async (req, res) => {
  const usuarioId = req.usuario.id;
  try {
    const facturas = await Factura.find({ usuario: usuarioId }).populate("productos");
    res.status(200).json({ facturas });
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener las facturas del usuario", error: error.message });
  }
};

const obtenerFacturaPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const factura = await Factura.findById(id).populate("productos");
    if (!factura) {
      return res.status(404).json({ msg: "Factura no encontrada" });
    }
    res.status(200).json({ factura });
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener la factura", error: error.message });
  }
};

const editarFactura = async (req, res) => {
  const { id } = req.params;
  const { total } = req.body;
  try {
    const factura = await Factura.findById(id);
    if (!factura) {
      return res.status(404).json({ msg: "Factura no encontrada" });
    }
    factura.total = total;
    await factura.save();
    res.status(200).json({ msg: "Factura actualizada exitosamente", factura });
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar la factura", error: error.message });
  }
};

const eliminarFactura = async (req, res) => {
  const { id } = req.params;
  try {
    const factura = await Factura.findById(id);
    if (!factura) {
      return res.status(404).json({ msg: "Factura no encontrada" });
    }
    await Factura.findByIdAndDelete(id);
    res.status(200).json({ msg: "Factura eliminada exitosamente", factura });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar la factura", error: error.message });
  }
};

module.exports = {
  obtenerFacturasPorUsuario,
  obtenerFacturaPorId,
  editarFactura,
  eliminarFactura
};
