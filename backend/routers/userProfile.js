// userRoutes.js
import express from 'express';
import multer from 'multer';
import { Register } from '../model/UserModel.js';
import authentication from '../middelware/auth.js';
import Application from '../model/ApplicationModel.js';
import { JobsList } from '../model/UserModel.js';

const userRouter = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/resumes/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

userRouter.get('/profile', authentication, async (req, res) => {
  try {
    const user = await Register.findById(req.user.userId).select('-password');
    const appliedJobs = await Application.find({ userId: req.user.userId }).populate('jobId');
    const cleanedApplications = appliedJobs.filter(app => app.jobId && app.jobId.isActive);
    res.json({ user, appliedJobs: cleanedApplications });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile data' });
  }
});

userRouter.post('/upload-resume', authentication, upload.single('resume'), async (req, res) => {
  try {
    const user = await Register.findByIdAndUpdate(
      req.user.userId,
      { resumeUrl: `/uploads/resumes/${req.file.filename}` },
      { new: true }
    );
    res.json({ message: 'Resume uploaded successfully', resumeUrl: user.resumeUrl });
  } catch (error) {
    res.status(500).json({ message: 'Resume upload failed' });
  }
});

userRouter.put('/delete-job/:id', authentication, async (req, res) => {
  try {
    const job = await JobsList.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.status(200).json({ message: 'Job marked as inactive' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete job' });
  }
});

userRouter.delete('/cleanup-orphans', async (req, res) => {
  try {
    const result = await Application.deleteMany({ jobId: null });
    res.status(200).json({ message: 'Orphan applications deleted', count: result.deletedCount });
  } catch (error) {
    res.status(500).json({ message: 'Cleanup failed' });
  }
});

export default userRouter;
