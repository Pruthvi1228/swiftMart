import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
    {
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product",
            required:true
        },
        quantity:{
            type:String,
            required:true,
            min:1
        }
    },
    {_id: false}
);

const cartSchema = new mongoose.Schema(
    {
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        storeId:{
            type:String,
            required:true
        },
        items:[cartItemSchema]
    },
    {timestamps: true}
);

cartSchema.index({userId: 1, storeId:1}, {unique: true});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;