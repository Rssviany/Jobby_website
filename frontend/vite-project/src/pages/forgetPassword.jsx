import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './forgetPassword.css';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3003/api/jobs/forget-password', { email });
      alert(res.data.message);

      // ⏱️ Navigate to reset-password after 5 seconds
      setTimeout(() => {
        navigate('/reset-password', { state: { email } }); // optional: pass email to prefill
      }, 5000);
    } catch (error) {
      alert(error.response?.data?.message || 'Error sending OTP');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send OTP</button>
      </form>
    </div>
  );
};

export default ForgetPassword;
