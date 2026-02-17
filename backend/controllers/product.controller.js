import Product from "../models/product.model.js"
import { v2 as cloudinary } from 'cloudinary';

//creates products
export const createProduct = async (req, res) => {
    try{
        const {name, slug, category, brand, description, price} = req.body;

        const {images} = req.files
        if(!req.files || Object.keys(req.files).length===0){
            return res.status(400).json({errors: "No file uploaded"});
        }
        const allowedFormat=["image/png", "image/jpeg"];
        if(!allowedFormat.includes(images.mimetype)){
            return res.status(400).json({errors: "Invalid file format. Only PNG and JPG are allowed"});
        }

        //cloudinary code
        const cloud_response = await cloudinary.uploader.upload(images.tempFilePath)
        if(!cloud_response || cloud_response.error){
            return res.status(400).json({errors: "Error uploading file to cloudinary"});
        }


        const existingProduct = await Product.findOne({slug});

        if(existingProduct){
            return res.status(400).json({message:"Product already exists"});
        }

        const product = await Product.create({
            name, 
            slug,
            category, 
            brand,
            description,
            price,
            images:{
                public_id: cloud_response.public_id,
                url:cloud_response.url
            }
        });

        res.status(201).json(product);

    }catch(error){
        res.status(500).json({message:error.message});
    }
};

//to get list of all products
export const getProduct = async (req, res) => {
    try{
        const products = await Product.find({isActive:true});

        res.status(200).json(products);
    }catch(error){
        res.status(500).json({message:error.message});
    }
};


