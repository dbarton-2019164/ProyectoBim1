import { Router } from "express";
import { check } from "express-validator";
import { categoryExists2, productExists, productExistsID } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { registerProduct, editProduct, deleteProduct, showProduct ,showProducts } from "./product.controller.js";
const router = Router();

router.post(
  "/",
  [
    validarJWT,
    check("producto", "The name can't be empty").not().isEmpty(),
    check("producto").custom(productExists),
    check("price", "The price must be numeric").isNumeric(),
    check("category", "The category can't be empty").not().isEmpty(),
    check("category").custom(categoryExists2),
    check("stock", "The stock can't be empty").not().isEmpty(),
    check("stock", "The stock must be a non-negative integer").isInt({
      min: 0,
    }),
    validarCampos,
  ],
  registerProduct
);


router.put(
  "/:id",
  [
      validarJWT,
      check("id", "it is not a valid format").isMongoId(),
      check("id").custom(productExistsID),
      validarCampos,
  ],
  editProduct
);


router.delete(
  "/:id",
  [
      validarJWT,
      check("id", "it is not a valid format").isMongoId(),
      check("id").custom(productExistsID),
      validarCampos,
  ],
  deleteProduct
);


router.get(
  "/order/:order",
  [
      validarJWT,
      validarCampos,
  ],
  showProducts
);
router.get(
  "/",
  [
      validarJWT,
      validarCampos,
  ],
  showProducts
);

router.get(
  "/search/",
  [
      validarJWT,
      check("name", "The name can't be empty").not().isEmpty(),
      validarCampos,
  ],
  showProduct
);



export default router;
