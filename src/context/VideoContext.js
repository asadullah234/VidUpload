import React, { createContext, useState, useEffect } from 'react';

export const VideoContext = createContext();

export const VideoProvider = ({ children }) => {
  const [videos, setVideos] = useState([]);

  // Load videos from memory only (not localStorage since blob URLs don't persist)
  useEffect(() => {
    // Initialize with empty array - uploaded videos will only exist in current session
    setVideos([]);
  }, []);

  const addVideo = (video) => {
    console.log("Adding video:", video); // Debug log
    
    const updatedVideos = [...videos, video];
    setVideos(updatedVideos);
    
    // Note: We're not saving to localStorage since blob URLs don't persist
    // In a real app, you'd upload to a server and get back a permanent URL
  };

  // Function to get a fresh blob URL for a video
  const getVideoUrl = (videoId) => {
    const video = videos.find(v => v.id === videoId);
    if (video && video.videoFile) {
      return URL.createObjectURL(video.videoFile);
    }
    return video?.videoUrl;
  };

  return (
    <VideoContext.Provider value={{ videos, addVideo, getVideoUrl }}>
      {children}
    </VideoContext.Provider>
  );
};