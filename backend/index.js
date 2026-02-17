import express from "express";
import dotenv from "dotenv"; //to hide sensitive information
import mongoose from "mongoose";
import { v2 as cloudinary } from 'cloudinary';
import fileUpload from "express-fileupload";

import userRoute from "./routes/user.route.js";
import productRoute from "./routes/product.route.js";
import inventoryRoute from "./routes/inventory.route.js";
import ordersRoute from "./routes/orders.route.js";
import cartRoute from "./routes/cart.route.js";

const app = express();

//middleware to parse json
app.use(express.json());
//middleware to upload images to database in url format
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

dotenv.config();
const port = process.env.PORT || 3000; //3000 default port
const DB_URI = process.env.MONGO_URI

//conncetion to database mongoDB
try{
    await mongoose.connect(DB_URI); //await so that it waits until database is loaded
    console.log("connected to mongoDB");
}catch(error){
    console.log("error in connecting to mongoDB");
}

app.use("/api/v1/user", userRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/inventory", inventoryRoute);
app.use("/api/v1/orders", ordersRoute);
app.use("/api/v1/cart", cartRoute);

//cloudinary configuration code to convert images to url string
cloudinary.config({ 
    cloud_name: process.env.cloud_name, 
    api_key: process.env.api_key, 
    api_secret: process.env.api_secret // Click 'View API Keys' above to copy your API secret
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});