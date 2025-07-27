import React,{useState} from "react";
import './App.css';
import Sidebar from"../src/components/Sidebar/Sidebar";
import { VideoProvider } from './context/VideoContext';
  
import Upload from "./Upload";
import Navbar from "../src/components/Navbar/Navbar";
import { Routes, Route } from 'react-router-dom';
import Home from "../src/Pages/Home/Home";
import Video from "./Pages/Video/Video";
function App() {
  const[sidebar,setSidebar]=useState(true);

  return (
    <div className="App">
      <VideoProvider>
    <Navbar setSidebar={setSidebar}/>
    <Routes>
      <Route path="/" element={<Home sidebar={sidebar}/>} />
      <Route path="/video/:categoryId/:videoId" element={<Video/>}/>
     <Route path="/upload" element={<Upload />} />
    </Routes>
    </VideoProvider>
    </div>
  );
}

export default App;
