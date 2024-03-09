import { Router } from "express";
import { check } from "express-validator";
import { categoryExists2, productExists, productExistsID } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { createCart } from "./CartShopping.controller.js";


const router = Router();


router.post(
"/",
[
    validarJWT,
    validarCampos
],
createCart
);

export default router;
