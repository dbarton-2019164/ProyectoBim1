const { Schema, model } = require("mongoose");

const FacturaSchema = Schema({
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
  },
  productos: [{
    type: Schema.Types.ObjectId,
    ref: "Producto",
  }],
  total: {
    type: Number,
    required: [true, "El total es obligatorio"],
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("Factura", FacturaSchema);
