import express from 'express';
import multer from 'multer';
import authentication from '../middelware/auth.js';
import Application from '../model/ApplicationModel.js';
import { JobsList } from '../model/UserModel.js';
const applicationRouter = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/resumes'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

applicationRouter.post('/apply', authentication, upload.single('resume'), async (req, res) => {
  try {
    const { jobId, applicantName, email } = req.body;
    const userId = req.user.userId;
    const resumePath = req.file ? req.file.path : '';

    
    if (!jobId) {
      return res.status(400).json({ message: 'Job ID is required' });
    }

    
    const job = await JobsList.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    
    const existingUser = await Application.findOne({ jobId, userId });
    if (existingUser) {
      return res.status(400).json({ message: 'User already applied for this job' });
    }

    
    const newApplication = new Application({
      jobId,
      userId,
      applicantName,
      email,
      resumeLink: resumePath
    });

    await newApplication.save();
    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to apply' });
  }
});

export default applicationRouter;
