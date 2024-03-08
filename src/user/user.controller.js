import { response, request } from "express";
import bcryptjs from 'bcryptjs';
import { generateJWT } from "../helpers/generate-jwt.js"
import userModel from "./user.model.js";


export const registerUser = async (req, res) => {
  const { name, user, email, password } = req.body;
  var role;
  var usuario;
  try {
    if (email.includes("kinal.org.gt")) {
      role = "ADMIN_ROLE";
      usuario = new userModel({ name, user, email, password, role });
    } else {

      usuario = new userModel({ name, user, email, password });
    }

    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    await usuario.save();

    res.status(200).json({
      usuario,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const editByAdmin = async (req, res) => {
  const { id } = req.params;
  var { name, password, role } = req.body;
  const usuarioAutenticado = req.usuario;
  if (usuarioAutenticado.role !== "ADMIN_ROLE") {
    return res.status(400).json({
      msg: "you cannot access this function"
    });
  }
  const old = await userModel.findById(id);
  if (!old) {
    return res.status(404).json({
      msg: "The user was not found"
    });
  }
  if (!name) {
    name = old.name;
  }
  if (!password) {
    password = old.password;

  } else if (password.length() < 6) {
    return res.status(400).json({
      msg: "Must be at least 6 characters"
    })
  } else {
    const salt = bcryptjs.genSaltSync();
    password = bcryptjs.hashSync(password, salt);
  }

  if (!role) {
    role = old.role;
  } else if (role !== "ADMIN_ROLE" && role !== "CLIENT_ROLE") {
    return res.status(404).json({
      msg: "Invalid role"
    });
  }
  await userModel.findByIdAndUpdate(id, { name: name, password: password, role: role });

  const result = await userModel.findById(id);

  res.status(200).json({
    msg: "User updated successfully",
    result
  });
}


export const deleteByAdmin = async (req, res) => {
  const { id } = req.params;
  const usuarioAutenticado = req.usuario;
  if (usuarioAutenticado.role !== "ADMIN_ROLE") {
    return res.status(400).json({
      msg: "you cannot access this function"
    });
  }
  const old = await userModel.findById(id);
  if (!old) {
    return res.status(404).json({
      msg: "The user was not found"
    });
  }
   await userModel.findByIdAndUpdate(id, { condition : false });

   
  const result = await userModel.findById(id);

  res.status(200).json({
    msg: "User deleted successfully",
    result
  });
}



export const editName = async (req, res) => {
  const name = req.body;
  const usuarioAutenticado = req.usuario;
  await userModel.findByIdAndUpdate(usuarioAutenticado.id, name);
  const userNew = await userModel.findById(usuarioAutenticado.id);

  res.status(200).json({
    msg: "User updated successfully",
    userNew
  });
};

export const editPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const usuarioAutenticado = req.usuario;
  const p = await userModel.findById(usuarioAutenticado.id);
  const acces = bcryptjs.compareSync(oldPassword, p.password);

  if (!acces) {
    return res.status(400).json({
      msg: "Incorrect password"
    })
  }
  const salt = bcryptjs.genSaltSync();
  const finalPassword = bcryptjs.hashSync(newPassword, salt);
  await userModel.findByIdAndUpdate(usuarioAutenticado.id, { password: finalPassword });

  res.status(200).json({
    msg: "Password updated successfully",

  });
};

export const deleteUser = async (req, res) => {
  const { Password } = req.body;
  const usuarioAutenticado = req.usuario;
  const p = await userModel.findById(usuarioAutenticado.id);
  const acces = bcryptjs.compareSync(Password, p.password);

  if (!acces) {
    return res.status(400).json({
      msg: "Incorrect password"
    })
  }

  await userModel.findByIdAndUpdate(usuarioAutenticado.id, { condition: false });

  res.status(200).json({
    msg: "User Deleted",

  });
};


export const loginUsers = async (req, res) => {
  const { user, password } = req.body;
  var token;

  var usuario = await userModel.findOne({ user: user });
  if (!usuario) {
    usuario = await userModel.findOne({ email: user });
    if (!usuario) {
      return res.status(404).json({
        msg: "The user was not found",
      });
    }
  }
  if(usuario.condition === false){
    return res.status(400).json({
      msg: "The user is disabled"
    });
   

  }
  const acces = bcryptjs.compareSync(password, usuario.password);
  if (!acces) {
    return res.status(400).json({ msg: "Incorrect password" });
  }
  token = await generateJWT(usuario.id);

  res.status(200).json({
    msg: "access granted",
    token,
  });
};