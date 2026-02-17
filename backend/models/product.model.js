import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required: true,
            trim: true
        },

        slug:{
            type:String,
            required: true,
            unique: true
        },

        category:{
            type:String,
            required:true
        },

        brand:{
            type: String,
        },

        description:{
            type:String
        },

        price:{
            type:Number,
            required:true
        },

        images:{
            public_id:{
                type:String,
                required: true
            },
            url:{
                type:String,
                required: true
            },
        },

        isActive:{
            type:Boolean,
            default:true
        }
    },
    {timeStamps: true}
);

const Product = mongoose.model("Product", productSchema);
export default Product;