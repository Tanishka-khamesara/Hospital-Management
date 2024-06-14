import mongoose from "mongoose";

export const dbconnection = () => {
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log("Database Connected Succesfully");
    }).catch((err) => console.log("Error Occured", err));
}