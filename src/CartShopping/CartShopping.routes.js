import { Router } from "express";
import { check } from "express-validator";
import { productExists2, productExistsID } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { createCart, addProduct, MakePurchases, getHistory} from "./CartShopping.controller.js";


const router = Router();


router.post(
"/",
[
    validarJWT,
    validarCampos
],
createCart
);

router.get(
    "/",
    [
        validarJWT,
        validarCampos
    ],
    getHistory
    );

router.put(
    "/",
    [
        validarJWT,
        check("producto", "The product can't be empty").not().isEmpty(),
        check("producto").custom(productExists2),
        check("quantity", "The quantity can't be empty").not().isEmpty(),
        check("quantity", "The quantity must be a non-negative integer").isInt({
          min: 1,
        }),
        validarCampos
    ],
    addProduct
);

router.post(
    "/buy/",
    [
        validarJWT,
        validarCampos
    ],
    MakePurchases
    );


export default router;
