import adminModel from "../user/user.model.js";



export async function emailExists(correo = "") {
    const user = await adminModel.findOne({ email: correo });
    if (user) {
        throw new Error(`The email ${user.email} already exists`);
    }
  }

  
export async function userExists(usuario = "") {
    const userFB = await adminModel.findOne({ user: usuario });
    if (userFB) {
        throw new Error(`The user ${userFB.user} already exists`);
    }
  }