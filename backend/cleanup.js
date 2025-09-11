
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Application from './model/ApplicationModel.js';

dotenv.config();

mongoose.connect(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    const deleted = await Application.deleteMany({ jobId: null });
    console.log(`✅ ${deleted.deletedCount} invalid applications removed.`);
    process.exit();
}).catch((err) => {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
});
