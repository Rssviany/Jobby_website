import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import path from 'path'
import mongo_Url from './model/connection.js';
dotenv.config();
import router from './routers/signUp_In.js';
import jobRouter from './routers/jobUploads.js';
import applicationRouter from './routers/appliedJobs.js'
import userRouter from './routers/userProfile.js'


const app = express();

//middelware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

//routes
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));
app.use('/api/jobs', router);
app.use('/api/jobs/job_portal', jobRouter);
app.use('/api/jobs/application', applicationRouter);
app.use('/api/user',userRouter);




mongoose.connect("mongodb+srv://rssvinaykumar3801:uVto7Hk9WM0G3UVa@cluster-jobs.fkyztzw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-jobs")
.then(() => {
    console.log('Mongoose connection is successfull');
    app.listen(3003, (req, res) => {
        console.log("backend is running successfull");
    })
})
    .catch((e) => {
        console.log(e);
    })
