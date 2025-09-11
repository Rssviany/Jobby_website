import express from 'express';
import { JobsList } from '../model/UserModel.js';

const jobRouter = express.Router();

jobRouter.post('/add', async (req, res) => {
    try {
        const { title, company, logoUrl, location, salary, skills, description, summary, rolesAndResponsibilities, workType } = req.body;
        const job = new JobsList({
            title, company, logoUrl, location, salary, skills, description, summary, rolesAndResponsibilities, workType
        });
        await job.save();
        res.status(201).json({ message: 'Jobs added successfully' })
    } catch (e) {
        console.error('Error adding job:', e);
        res.status(500).json({ message: 'Failed to add the job' });
    }
});
jobRouter.post('/bulk-add', async (req, res) => {
    try {
        const jobs = req.body;
        const result = await JobsList.insertMany(jobs);
        res.status(200).json({ message: 'Bulk entry of jobs is added' });
    } catch (error) {
        console.log('Bulk add error:', error);
        res.status(500).json({ message: 'Failed to upload bulk entry data' });
    }
});
jobRouter.get('/', async (req, res) => {
    try {
        const { location,  workType, page = 1, limit = 5 } = req.query;
        let filter = {};

        if (location) {
            filter.location = new RegExp(location, 'i'); // Case-insensitive search
        }
        
        let workTypeArray = [];

        try {
            if (typeof workType === 'string') {
                workTypeArray = workType.split(',').map(type => new RegExp(`^${type.trim()}$`, 'i'));
                filter.workType = { $in: workTypeArray };
            }
        } catch (err) {
            console.error('Error parsing workType:', err);
        }


        console.log('Incoming query:', req.query);
        const skip = (page - 1) * limit;

        const jobs = await JobsList.find(filter)
            .skip(skip)
            .limit(parseInt(limit));
        const totalJobs = await JobsList.countDocuments(filter);
        const totalPages = Math.ceil(totalJobs / limit);
        res.status(200).json({
            jobs,
            totalPages, currentPage: parseInt(page),
            totalJobs
        });
    } catch (error) {
        console.log("Failed to load jobs:", error);
        res.status(500).json({ message: 'Failed to load jobs details' });
    }
});

jobRouter.get('/:id', async (req, res) => {
    try {

        const singleJob = await JobsList.findById(req.params.id);

        if (!singleJob) return res.status(404).json({ message: 'Job no found' });


        res.status(200).json(singleJob);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch the job details' })
    }
})

jobRouter.delete('/delete', async (req, res) => {

    try {
        const { id } = req.body;
        const unwanted = await JobsList.findByIdAndDelete(id);
        res.status(200).json({ message: 'Deletion is Successfull' })
    } catch (error) {
        res.status(500).json({ message: 'Failed to remove the job' });
    }
});

export default jobRouter;