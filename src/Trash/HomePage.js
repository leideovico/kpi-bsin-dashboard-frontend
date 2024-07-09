import React, { useEffect, useState } from 'react';
import '../Styles/home.css';
import { useLocation, useNavigate } from 'react-router-dom';

const HomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState('Guest'); // Default username adalah 'Guest'

  // Fungsi untuk memperbarui username saat komponen dimuat
  useEffect(() => {
    if (location.state && location.state.username) {
      // Jika ada username yang disimpan di state lokasi, gunakan itu sebagai username
      setUsername(location.state.username);
    } else {
      // Jika tidak, cek apakah ada username yang tersimpan di local storage
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
      }
    }
  }, [location.state]);

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="landing-page">
      <div className="banner">
        <h1>WELCOME TO KPI STAFF DESIGN DASHBOARD, {username}</h1>
        <p>
          Selamat datang di dashboard desain KPI Staff! Website ini dirancang untuk membantu staf dalam memantau dan menganalisis kinerja kunci (KPI) mereka. Kami menyediakan berbagai fitur dan alat visualisasi data untuk membantu Anda memahami dan meningkatkan kinerja Anda.
        </p>
        <button className="dashboard-button" onClick={goToDashboard}>Go To Dashboard Page</button>
      </div>
    </div>
  );
};

export default HomePage;
