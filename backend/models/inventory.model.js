import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
    {
        productId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },

        storeId:{
            type: String,
            required: true
        },

        stock:{
            type: Number,
            required: true,
            default: 0
        },

        reservedStock:{
            type: Number,
            default: 0
        },

        reorderLevel:{
            type: Number,
            default: 10
        },

        isAvailable:{
            type: Boolean,
            default: true
        }
    },
    {timestamps:true}
);

inventorySchema.index({productID: 1, storeId: 1}, {unique: true});

const Inventory = mongoose.model("Inventory", inventorySchema);

export default Inventory;
