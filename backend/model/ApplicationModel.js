import mongoose, { Mongoose } from "mongoose";

const ApplicationSchema=new mongoose.Schema({
    jobId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'JobsList'
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Register',
    },
    applicantName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:[true,"Please provide a Validate Email"]
    },
    resumeLink:{
        type:String,
        required:true
    },
    appliedAt:{
        type:Date,
        default:Date.now
    }
});

const Application=mongoose.model("Application",ApplicationSchema);

export default Application;