import mongoose from "mongoose";
import  validator  from "validator";

const messageSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:[3,"First name must contain atleast 3 characters!"]
    },
    lastName:{
        type: String,
        required: true,
        minLength: [3, "Last name must contain atleast 3 characters!"]
    },
    email: {
        type: String,
        required: true,
        validate:[validator.isEmail,"Please provide a valid Email!"]
    },
    phone: {
        type: String,
        required: true,
        minLength: [10, "Field must contain 10 digits and should not include country code!"],
        maxLength: [10, "Field must contain 10 digits and should not include country code!"]

    },
    message: {
        type: String,
        required: true,
        // maxLength: [0, "Field must contain 10 digits and should include country code!"]
    }
})


export const Message = mongoose.model("Message",messageSchema)