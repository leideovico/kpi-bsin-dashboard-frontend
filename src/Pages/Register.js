import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "../Styles/login.css";

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const itemData = {
      username: username,
      email: email,
      password: password,
      confirm_password: confirmPassword
    };

    try {
      const response = await fetch('http://localhost:8080/kpi/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(itemData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to register');
      }

      console.log('Register successful');
      navigate('/login');
    } catch (error) {
      setError(error.message || 'Something went wrong');
    }
  };

  return (
    <div className="login-container">
      <div className='Wrapper'>
        <div className="login-logo">
          <img src="Images/loginlogo.png" alt="Logo Login" />
          <div className="login-logo-title">KPI STAFF DESIGN</div>
        </div>
        <form className="login-form" onSubmit={handleRegister}>
          <img className="loginlogoo" src="Images/logologin2.png" alt="Logo Login" />
          <h2>Register to Make New Account</h2>
          {error && <div className="error">{error}</div>}
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password2">Confirm Password</label>
            <input
              type="password"
              id="password2"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Register</button>
          <div className="notregister">
            Already Have an Account? <Link to="/login">Login Here</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
