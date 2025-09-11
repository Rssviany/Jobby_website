import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcryptjs';


const RegisterSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Provide User Name']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Provide Email Address']
  },
  password: {
    type: String,
    required: [true, 'Provide Password']
  },
  phoneNumber: {
    type: Number,
    required: true
  },
  resumeUrl: {
    type: String,
    default: ''
  },
  resetOtp: String,
  otpExpires: Date 
});


RegisterSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (err) {
    next(err);
  }
});

export const Register = mongoose.model('Register', RegisterSchema);



const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    minlength: [3, 'Job title must be at least 3 characters']
  },
  company: {
    type: String,
    required: [true, 'Company name is required']
  },
  logoUrl: {
    type: String,
    required: false,
    match: [/^https?:\/\/.+\.(jpg|jpeg|png|svg)(\?.*)?$/, 'Logo URL must be an image link']

  },
  location: {
    type: String,
    required: true
  },
  salary: {
    type: String,
    required: true
  },
  skills: {
    type: [String],
    required: true,
    validate: {
      validator: (arr) => arr.length > 0,
      message: 'At least one skill is required'
    }
  },
  description: {
    type: String,
    required: true,
    minlength: [10, 'Description must be at least 10 characters']
  },
  summary: {
    type: String,
    required: true
  },
  rolesAndResponsibilities: {
    type: String,
    required: true
  },
  workType: {
    type: String,
    required: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });



export const JobsList = mongoose.model('JobsList', JobSchema);



