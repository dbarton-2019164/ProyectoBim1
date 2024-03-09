import categoryModel from "../category/category.model.js";
import productModel from "../product/product.model.js";
import userModel from "../user/user.model.js";
export async function emailExists(correo = "") {
  const user = await userModel.findOne({ email: correo });
  if (user) {
    throw new Error(`The email ${user.email} already exists`);
  }
}

export async function userExists(usuario = "") {
  const userFB = await userModel.findOne({ user: usuario });
  if (userFB) {
    throw new Error(`The user ${userFB.user} already exists`);
  }
}

export async function categoryExists(categoria = "") {
  const categorias = await categoryModel.findOne({ name: categoria });
  if (categorias) {
    throw new Error(`The category ${categorias.name} already exists`);
  }
}
export async function categoryExistsID(id = "") {
  const categorias = await categoryModel.findById(id);
  if (!categorias) {
    throw new Error(`The category does not exist`);
  }
}

export async function categoryExists2(categoria = "") {
  const categorias = await categoryModel.findOne({ name: categoria });
  if (!categorias) {
    throw new Error(`The category ${categoria} does not exist`);
  }
}

export async function productExists(producto = "") {
  const productos = await productModel.findOne({ name: producto });
  if (productos) {
    throw new Error(`The product ${productos.name} already exists`);
  }
}

export async function productExistsID(id = "") {
  const productos = await productModel.findById(id);
  if (!productos) {
    throw new Error(`The product does not exist`);
  }
}
