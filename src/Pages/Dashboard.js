import React, { useState, useEffect } from "react";
import "../Styles/styles.css";
import InputTable from "../Table/InputTable.jsx";

import SavedTable1 from "../Table/SavedTable1.jsx";
 

import TemplateTable2 from "../Table/TemplateTable2.jsx";
import TemplateTable3 from "../Table/TemplateTable3.jsx";
import Chart from "../Chart/SafetyChart.jsx" ;
import DragDropFiles from "../Components/dragdropfiles.jsx";
import OptionIcon from "../Components/optionIcon.jsx";
import AnalysisTableInput from "../Table/AnalysisTableInput.jsx";
import SummaryInputTable from "../Table/SummaryTableInput.jsx";

import { useLocation, useNavigate } from 'react-router-dom';


function hideMainContent() {
  const mainContent = document.querySelector(".main-content");
  if (mainContent) {
    mainContent.style.display = "none";
  }
}

const Dashboard = () => { // Terima properti location untuk mendapatkan state dari route

  const location = useLocation();
  const navigate = useNavigate();
   const [username, setUsername] = useState('');


  
   useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      navigate('/login'); // Redirect to login if no username found
    }
  }, [navigate]);



  const [activeMenu, setActiveMenu] = useState("KPI");
  const [activeSubItem, setActiveSubItem] = useState(""); // State untuk menentukan subitem yang aktif

  const [isKPIDropdownVisible, setKPIDropdownVisible] = useState(false);
  const [isPeopleDropdownVisible, setPeopleDropdownVisible] = useState(false);
  const [isInputDropdownVisible, setInputDropdownVisible] = useState(false);
  const [isAbsensiDropdownVisible, setAbsensiDropdownVisible] = useState(false);
  const [isAnalysisDropdownVisible, setAnalysisDropdownVisible] = useState(false);
  const [isSummaryDropdownVisible, setSummaryDropdownVisible] = useState(false);

  const [isKPIRotated, setKPIRotated] = useState(false);
  const [isPeopleRotated, setPeopleRotated] = useState(false);
  const [isAbsensiRotated, setAbsensiRotated] = useState(false);
  const [isInputRotated, setInputRotated] = useState(false);
  const [isAnalysisRotated, setAnalysisRotated] = useState(false);
  const [isSummaryRotated, setSummaryRotated] = useState(false);

  const [isChartVisible, setIsChartVisible] = useState(false);
  const [isDragDropVisible, setIsDragDropVisible] = useState(false);

  const handleLogoClick = () => {
       window.location.reload(); // Merefresh halaman dashboard
    };

  const handleChartToggle = () => {
    setIsChartVisible(!isChartVisible);
  };

  const handleShowChart = () => {
    setIsChartVisible(true); // Memastikan grafik akan ditampilkan
  };

  const handleHideChart = () => {
    setIsChartVisible(false);
  };

  const handleDragDropFiles = () => {
    setIsDragDropVisible(true);  
  };

  const handleHideDragDropFiles = () => {
    setIsDragDropVisible(false);  
  };

  // Safety Chart
  const [chartSize, setChartSize] = useState({
    width: "425px",
    height: "390px",
    paddingLeft: "10px",
    paddingRight: "10px",
    paddingTop: "30px",
    marginTop: "20px",
    marginBottom: "50px",
    paddingBottom: "25px",
    marginLeft: "110px",
  });

   

  const [activeMode, setActiveMode] = useState(null);

  const [isTopBarVisible, setTopBarVisible] = useState(false); // State untuk menentukan visibilitas top bar
  const [topBarContent, setTopBarContent] = useState(""); // State untuk konten dari top bar

  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [isSidebarPinned, setIsSidebarPinned] = useState(false);

  const [isInputKpiVisible, setIsInputKpiVisible] = useState(false);
  const [isInputAnalysisVisible, setIsInputAnalysisVisible] = useState(false);
  const [isInputSummaryVisible, setIsInputSummaryVisible] = useState(false);
  
  const [isEditKpiVisible, setIsEditKpiVisible] = useState(false);
  const [isEditAnalysisVisible, setIsEditAnalysisVisible] = useState(false);
  const [isEditSummaryVisible, setIsEditSummaryVisible] = useState(false);
  
  const [isSavedSafetyVisible, setIsSavedSafetyVisible] = useState(false);
  const [isSavedEnvironmentVisible, setIsSavedEnvironmentVisible] = useState(false);
  const [isSavedQualityVisible, setIsSavedQualityVisible] = useState(false);
  const [isSavedCostVisible, setIsSavedCostVisible] = useState(false);
  const [isSavedDeliveryVisible, setIsSavedDeliveryVisible] = useState(false);


  const handleSavedSafetyClick = () => {
    setIsSavedSafetyVisible(true);
  };

  const handleHideSavedSafetyClick = () => {
    setIsSavedSafetyVisible(false);
  };

  const handleSavedEnvironmentClick = () => {
    setIsSavedEnvironmentVisible(true);
  };

  const handleHideSavedEnvironmentClick = () => {
    setIsSavedEnvironmentVisible(false);
  };


  const handleSavedQualityClick = () => {
    setIsSavedQualityVisible(true);
  };

  const handleHideSavedQualityClick = () => {
    setIsSavedQualityVisible(false);
  };


  const handleSavedCostClick = () => {
    setIsSavedCostVisible(true);
  };

  const handleHideSavedCostClick = () => {
    setIsSavedCostVisible(false);
  };


  const handleSavedDeliveryClick = () => {
    setIsSavedDeliveryVisible(true);
  };

  const handleHideSavedDeliveryClick = () => {
    setIsSavedDeliveryVisible(false);
  };



  const handleInputKpiClick = () => {
    setIsInputKpiVisible(true);
  };

  const handlehideInputKpiClick = () => {
    setIsInputKpiVisible(false);
  };

  const handleInputAnalysisClick = () => {
    setIsInputAnalysisVisible(true);
  };

  const handlehideInputAnalysisClick = () => {
    setIsInputAnalysisVisible(false);
  };

  const handleInputSummaryClick = () => {
    setIsInputSummaryVisible(true);
  };

  const handlehidesummaryclick = () => {
    setIsInputSummaryVisible(false);
  };

  const handleEditKpiClick = () => {
    setIsEditKpiVisible(true);
  };

  const handlehideEditKpiClick = () => {
    setIsEditKpiVisible(false);
  };

  
  const handleEditAnalysisClick = () => {
    setIsEditAnalysisVisible(true);
  };

  const handlehideAnalysisKpiClick = () => {
    setIsEditAnalysisVisible(false);
  };
  
  const handleEditSummaryClick = () => {
    setIsEditSummaryVisible(true);
  };

  const handlehideEditSummaryClick = () => {
    setIsEditSummaryVisible(false);
  };

  const toggleSidebarHover = () => {
    if (!isSidebarPinned) {
      setIsSidebarHovered(!isSidebarHovered);
    }
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  const toggleSidebarPin = () => {
    setIsSidebarPinned(!isSidebarPinned);
    if (!isSidebarPinned) {
      setIsSidebarHovered(true); // Buka sidebar jika di-pin
    }
  };

  const toggleKPIRotated = () => {
    setKPIRotated(!isKPIRotated);
  };

  const toggleInputRotated = () => {
    setInputRotated(!isInputRotated);
  };

  const toggleAnalysisRotated = () => {
    setAnalysisRotated(!isAnalysisRotated);
  };

  const toggleSummaryRotated = () => {
    setSummaryRotated(!isSummaryRotated);
  };

  useEffect(() => {
    if (activeMenu === "KPI") {
      handleShowChart(); // Panggil handleShowChart saat activeMenu berubah menjadi "KPI"
    }
  }, [activeMenu]);
  
  

  useEffect(() => {
    // Menampilkan top bar ketika activeSubItem adalah Safety, Environment, Quality, Cost, atau Delivery
    if (
      activeSubItem === "Safety" ||
      activeSubItem === "Environment" ||
      activeSubItem === "Quality" ||
      activeSubItem === "Cost" ||
      activeSubItem === "Delivery" ||
      activeSubItem === "Input and Export Table Data" ||
      activeSubItem === "Edit and Upload Table Data" ||
      activeSubItem === "AnalysisInput" ||
      activeSubItem === "AnalysisOutput" ||
      activeSubItem === "SummaryInput" ||
      activeSubItem === "SummaryOutput" 
    ) {
      setTopBarVisible(true);
      setTopBarContent(activeSubItem);
    } else if (
        activeMenu === "KPI" ||
        activeMenu === "People" ||
        activeMenu === "Absensi" ||
        activeMenu === "Input" ||
        activeMenu === "Analysis" ||
        activeMenu === "Summary" 

    ) { // Jika activeMenu adalah KPI dan tidak ada activeSubItem yang dipilih
      setTopBarVisible(true);
      setTopBarContent(activeMenu);
    } else {
      setTopBarVisible(false);
      setTopBarContent("");
    }
  }, [activeMenu, activeSubItem]);
  

  return (
    <div
      className={`app ${
        isSidebarHovered && !isSidebarPinned ? "sidebar-hovered" : ""
      } ${isSidebarPinned ? "sidebar-pinned" : ""}`}
      onMouseEnter={() => {
        if (!isSidebarPinned) {
          setIsSidebarHovered(false); // Set isSidebarHovered to true when mouse enters if sidebar is not pinned
        }
      }}
      onMouseLeave={() => {
        if (!isSidebarPinned) {
          setIsSidebarHovered(false);
        } else {
          setIsSidebarHovered(true); // Tetap bernilai true saat sidebar di-pin
        }
      }}
    >
        {isTopBarVisible && (
          <nav className="nav">
            // JavaScript
            <div
              className={`top-bar slide-in ${
                isSidebarPinned ? "sidebar-pinned" : ""
              } ${isSidebarHovered ? "sidebar-hovered" : ""} ${
                isSidebarHovered && !isSidebarPinned
                  ? "sidebar-hovered-unpinned"
                  : ""
              }`}
            >
              <div

                className={`top-bar-content 
                ${topBarContent === "KPI" ? "top-bar-content0" : ""}
                ${topBarContent === "People" ? "top-bar-content0" : ""}
                ${topBarContent === "Absensi" ? "top-bar-content0" : ""}
                ${topBarContent === "Input" ? "top-bar-content0" : ""}
                ${topBarContent === "Analysis" ? "top-bar-content0" : ""}
                ${topBarContent === "Summary" ? "top-bar-content0" : ""}


                ${topBarContent === "Safety" ? "top-bar-content1" : ""} 
                ${topBarContent === "Environment" ? "top-bar-content2" : ""}
                ${topBarContent === "Quality" ? "top-bar-content3" : ""}
                ${topBarContent === "Cost" ? "top-bar-content4" : ""}
                ${topBarContent === "Delivery" ? "top-bar-content5" : ""}
                ${topBarContent === "AnalysisInput" ? "top-bar-content5" : ""}
                ${topBarContent === "AnalysisOutput" ? "top-bar-content5" : ""}
                ${topBarContent === "SummaryInput" ? "top-bar-content5" : ""}
                ${topBarContent === "SummaryOutput" ? "top-bar-content5" : ""}


                ${topBarContent === "Edit and Upload Table Data"
                    ? "top-bar-content6"
                    : ""
                }${
                  topBarContent === "Input and Export Table Data"
                    ? "top-bar-content6 "
                    : ""
                }`}
              >
                  {(

                    topBarContent === "KPI" ||
                    topBarContent === "People" ||
                    topBarContent === "Absensi" ||
                    topBarContent === "Input" ||
                    topBarContent === "Analysis" ||
                    topBarContent === "Summary" ||

                    topBarContent === "Safety" ||
                    topBarContent === "Environment" ||
                    topBarContent === "Quality" ||
                    topBarContent === "Cost" ||
                    topBarContent === "Delivery" ||
                    topBarContent === "AnalysisInput" ||
                    topBarContent === "AnalysisOutput" ||
                    topBarContent === "SummaryInput" ||
                    topBarContent === "SummaryOutput" ||
                    activeSubItem === "Input and Export Table Data" ||
                    activeSubItem === "Edit and Upload Table Data" 
                  ) && (
                    <>
                      {topBarContent === "KPI" && (
                        <>
                            KPI Chart  
                            <OptionIcon username={username} />

                        </>
                      )}
                    
                    {topBarContent === "Input" && (
                      <>
                          KPI Chart   
                          <OptionIcon username={username} />

                      </>
                    )}

                    {topBarContent === "Analysis" && (
                      <>
                          KPI Chart   
                          <OptionIcon username={username} />

                      </>
                    )}

                  {topBarContent === "AnalysisInput" && (
                    <>
                        Input Project Analysis 
                        <OptionIcon username={username} />

                    </>
                  )}

                  {topBarContent === "AnalysisOutput" && (
                    <>
                        Project Analysis 
                        <OptionIcon username={username} />

                    </>
                  )}

                  {topBarContent === "SummaryInput" && (
                    <>
                        Input Project Summary 
                        <OptionIcon username={username} />

                    </>
                  )}

                  {topBarContent === "Summary" && (
                    <>
                        KPI Chart   
                        <OptionIcon username={username} />

                    </>
                  )}

 

                  {topBarContent === "SummaryOutput" && (
                    <>
                        Project Summary 
                        <OptionIcon username={username} />

                    </>
                  )}

                   {topBarContent === "Safety" && (
                    <>
                      Categories Table
                        <OptionIcon username={username} />

                    </>
                  )}
                  
                  {topBarContent === "Input and Export Table Data" && (
                    <>
                        Input Table Data
                        <OptionIcon username={username} />

                    </>
                  )}
                  {topBarContent === "Edit and Upload Table Data" && (
                    <>
                        Edit and Upload Table Data
                        <OptionIcon username={username} />

                    </>
                  )}
                  
                </>
              )}
            </div>
          </div>
        </nav>
      )}
      <aside className={`sidebar ${isSidebarPinned ? "sidebar-pinned" : ""}`}>
      <div className="logo-container" onClick={handleLogoClick}>
          <img src="Images/brid3.png" alt="Logo" />
          <h2
            className={`logo-text ${
              !isSidebarHovered || isSidebarPinned ? "" : "menu-text-hidden"
            }`}
          >
            BRIDGESTONE
          </h2>
        </div>
        <nav className="nav">
          <ul className="main-menu">
            <li
              className={`menu-item ${isKPIDropdownVisible ? "open" : ""} ${
                activeMenu === "KPI" ? "active" : ""
              }`}
              onClick={() => {
                handleHideSavedSafetyClick();
                handleHideSavedEnvironmentClick();
                handleHideSavedQualityClick();
                handleHideSavedCostClick();
                handleHideSavedDeliveryClick();

                handlehideAnalysisKpiClick();
                handlehideEditSummaryClick();
                handlehideInputAnalysisClick();
                handlehidesummaryclick();
                handlehideEditKpiClick();
                handleShowChart();
                handleHideDragDropFiles();
                handlehideInputKpiClick();
                setKPIDropdownVisible(!isKPIDropdownVisible);
                toggleKPIRotated();
                setActiveMenu("KPI");
                setActiveSubItem(""); // Reset activeSubItem saat menu utama diklik
              }}
            >
              <img src="Images/KPI.png" alt="KPI Icon" className="menu-icon" />
              {/* Tambahkan class menu-text-hidden jika sidebar tidak di-hover */}
              <span
                className={`menu-text ${
                  isSidebarHovered ? "" : "menu-text-hidden"
                }`}
              >
                KPI Dashboard
              </span>
              {/* Tambahkan class dropdown-icon-hidden jika sidebar tidak di-hover */}
              <span
                className={`dropdown-icon rotate-icon ${
                  isKPIDropdownVisible || (isSidebarHovered && !isSidebarPinned)
                    ? "rotated"
                    : ""
                } ${
                  !isSidebarPinned ||
                  (!isSidebarHovered && !isAbsensiDropdownVisible)
                    ? "dropdown-icon-hidden"
                    : ""
                }`}
              >
                &#9658;
              </span>

              <ul
                className={`submenu ${isKPIDropdownVisible ? "show" : ""} ${
                  isSidebarHovered ? "" : "menu-text-hidden"
                }`}
              >
                <li>
                  <a
                    href="#S"
                    className={`${activeSubItem === "Safety" ? "active" : ""} ${
                      isSidebarHovered ? "" : "menu-text-hidden"
                    }`}
                    onClick={(e) => {

                      handleSavedSafetyClick();

                      handleHideSavedEnvironmentClick();
                      handleHideSavedQualityClick();
                      handleHideSavedCostClick();
                      handleHideSavedDeliveryClick();
                      handlehideAnalysisKpiClick();
                      handlehideEditSummaryClick();
                      handlehideInputAnalysisClick();
                      handlehidesummaryclick();
                      handleHideDragDropFiles();
                      handlehideEditKpiClick();
                      handleHideChart();
                      handlehideInputKpiClick();
                      e.preventDefault();
                      setActiveSubItem("Safety");
                      stopPropagation(e);
                    }}
                  >
                    ‣ All Categories Table 
                  </a>
                </li>
                <li>
                  <a
                    href="#Input and Export Table Data"
                    className={`${
                      activeSubItem === "Input and Export Table Data"
                        ? "active"
                        : ""
                    } ${isSidebarHovered ? "" : "menu-text-hidden"}`}
                    onClick={(e) => {
                      handleHideSavedSafetyClick();
                      handleHideSavedEnvironmentClick();
                      handleHideSavedQualityClick();
                      handleHideSavedCostClick();
                      handleHideSavedDeliveryClick();
                      handlehideAnalysisKpiClick();
                      handlehideEditSummaryClick();
                      handlehideInputAnalysisClick();
                      handlehidesummaryclick();
                      handlehideEditKpiClick();
                      handleInputKpiClick();
                      handleHideDragDropFiles();
                      handleHideChart();
                      e.preventDefault();
                      setActiveSubItem("Input and Export Table Data");
                      stopPropagation(e);
                    }}
                  >
                    ‣ Input Table Data
                  </a>
                </li>
                 
                 
               
              </ul>
            </li>
           
            
            <li
              className={`menu-item ${isAnalysisDropdownVisible ? "open" : ""} ${
                activeMenu === "Analysis" ? "active" : ""
              }`}
              onClick={() => {
                handleHideSavedSafetyClick();
                handleHideSavedEnvironmentClick();
                handleHideSavedQualityClick();
                handleHideSavedCostClick();
                handleHideSavedDeliveryClick();
                handlehideAnalysisKpiClick();
                handlehideEditSummaryClick();
                handlehideInputAnalysisClick();
                handlehidesummaryclick();
                handlehideEditKpiClick();
                handleShowChart();
                handleHideDragDropFiles();
                handlehideInputKpiClick();
                setAnalysisDropdownVisible(!isAnalysisDropdownVisible);
                toggleAnalysisRotated();
                setActiveMenu("Analysis");
                setActiveSubItem(""); // Reset activeSubItem saat menu utama diklik
              }}
            >
              <img src="Images/analysis.png" alt="analysis Icon" className="menu-icon" />
              {/* Tambahkan class menu-text-hidden jika sidebar tidak di-hover */}
              <span
                className={`menu-text ${
                  isSidebarHovered ? "" : "menu-text-hidden"
                }`}
              >
                Project Analysis
              </span>
              {/* Tambahkan class dropdown-icon-hidden jika sidebar tidak di-hover */}
              <span
                className={`dropdown-icon rotate-icon ${
                  isAnalysisDropdownVisible || (isSidebarHovered && !isSidebarPinned)
                    ? "rotated"
                    : ""
                } ${
                  !isSidebarPinned ||
                  (!isSidebarHovered && !isAbsensiDropdownVisible)
                    ? "dropdown-icon-hidden"
                    : ""
                }`}
              >
                &#9658;
              </span>

              <ul
                className={`submenu ${isAnalysisDropdownVisible ? "show" : ""} ${
                  isSidebarHovered ? "" : "menu-text-hidden"
                }`}
              >
                <li>
                  <a
                    href="#AnalysisOutput"
                    className={`${
                      activeSubItem === "AnalysisOutput" ? "active" : ""
                    } ${isSidebarHovered ? "" : "menu-text-hidden"}`}
                    onClick={(e) => {
                      handleHideSavedSafetyClick();
                      handleHideSavedEnvironmentClick();
                      handleHideSavedQualityClick();
                      handleHideSavedCostClick();
                      handleHideSavedDeliveryClick();
                      handleEditAnalysisClick();
                      handlehideEditSummaryClick();
                      handlehideInputAnalysisClick();
                      handlehidesummaryclick();
                      handlehideEditKpiClick();
                      handleHideChart();
                      handleHideDragDropFiles();
                      handlehideInputKpiClick();
                      e.preventDefault();
                      setActiveSubItem("AnalysisOutput");
                      stopPropagation(e);
                    }}
                  >
                    ‣ All Project Analysis
                  </a>
                </li>
                <li>
                  <a
                    href="#AnalysisInput"
                    className={`${activeSubItem === "AnalysisInput" ? "active" : ""} ${
                      isSidebarHovered ? "" : "menu-text-hidden"
                    }`}
                    onClick={(e) => {
                      handleHideSavedSafetyClick();
                      handleHideSavedEnvironmentClick();
                      handleHideSavedQualityClick();
                      handleHideSavedCostClick();
                      handleHideSavedDeliveryClick();
                      handlehideAnalysisKpiClick();
                      handlehideEditSummaryClick();
                      handleInputAnalysisClick();
                      handlehidesummaryclick();
                      handleHideDragDropFiles();
                      handlehideEditKpiClick();
                      handleHideChart();
                      handlehideInputKpiClick();
                      e.preventDefault();
                      setActiveSubItem("AnalysisInput");
                      stopPropagation(e);
                    }}
                  >
                    ‣ Input Project Analysis
                  </a>
                </li>
                
              </ul>
            </li>
            <li
              className={`menu-item ${isSummaryDropdownVisible ? "open" : ""} ${
                activeMenu === "Summary" ? "active" : ""
              }`}
              onClick={() => {
                handleHideSavedSafetyClick();
                handleHideSavedEnvironmentClick();
                handleHideSavedQualityClick();
                handleHideSavedCostClick();
                handleHideSavedDeliveryClick();
                handlehideAnalysisKpiClick();
                handlehideEditSummaryClick();
                handlehideInputAnalysisClick();
                handlehidesummaryclick();
                handlehideEditKpiClick();
                handleShowChart();
                handleHideDragDropFiles();
                handlehideInputKpiClick();
                setSummaryDropdownVisible(!isSummaryDropdownVisible);
                toggleSummaryRotated();
                setActiveMenu("Summary");
                setActiveSubItem(""); // Reset activeSubItem saat menu utama diklik
              }}
            >
              <img src="Images/summary.png" alt="Summary Icon" className="menu-icon" />
              {/* Tambahkan class menu-text-hidden jika sidebar tidak di-hover */}
              <span
                className={`menu-text ${
                  isSidebarHovered ? "" : "menu-text-hidden"
                }`}
              >
                 Project Summary
              </span>
              {/* Tambahkan class dropdown-icon-hidden jika sidebar tidak di-hover */}
              <span
                className={`dropdown-icon rotate-icon ${
                  isSummaryDropdownVisible || (isSidebarHovered && !isSidebarPinned)
                    ? "rotated"
                    : ""
                } ${
                  !isSidebarPinned ||
                  (!isSidebarHovered && !isAbsensiDropdownVisible)
                    ? "dropdown-icon-hidden"
                    : ""
                }`}
              >
                &#9658;
              </span>

              <ul
                className={`submenu ${isSummaryDropdownVisible ? "show" : ""} ${
                  isSidebarHovered ? "" : "menu-text-hidden"
                }`}
              >
                <li>
                  <a
                    href="#SummaryOutput"
                    className={`${
                      activeSubItem === "SummaryOutput" ? "active" : ""
                    } ${isSidebarHovered ? "" : "menu-text-hidden"}`}
                    onClick={(e) => {
                      handleHideSavedSafetyClick();
                      handleHideSavedEnvironmentClick();
                      handleHideSavedQualityClick();
                      handleHideSavedCostClick();
                      handleHideSavedDeliveryClick();
                      handlehideAnalysisKpiClick();
                      handleEditSummaryClick();
                      handlehideInputAnalysisClick();
                      handlehidesummaryclick();
                      handlehideEditKpiClick();
                      handleHideChart();
                      handleHideDragDropFiles();
                      handlehideInputKpiClick();
                      e.preventDefault();
                      setActiveSubItem("SummaryOutput");
                      stopPropagation(e);
                    }}
                  >
                    ‣ All Project Summary
                  </a>
                </li>
                <li>
                  <a
                    href="#SummaryInput"
                    className={`${activeSubItem === "SummaryInput" ? "active" : ""} ${
                      isSidebarHovered ? "" : "menu-text-hidden"
                    }`}
                    onClick={(e) => {
                      handleHideSavedSafetyClick();
                      handleHideSavedEnvironmentClick();
                      handleHideSavedQualityClick();
                      handleHideSavedCostClick();
                      handleHideSavedDeliveryClick();
                      handlehideAnalysisKpiClick();
                      handlehideEditSummaryClick();
                      handlehideInputAnalysisClick();
                      handleInputSummaryClick();
                      handleHideDragDropFiles();
                      handlehideEditKpiClick();
                      handleHideChart();
                      handlehideInputKpiClick();
                      e.preventDefault();
                      setActiveSubItem("SummaryInput");
                      stopPropagation(e);
                    }}
                  >
                    ‣ Input Project Summary
                  </a>
                </li>
                
              </ul>
            </li>
        </ul>
        
        </nav>

        <div className={`logosidebar ${isSidebarHovered ? "" : "logo-icon-hidden"}`}>
        <img src="Images/kpisidebar.png" alt="Logo" />
      </div>

      </aside>
      {isInputKpiVisible && <InputTable />}
      {isInputAnalysisVisible && <AnalysisTableInput />}
      {isInputSummaryVisible && <SummaryInputTable />}
 
      {isEditAnalysisVisible && <TemplateTable2 />}
      {isEditSummaryVisible && <TemplateTable3 />}

      {isSavedSafetyVisible && <SavedTable1 />}
 



      {isDragDropVisible && <DragDropFiles />}
      {isChartVisible && <Chart chartSize={chartSize} />}{" "}
      {/* {isChartVisible && <ChartComponent3 chartSize3={chartSize3} />}          */}
      {/* {isChartVisible && <ChartComponent2 chartSize2={chartSize2} />}     */}
      {/* {isChartVisible && <ChartComponent5 chartSize5={chartSize5} />}         
      {isChartVisible && <ChartComponent4 chartSize4={chartSize4} />}          */}

      <footer className="app-footer">
        <img src="Images/Bridgestone.png" alt="Logo" className="footer-logo" />
        <p>
          &copy; {new Date().getFullYear()} Bridgestone Tire. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}

export default Dashboard;
