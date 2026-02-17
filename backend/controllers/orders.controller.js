import Order from "../models/orders.model.js";
import Inventory from "../models/inventory.model.js"
import Product from "../models/product.model.js";

export const createOrder = async (req, res) => {
    try{
        const { storeId, items } = req.body;
        const userId = req.user._id;
        
        let totalAmount = 0;
        const orderItems = [];

        for(let item of items){
            const inventory = await Inventory.findOne({
                productId: item.productId,
                storeId
            });

            if(!inventory || inventory.stock < item.quantity){
                return res.status(400).json({message: "Insufficent stock"});
            }

            const product = await Product.findById(item.productId);

            totalAmount += product.price * item.quantity;

            orderItems.push({
                productId: product._id,
                name: product.name,
                price:product.price,
                quantity: item.quantity
            });

            inventory.stock -= item.quantity;
            await inventory.save();
        }

        const order = await Order.create({
            userId,
            storeId,
            items: orderItems,
            totalAmount
        });

        res.status(201).json(order);
    }catch(error){
        res.status(500).json({message: error.message});
    }
};

