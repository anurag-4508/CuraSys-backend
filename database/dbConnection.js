import mongoose from "mongoose";

export const dbConnection=()=>{
    mongoose.connect(process.env.MONGO_URI,{
        dbName:"CuraSys"
    }).then(()=>{
        console.log("Connected to Db");
    }).catch((error)=>{
        console.log("Some error occured while connection to Database :",error);
    })
}