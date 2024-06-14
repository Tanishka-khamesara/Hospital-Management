import mongoose from "mongoose";
import validator from "validator";

const messageScema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength:[3,"First name Must contain atleast 3 Characters"],
    },
    lastName: {
        type: String,
        required: true,
        minLength:[3,"First name Must contain atleast 3 Characters"],
    },
    email: {
        type: String,
        required: true,
        validate:[validator.isEmail,"Please provide A valid Email"],
    },
    phone: {
        type: String,
        required: true,
        minLength: [10, "phone number must have 10 digits"],
        maxLength:[10,"phone number must have 10 digits"],
    },
    message: {
        type: String,
        required: true,
        minLength:[10,"message must contain atleast 10 characters"]
    }
});

export const Message = mongoose.model("Message", messageScema);

