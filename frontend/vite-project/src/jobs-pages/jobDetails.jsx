import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './jobDetails.css';
import { FaBackward } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [applicantName, setApplicantName] = useState('');
  const [email, setEmail] = useState('');
  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`http://localhost:3003/api/jobs/job_portal/${id}`);
        setJob(response.data);
      } catch (error) {
        console.log('Error fetching job:', error);
      }
    };
    fetchJobs();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const decode = jwtDecode(token);
    const userId = decode.userId;
    const formData = new FormData();
    formData.append('jobId', job._id);
    formData.append('applicantName', applicantName);
    formData.append('email', email);
    formData.append('resume', resume);

    try {
      await axios.post('http://localhost:3003/api/jobs/application/apply', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      setMessage('Application submitted successfully');
      setAlertType('success');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Something went wrong');
      setAlertType('error');
    }
    setTimeout(() => setMessage(''), 4000);
  };

  if (!job) return <div className="loading">Loading job details...</div>;

  return (
    <>

      <div className="job-details">
        <h1>{job.title}</h1>
        <h2>{job.company}</h2>
        <img src={job.logoUrl} alt="Company Logo" className="company-logo" />
        <p><strong>Location:</strong> {job.location}</p>
        <p><strong>Salary:</strong> {job.salary}</p>
        <p><strong>Description:</strong> {job.description}</p>
        <p><strong>Summary:</strong> {job.summary}</p>
        <p><strong>Roles & Responsibilities:</strong> {job.rolesAndResponsibilities}</p>
        <p><strong>Work Type:</strong> {job.workType}</p>

        <form onSubmit={handleApply} className="application-form" encType="multipart/form-data">
          <input type="text" placeholder="Your Name" value={applicantName} onChange={(e) => setApplicantName(e.target.value)} required />
          <input type="email" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="file" onChange={(e) => setResume(e.target.files[0])} accept=".pdf,.doc,.docx" required />
          <button type="submit">Submit Application</button>
        </form>

        {message && <div className={`alert ${alertType}`}>{message}</div>}
      </div>
      <div className='bottom'>
        <Link to='/job_portal' className='bottom1'><FaBackward size={15} color='black' /></Link>
      </div>
    </>
  );
}

export default JobDetails;

