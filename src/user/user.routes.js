import { Router } from "express";
import { check } from "express-validator";
import { emailExists, userExists } from "../helpers/db-validator.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { registerUser, loginUsers, editName, editPassword, deleteUser, editByAdmin, deleteByAdmin } from "./user.controller.js";

const router = Router();


router.post(
  "/",
  [
    check("name", "The name can't be empity").not().isEmpty(),
    check("user", "The user can't be empity").not().isEmpty(),
    check("user").custom(userExists),
    check("email", "Invalid email").isEmail(),
    check("email").custom(emailExists),
    check("password", "Must be at least 6 characters").isLength({
      min: 6,
    }),
    validarCampos,
  ],
  registerUser
);

router.put(
  "/",
  [
    validarJWT,
    check("name", "The name can't be empity").not().isEmpty(),
    validarCampos,
  ],
  editName
);

router.put(
  "/admin/:id",
  [
    check("id", "it is not a valid format").isMongoId(),
    validarJWT,
    validarCampos,
  ],
  editByAdmin
);

router.delete(
  "/admin/:id",
  [
    check("id", "it is not a valid format").isMongoId(),
    validarJWT,
    validarCampos,
  ],
  deleteByAdmin
);



router.put(
  "/password/",
  [
    validarJWT,
    check("oldPassword", "Must be at least 6 characters").isLength({
      min: 6,
    }),
    check("newPassword", "Must be at least 6 characters").isLength({
      min: 6,
    }),
    validarCampos,
  ],
  editPassword
);

router.delete(
  "/",
  [
    validarJWT,
    check("Password", "Must be at least 6 characters").isLength({
      min: 6,
    }),
    validarCampos,
  ],
  deleteUser
);




router.get(
  "/",
  [
     validarCampos,
  ],
  loginUsers
);

export default router;