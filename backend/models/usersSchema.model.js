//for database Schemas
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email:{
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },

        phone:{
            type:String,
            required: true,
            unique: true,
        },

        passwordHash:{
            type:String,
            required: true
        },

        role:{
            type:String,
            enum:["customer", "admin", "delivery", "merchant"],
            default: "customer"
        },
        
        address:{
            house:String,
            area:String,
            city:String,
            pincode:String,

            location:{
                type:{
                    type:String,
                    enum:["Point"],
                    default:"Point"
                },
                coordinates:{
                    type: [Number],
                    index:"2dsphere"
                }
            }
        },

        isActive:{
            type: Boolean,
            default: true
        }
    },
    {timestamps: true}
);


const User = mongoose.model("User", userSchema);

export default User;