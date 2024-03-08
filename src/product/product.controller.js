import categoryModel from "../category/category.model.js";
import productModel from "./product.model.js";

export const registerProduct = async (req, res) => {
  const { producto, price, category, stock } = req.body;
  const usuarioAutenticado = req.usuario;
  if (usuarioAutenticado.role !== "ADMIN_ROLE") {
    return res.status(400).json({
      msg: "you cannot access this function",
    });
  }
  const jijijija = await categoryModel.findOne({ name: category });
  const categoryId = jijijija._id;
  try {
    const product = new productModel({
      name: producto,
      price,
      category: categoryId,
      stock,
    });
    await product.save();
    res.status(200).json({
      msg: "successfully published",
      product,
    });
  } catch (error) {
    res.status(500).json({ msg: "error publishing", error: error.message });
  }
};
