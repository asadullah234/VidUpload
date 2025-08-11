import React, { useState } from "react";
import './App.css';
import Sidebar from "../src/components/Sidebar/Sidebar";
import { VideoProvider } from './context/VideoContext';
import { ThemeProvider } from './context/ThemeContext'; // Add this import
import Upload from "./Upload";
import Navbar from "../src/components/Navbar/Navbar";
import { Routes, Route } from 'react-router-dom';
import Home from "../src/Pages/Home/Home";
import Video from "./Pages/Video/Video";
import SearchFeed from "./components/SearchFeed/SearchFeed";

function App() {
  const [sidebar, setSidebar] = useState(true);

  return (
    <div className="App">
      <ThemeProvider>
        <VideoProvider>
          <Navbar setSidebar={setSidebar}/>
          <Routes>
            <Route path="/" element={<Home sidebar={sidebar}/>} />
            <Route path="/video/:videoId" element={<Video/>}/>
            <Route path="/upload" element={<Upload />} />
            <Route path="/search/:searchQuery" element={<SearchFeed />} />
          </Routes>
        </VideoProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;