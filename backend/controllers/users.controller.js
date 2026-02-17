//funtions and logic
import User from "../models/usersSchema.model.js";
import bcrypt from "bcryptjs"; 
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
    try{
        const {name, email, phone, password} = req.body;
        const existingUser = await User.findOne({
            $or:[{email}, {phone}]
        });

        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            phone,
            passwordHash
        });

        res.status(201).json(user);
    }catch(error){
        res.status(500).json({message:error.message});
    }
};

export const loginUser = async (req, res) =>{
    try{
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if(!user){
            return res.status(400).json({message:"Invalid Credentials"});
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if(!isMatch){
            return res.status(400).json({message:"Invalid Credentials"});
        }

        const token = jwt.sign(
            { id: user._id, role: user.role},
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        res.status(200).json({
            message: "Login Successful",
            token
        });

    }catch(error){
        res.status(500).json({message: error.message})
    }
};

