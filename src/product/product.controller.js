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
      msg: "product successfully added",
      product,
    });
  } catch (error) {
    res.status(500).json({
      msg: "error  adding",
      error: error.message
    });
  }
};

export const editProduct = async (req, res) => {
  const { producto, price, category, stock } = req.body;
  const { id } = req.params;
  var idCategory
  const usuarioAutenticado = req.usuario;
  var c;
  if (usuarioAutenticado.role !== "ADMIN_ROLE") {
    return res.status(400).json({
      msg: "you cannot access this function",
    });
  }
  const old = await productModel.findById(id);
  if (!producto) {
    producto = old.name;
  } else {
    const p = await productModel.findOne({ name: producto });
    if (p) {
      if (p.id !== id) {
        return res.status(400).json({ msg: "The product already exists" });
      }
    }
  }
  if (!price) {
    price = old.price;
  }
  if (!category) {
    category = old.category;
    c = await categoryModel.findOne({ name: category });
    idCategory = c.id;
  } else {
    c = await categoryModel.findOne({ name: category });
    if (!c) {
      return res.status(400).json({ msg: "The category does not exist" });
    }
    idCategory = c.id;
  }
  if (!stock) {
    stock = old.stock;
  }
  await productModel.findByIdAndUpdate(id, { name: producto, price: price, category: idCategory, stock: stock });
  const result = await productModel.findById(id);
  res.status(200).json({
    msg: "product successfully updated",
    result,
  });

}


export const deleteProduct = async (req, res) => {

  const { id } = req.params;
  const usuarioAutenticado = req.usuario;

  if (usuarioAutenticado.role !== "ADMIN_ROLE") {
    return res.status(400).json({
      msg: "you cannot access this function",
    });
  }

  await productModel.findByIdAndUpdate(id, { condition: false });
  const result = await productModel.findById(id);
  res.status(200).json({
    msg: "product successfully deleted",
    result,
  });
}

export const showProduct = async (req, res) => {
  const { name } = req.body;
  if (name) {
    const search = await productModel.findOne({ name: name }).lean();
    if (search) {
      if (search.stock === 0) {
        search.status = 'not available';
      }
      return res.status(200).json(search);
    }
    
    res.status(404).json({ message: 'Product not found' });
  }
}

export const showProducts = async (req, res) => {
  const { order } = req.params;

  let pipeline = [];

  if (!order) {
    const allProducts = await productModel.find({ condition: true });
    return res.status(200).json({ products: allProducts });
  }

  if (order === 'category') {
    pipeline.push(
      { $match: { condition: true } },
      { $group: { _id: '$category', products: { $push: '$$ROOT' } } },
      { $sort: { totalSales: -1 } }
    );
  } else if (order === 'sales') {
    pipeline.push(
      { $match: { condition: true } },
      { $sort: { quantitySales: -1 } }
    );
  }

  if (pipeline.length === 0) {
    return res.status(400).json({ message: 'Invalid order parameter' });
  }

  let products = await productModel.aggregate(pipeline);
  products = await Promise.all(products.map(async (productGroup) => {
    const category = await categoryModel.findById(productGroup._id);
    const categoryName = category ? category.name : 'Unknown';
    if (productGroup.products) {
      productGroup.products = productGroup.products.map(product => {
        product.category = categoryName;
        if (product.stock === 0) {
          product.status = 'not available';
        }
        return product;
      });
    }
    return productGroup;
  }));
  res.status(200).json({ products });
};
