const { Schema, model } = require("mongoose");

const ProductoSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  descripcion: String,
  precio: {
    type: Number,
    required: [true, "El precio es obligatorio"],
  },
  cantidad_disponible: {
    type: Number,
    required: [true, "La cantidad disponible es obligatoria"],
  },
  categoria: {
    type: Schema.Types.ObjectId,
    ref: "Categoria",
  },
  estado: {
    type: Boolean,
    default: true,
  },
});

module.exports = model("Producto", ProductoSchema);
