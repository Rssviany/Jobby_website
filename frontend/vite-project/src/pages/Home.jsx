import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSignInAlt, FaUserPlus, FaFacebook, FaTwitter, FaLinkedin, FaSignOutAlt } from 'react-icons/fa';
import './Home.css';

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setShowDropdown(false);
    navigate('/login');
  };

  return (
    <div className="home">
      <nav className="navbar">
        <div className="logo">MyJobPortal</div>
        <div className="nav-links">
          {isLoggedIn ? (
            <div className="profile-wrapper" onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>
              <FaUserCircle size={28} className="nav-icon" />
              {showDropdown && (
                <div className="dropdown-menu">
                  <Link to="/profile">Profile</Link>
                  <button onClick={handleLogout}>Logout <FaSignOutAlt /></button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="nav-button"><FaSignInAlt /> Sign In</Link>
              <Link to="/register" className="nav-button primary"><FaUserPlus /> Sign Up</Link>
            </>
          )}
        </div>
      </nav>

      <header className="hero">
        <div className="overlay"></div>
        <div className="hero-content">
          <h1>Find Your Dream Job Today</h1>
          <p>Explore thousands of job opportunities from top companies. Your future starts here.</p>
          <p className="subtext">Build your career path with trusted employers across industries like IT, Marketing, Sales, HR, and more.</p>
          <div className="stats">
            <span>50K+ Jobs Posted</span>
            <span>10K+ Companies Hiring</span>
            <span>1 Million+ Users</span>
          </div>
          <Link to="/job_portal" className="btn">Browse Jobs</Link>
        </div>
      </header>

      <section className="categories">
        <h2>Popular Categories</h2>
        <div className="category-list">
          <div className="category">Engineering</div>
          <div className="category">Marketing</div>
          <div className="category">Design</div>
          <div className="category">Sales</div>
          <div className="category">Human Resources</div>
          <div className="category">Finance</div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section about">
            <h3>About Us</h3>
            <p>MyJobPortal is dedicated to connecting job seekers with employers. We make job hunting simple and efficient.</p>
          </div>
          <div className="footer-section contact">
            <h3>Contact</h3>
            <p>Email: support@myjobportal.com</p>
            <p>Phone: +91 9876543210</p>
          </div>
          <div className="footer-section social">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a href="https://facebook.com " target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
              <a href="https://twitter.com " target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
              <a href="https://linkedin.com " target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">&copy; 2025 MyJobPortal. All rights reserved.</div>
      </footer>
    </div>
  );
}

export default Home;