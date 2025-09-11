import mongoose from "mongoose";
import dotenv from 'dotenv'

const mongo_Url=process.env.MONGO_CONNECTION;

export default mongo_Url;