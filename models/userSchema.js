import mongoose from "mongoose";
import validator from "validator";
import  bcrypt  from "bcrypt";
import jwt from "jsonwebtoken";


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: [3, "First name must contain atleast 3 characters!"]
    },
    lastName: {
        type: String,
        required: true,
        minLength: [3, "Last name must contain atleast 3 characters!"]
    },
    email: {
        type: String,
        required: true,
        validate: [validator.isEmail, "Please provide a valid Email!"]
    },
    phone: {
        type: String,
        required: true,
        minLength: [10, "Field must contain 10 digits and should not include country code!"],
        maxLength: [10, "Field must contain 10 digits and should not include country code!"]

    },
    nic: {
        type: String,
        required: true,
        minLength: [13, "NIC must contain 23 digits"],
        maxLength: [13, "NIC must contain 23 digits"]
    },
    dob: {
        type: Date,
        required: [true,"DOB is required!"],
    },
    gender:{
        type:String,
        required:true,
        enum:["Male","Female"]
    },
    password: {
        type: String,
        required: true,
        minLength: [8, "Password should of minimum 8 characters in length and alphaNumeric!"],
        select:false
    },
    role: {
        type: String,
        required: true,
        enum:["Admin","Patient","Doctor"]
    },
    doctorDepartment:{
        type:String
    },
    docAvatar:{
        public_id:String,
        url:String
    }

})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password=await bcrypt.hash(this.password,10)
})

userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

userSchema.methods.generateJsonWebToken = function () {
    return  jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRES,
    })
}

// const User = mongoose.model("User", userSchema);
// export default User;

export const User = mongoose.model("User", userSchema);