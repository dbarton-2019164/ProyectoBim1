import CartShoppingModel from "./CartShopping.model.js";
import categoryModel from "../category/category.model.js";
import productModel from "../product/product.model.js";

export const createCart = async (req, res) => {
    const usuarioAutenticado = req.usuario;
    const exist = await CartShoppingModel.findOne({ creator : usuarioAutenticado._id })
    if(exist){
        return res.status(400).json({
            msg: "You can only have one shopping cart"
        });
    }
    const cart = new CartShoppingModel({
        creator: usuarioAutenticado._id,
        products: [], 
        total: 0
    });
   await cart.save()
   res.status(200).json({
   msg: "Shopping cart created successfully",
   cart
   });
}