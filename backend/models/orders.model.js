import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
    {
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product",
            required: true
        },

        name:{
            type:String,
            required: true
        },

        price:{
            type: Number,
            required: true
        },

        quantity: {
            type: Number,
            required: true
        }
    },
    {_id: false}
);

const orderSchema = new mongoose.Schema(
    {
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required: true
        },

        storeId:{
            type:String,
            required: true
        },

        items: [orderItemSchema],

        totalAmount:{
            type: Number,
            required: true
        },

        status:{
            type: String,
            enum: ["pending", "confirmed", "delivered", "cancelled"],
            default: "pending"
        }
    },
    {timestamps:true}
);

const Order = new mongoose.model("Order", orderSchema);

export default Order;