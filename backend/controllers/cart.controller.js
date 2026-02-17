import mongoose from "mongoose";
import Cart from "../models/cart.model.js";
import Inventory from "../models/inventory.model.js";
import Product from "../models/product.model.js";
import Order from "../models/orders.model.js";

export const checkoutCart = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user._id;
    const { storeId } = req.body;

    const cart = await Cart.findOne({ userId, storeId }).session(session);

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    let totalAmount = 0;
    const orderItems = [];

    for (let item of cart.items) {

      const quantity = Number(item.quantity);

      if (!quantity || quantity <= 0) {
        throw new Error("Invalid quantity in cart");
      }

      const inventory = await Inventory.findOne({
        productId: item.productId,
        storeId
      }).session(session);

      if (!inventory || inventory.stock < quantity) {
        throw new Error("Insufficient stock during checkout");
      }

      const product = await Product.findById(item.productId).session(session);

      totalAmount += product.price * quantity;

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.images?.[0] || null
      });

      inventory.stock -= quantity;
      await inventory.save({ session });
    }

    const order = await Order.create(
      [{
        userId,
        storeId,
        items: orderItems,
        totalAmount
      }],
      { session }
    );

    // Clear cart
    cart.items = [];
    await cart.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(order[0]);

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(400).json({ message: error.message });
  }
};


export const addToCart = async (req, res) => {
    try{
        const userId = req.user._id;
        const { storeId, productId, quantity} = req.body;

        const inventory = await Inventory.findOne({ productId, storeId});

        if(!inventory || inventory.stock < quantity){
            return res.status(400).json({message:"Insufficient Stock"});
        }

        let cart = await Cart.findOne({ userId, storeId});

        if(!cart){
            cart = await Cart.create({
                userId,
                storeId,
                items: [{ productId, quantity}]
            });
        }else{
            const itemIndex = cart.items.findIndex(
                item => item.productId.toString() === productId
            );

            if(itemIndex > -1){
                cart.items[itemIndex].quantity += quantity;
            }else{
                cart.items.push({ productid, quantity });
            }

            await cart.save();
        }

        res.status(200).json(cart);

    }catch(error){
        res.status(500).json({message: error.message});
    }
};

export const getCart = async (req, res) => {
    try{
        const userId = req.user._id;
        const { storeId } = req.params;

        const cart = await Cart.findOne({ userId, storeId})
            .populate("items.productId");
        
        res.status(200).json(cart);

    }catch(error){
        res.status(500).json({ message: error.message});
    }
};

export const removeFromCart = async (req, res) => {
    try{
        const userId = req.user._id;
        const { storeId, productId } = req.body;

        const cart = await Cart.findOne({ userId, storeId });

        if(!cart){
            return res.status(404).json({ message:"cart not found"});
        }

        cart.items = cart.items.filter(
            item => item.productId.toString() !== productId
        );

        await cart.save();

        res.status(200).json(cart);

    }catch(error){
        res.status(500).json({message: error.message});
    }
};

