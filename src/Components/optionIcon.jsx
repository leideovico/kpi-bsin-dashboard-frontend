import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/optionIcon.css';

const OptionIcon = ({ username }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    console.log('Logging out...');
    navigate('/login');
  };

  return (
    <div className="option-icon-container">
      <button className="option-icon-button" onClick={toggleDropdown}>
        &#8942;
      </button>
      {/* Tambahkan kondisi untuk menampilkan dropdown menu */}
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
