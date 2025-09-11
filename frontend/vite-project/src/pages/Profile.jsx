import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';
import { useNavigate, Link } from 'react-router-dom';
import { FaBackward } from 'react-icons/fa';

function Profile() {
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3003/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data.user);
      setApplications(res.data.appliedJobs);
    } catch (err) {}
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resume) return;
    const formData = new FormData();
    formData.append('resume', resume);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:3003/api/user/upload-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      setMessage(res.data.message);
      fetchProfile();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Upload failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleMarkInactive = async (jobId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3003/api/user/delete-job/${jobId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProfile();
    } catch (error) {}
  };

  const handleCleanup = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.delete('http://localhost:3003/api/user/cleanup-orphans', {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(`Deleted ${res.data.count} orphan applications`);
      fetchProfile();
    } catch (error) {}
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <>
      <div className="profile-container">
        <div className="profile-card">
          <h2>Welcome, {user.name}</h2>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phoneNumber}</p>
          <p><strong>Resume:</strong> {user.resumeUrl
            ? <a href={`http://localhost:3003${user.resumeUrl}`} target="_blank" rel="noopener noreferrer">View Resume</a>
            : 'Not uploaded'}</p>
          <form onSubmit={handleResumeUpload}>
            <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResume(e.target.files[0])} />
            <button type="submit">Upload Resume</button>
          </form>
          <button className="logout" onClick={handleLogout}>Logout</button>

          {message && <p className="message">{message}</p>}
        </div>

        <div className="applications">
          <h3>Your Applications</h3>
          {applications.length > 0 ? (
            applications.map((app) => (
              <div key={app._id} className="application-card">
                <h4>{app.jobId?.title || 'Job no longer exists'}</h4>
                <p><strong>Company:</strong> {app.jobId?.company || 'N/A'}</p>
                <p><strong>Status:</strong> {app.status || 'Applied'}</p>
                {app.jobId?.isActive && (
                  <button onClick={() => handleMarkInactive(app.jobId._id)} className="inactive-btn">
                    Mark Job as Inactive
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>No applications yet</p>
          )}
        </div>
      </div>

      <div className="bottom">
        <Link to="/job_portal" className="bottom1">
          <FaBackward size={15} color="gray" />
        </Link>
      </div>
    </>
  );
}

export default Profile;




