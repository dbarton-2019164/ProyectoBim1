import { Router } from "express";
import { check } from "express-validator";
import { categoryExists, categoryExistsID } from "../helpers/db-validator.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { registerCategory, updateCategory, deleteCategory, showCategories } from "./category.controller.js";
const router = Router();

router.post(
    "/",
    [
        validarJWT,
        check("name", "The name can't be empty").not().isEmpty(),
        check("name").custom(categoryExists),
        validarCampos,
    ],
    registerCategory
);

router.get("/",[validarJWT, validarCampos], showCategories);

router.put(
    "/:id",
    [
        validarJWT,
        check("id", "it is not a valid format").isMongoId(),
        check("id").custom(categoryExistsID),
        check("name", "The name can't be empty").not().isEmpty(),
        check("name").custom(categoryExists),
        validarCampos,
    ],
    updateCategory
);

router.delete(
    "/:id",
    [
        validarJWT,
        check("id", "it is not a valid format").isMongoId(),
        check("id").custom(categoryExistsID),
        validarCampos,
    ],
    deleteCategory
);


export default router;