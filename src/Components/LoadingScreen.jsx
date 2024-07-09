import React from 'react';
import '../Styles/LoadingScreen.css'; // Import CSS file for styling

const LoadingScreen = () => (
  <div className="loading-screen-container">
    <div className="loading-screen-content">
      <img src="Images/spinner.gif" alt="Loading..." />
      <div>Mohon menunggu... Tolong untuk TIDAK melakukan tindakan apapun pada saat proses perubahan data!</div>
    </div>
  </div>
);

export default LoadingScreen;
