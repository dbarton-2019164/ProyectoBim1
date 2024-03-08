import userModel from "../user/user.model.js";
import categoryModel from "../category/category.model.js";


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
    const categorias = await categoryModel.findOne({ name : categoria });
    if (categorias) {
        throw new Error(`The category ${categorias.name} already exists`);
    }
  }