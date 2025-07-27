// VideoContext.js
import React, { createContext, useState, useEffect } from 'react';

export const VideoContext = createContext();

export const VideoProvider = ({ children }) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const savedVideos = JSON.parse(localStorage.getItem('videos') || '[]');
    setVideos(savedVideos);
  }, []);

  const addVideo = (video) => {
    const updatedVideos = [...videos, video];
    setVideos(updatedVideos);
    localStorage.setItem('videos', JSON.stringify(updatedVideos));
  };

  return (
    <VideoContext.Provider value={{ videos, addVideo }}>
      {children}
    </VideoContext.Provider>
  );
};