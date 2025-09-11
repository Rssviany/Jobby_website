import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './Login.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const loginSubmission = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert('Please fill in all details');
    try {
      const response = await axios.post('http://localhost:3003/api/jobs/login', {
        email,
        password,
      });

      const token = response.data.token;
      localStorage.setItem('token', token);
      navigate('/job_portal');

      const decoded = jwtDecode(token);
      const expirationTime = decoded.exp * 1000 - Date.now();

      setTimeout(() => {
        localStorage.removeItem('token');
        alert('Session expired. Please login again.');
        navigate('/login');
      }, expirationTime);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          alert('User not Found');
        } else if (error.response.status === 401) {
          alert('Incorrect Password');
        } else {
          alert(error.response.data.message || 'Login Failed');
        }
      } else {
        alert('Login Failed. Please try again');
        console.error('Login error:', error);
      }
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={loginSubmission}>
        <h2>Login</h2>

        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <div className="password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="eye-toggle" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash className="eye-icon" /> : <FaEye className="eye-icon" />}
          </span>
        </div>

        <button type="submit">Submit</button>
        <button
          type="button"
          className="forgot-password-btn"
          onClick={() => navigate('/forget-password')}
        >
          Forgot Password?
        </button>
      </form>
    </div>
  );
}

export default Login;




