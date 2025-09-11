import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './job_portal.css';
import Profile from '../pages/Profile';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaBackward } from 'react-icons/fa';

function JobPortal() {
  const [detailsList, setDetailsList] = useState([]);
  const [locationFilter, setLocationFilter] = useState('');
  const [selectedType, setSelectedType] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const fetchJobs = async () => {
    try {
      const query = new URLSearchParams();
      if (locationFilter) query.append('location', locationFilter);

      if (selectedType.length > 0) query.append('workType', selectedType.join(','));
      query.append('page', currentPage);
      query.append('limit', limit);
      const response = await axios.get(`http://localhost:3003/api/jobs/job_portal?${query}`);
      console.log(query);
      setDetailsList(response.data.jobs);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchJobs()
  }, [currentPage]);


  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedType([...selectedType, value]);
    } else {
      setSelectedType(selectedType.filter((type) => type !== value));
    }

  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchJobs();
  }

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  return (
    <>
      <div className={darkMode ? 'job-portal dark' : 'job-portal'}>
        <nav className="navbar">
          <h2>Job Portal</h2>
          <div className='profile'>
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
              Dark Mode
            </label>
            <Link to="/profile"><FaUserCircle size={28} /></Link>
          </div>
        </nav>

        <div className="main-content">
          <div className="sidebar">
            <input
              type="text"
              placeholder="Search by location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
            <div className="checkbox-group">
              <label><input type="checkbox" value="Full-Time" onChange={handleCheckboxChange} /> Full Time</label>
              <label><input type="checkbox" value="Part-Time" onChange={handleCheckboxChange} /> Part Time</label>
              <label><input type="checkbox" value="Hybrid" onChange={handleCheckboxChange} /> Hybrid</label>
              <label><input type="checkbox" value="Remote" onChange={handleCheckboxChange} /> Remote</label>

            </div>
            <button onClick={handleSearch}>Search</button>
          </div>

          <div className="job-list">
            {detailsList.map((each) => (

              <Link to={`/job_portal/${each._id}`} className='link' key={each._id}>
                <div className="card" >
                  <div className="card-content">
                    <img src={each.logoUrl} alt="logo" className="img" />
                    <div>
                      <h1>{each.title}</h1>
                      <h2>{each.company}</h2>
                      <p>{each.location}</p>
                      <p>{each.salary}</p>
                      <p>{each.description}</p>

                      <p>{each.workType}</p>
                    </div>
                  </div>
                </div>
              </Link>

            ))}
          </div>
        </div>
        <div className='bottom'>
          <div>
            <Link to='/' className='bottom1'><FaBackward size={15} color='red' /></Link>
          </div>
          <div className="pagination">
            <button disabled={currentPage === 1} onClick={prevPage}>prev</button>
            <span>{currentPage} of {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={nextPage} >nxt</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default JobPortal;
