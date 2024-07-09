import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/optionIcon.css';

const OptionIcon = ({ username }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8080/kpi/user/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to log out');
      }

      // Hapus token dan username dari localStorage saat logout
      localStorage.removeItem('authToken');
      localStorage.removeItem('username');
      console.log('Logging out...');
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="option-icon-container">
      <button className="option-icon-button" onClick={toggleDropdown}>
        &#8942;
      </button>
      <div className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
        <ul>
          <li>Welcome, {username}</li>
          <li onClick={handleLogout}>Log Out</li>
        </ul>
      </div>
    </div>
  );
};

export default OptionIcon;
