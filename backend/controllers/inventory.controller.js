import Inventory from "../models/inventory.model.js";

export const addInventory = async (req, res) =>{
    try{
        const {productId, storeId, stock} = req.body;

        const stocking = await Inventory.create({
            productId,
            storeId,
            stock
        });

        res.status(201).json(stocking);

    }catch(error){
        res.status(500).json({message:error.message})
    }
};

export const getInventoryByStore = async (req, res) => {
    try{
        const {storeId} = req.params;
        const inventory = await Inventory.findOne({storeId})
            .populate("productId");
        res.status(200).json(inventory);

    }catch(error){
        res.status(500).json({message: error.message});
    }
};

