import CartShoppingModel from "./CartShopping.model.js";
import productModel from "../product/product.model.js";
import FacturaModel from "./factura";
export const createCart = async (req, res) => {
    const usuarioAutenticado = req.usuario;
    const exist = await CartShoppingModel.findOne({ creator: usuarioAutenticado._id })
    if (exist) {
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



export const addProduct = async (req, res) => {
    const { producto, quantity } = req.body;
    const usuarioAutenticado = req.usuario;

    const product = await productModel.findOne({ name: producto });

    const cart = await CartShoppingModel.findOne({ creator: usuarioAutenticado._id });
    if (!cart) {
        return res.status(404).json({ msg: "Shopping cart not found" });
    }

    if (!cart.creator.equals(usuarioAutenticado._id)) {
        return res.status(403).json({ msg: "you cannot access this shooping cart" });
    }

    const productInCart = cart.products.find(item => item.product.equals(product._id));
    const totalQuantityInCart = (productInCart ? productInCart.quantity : 0) + quantity;
    if (totalQuantityInCart > product.stock) {
        return res.status(400).json({ msg: "Adding this quantity exceeds the available stock" });
    }

    if (productInCart) {
        productInCart.quantity += quantity;
    } else {
        cart.products.push({ product: product._id, quantity });
    }

    cart.total += product.price * quantity;

    await cart.save();

    res.status(200).json({ msg: "Product added to cart successfully", cart });

};
export const MakePurchases = async (req, res) => {
    const usuarioAutenticado = req.usuario;
    const cart = await CartShoppingModel.findOne({ creator: usuarioAutenticado._id }).populate('products.product');

    if (!cart || cart.products.length === 0) {
        return res.status(404).json({ msg: "Shopping cart is empty" });
    }

    let total = 0;
    const productsDetails = []; 

    cart.products.forEach(item => {
        const productTotal = item.product.price * item.quantity;
        total += productTotal;

        productsDetails.push({
            name: item.product.name,
            quantity: item.quantity,
            total: productTotal
        });
    });

    const factura = new FacturaModel({
        cart: cart._id,
        customer: usuarioAutenticado._id,
        total,
        products: productsDetails 
    });

    for (const item of cart.products) {
        const productId = item.product._id;
        const quantitySold = item.quantity;

        await productModel.findByIdAndUpdate(productId, { $inc: { quantitySales: quantitySold, stock: -quantitySold } });
    }
// limpiar
    cart.products = [];
    cart.total = 0; 
    await cart.save();

    await factura.save();

    res.status(200).json({ msg: "Purchase completed successfully", factura, productsDetails });
};

export const getHistory = async (req, res) => {
    const usuarioAutenticado = req.usuario;

    const History = await FacturaModel.find({ customer: usuarioAutenticado._id }).populate('cart');
    if(!History){
        return res.status(404).json({
            msg: "you have no previous purchases"
        });
    }
    res.status(200).json({ History });

};

export const getHistoryAdmin = async (req, res) => {
    const usuarioAutenticado = req.usuario;
    const { id } = req.params;

    if (usuarioAutenticado.role !== "ADMIN_ROLE") {
        return res.status(400).json({ msg: "You cannot access this function" });
    }

    const usuarioExistente = await UserModel.findById(id);
    if (!usuarioExistente) {
        return res.status(404).json({ msg: "User not found" });
    }

    const History = await FacturaModel.find({ customer: id }).populate('cart');
    if (!History || History.length === 0) {
        return res.status(404).json({ msg: "No purchase history found" });
    }

    res.status(200).json({ History });
};
