import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import menu_icon from "../../assets/menu.png";
import logo from "../../assets/logo.png";
import upload_icon from "../../assets/upload.png";
import profile_icon from "../../assets/user_profile.jpg";
import notification_icon from "../../assets/notification.png";
import more_icon from "../../assets/more.png";
import search_icon from "../../assets/search.png";
import { ThemeContext } from "../../context/ThemeContext";
import moon_icon from "../../assets/moon.png";
import sun_icon from "../../assets/sun.png";

const Navbar = ({ setSidebar }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="flex-div">
      <div className="nav-left flex-div">
        <img
          className="menu_icon"
          onClick={() => setSidebar((prev) => !prev)}
          src={menu_icon}
          alt=""
        />
        <Link to="/">
          <img className="logo" src={logo} alt=" " />
        </Link>
      </div>
      <div className="nav-middle flex-div">
        <form onSubmit={handleSearch} className="search-box flex-div">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">
            <img src={search_icon} alt="Search" />
          </button>
        </form>
      </div>
      <div className="nav-right flex-div">
        <button className="theme-toggle" onClick={toggleTheme}>
          <img 
            src={darkMode ? sun_icon : moon_icon} 
            alt={darkMode ? "Light Mode" : "Dark Mode"} 
          />
        </button>
        <Link to="/upload">
          <img src={upload_icon} alt="Upload" />
        </Link>
        <img src={more_icon} alt="" />
        <img src={notification_icon} alt="" />
        <img src={profile_icon} className="user_icon" alt=" " />
      </div>
    </nav>
  );
};

export default Navbar;