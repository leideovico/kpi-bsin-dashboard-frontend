import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OptionIcon from '../Components/optionIcon'; // Import OptionIcon
import "../Styles/login.css";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Login successful');
    console.log(rememberMe ? 'Remember me: On' : 'Remember me: Off');
    navigate('/dashboard', { state: { username: username } });
  };

  return (
    <div className="login-container">
      <div className='Wrapper'>
      <div className="login-logo">
        <img src="Images/loginlogo.png" alt="Logo Login" />
        <div className="login-logo-title">KPI STAFF DESIGN</div>
      </div>
      <form className="login-form" onSubmit={handleLogin}>
        <img className="loginlogooo"src="Images/logologin2.png" alt="Logo Login" />
        <h2>Login to your Account</h2>
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
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-options">
          <div className="checkbox-remember">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="rememberMe">Remember Me</label>
          </div>
          <a href="/forgot-password" className="forgot-password-link">Forgot Password?</a>
        </div>
        <button type="submit">Login</button>
        <div className="notregister">
        Not registered Yet? <a href="/register">Create an Account</a>
      </div>
      </form>
      </div>
      {username && <OptionIcon username={username} />} {/* Teruskan username sebagai properti ke OptionIcon */}
    </div>
  );
};

export default Login;
