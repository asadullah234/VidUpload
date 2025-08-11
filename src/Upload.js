import "./Upload.css";
import React, { useState, useContext } from "react";
import thumbnail from "./assets/thumbnail1.png";
import { useNavigate } from 'react-router-dom';
import { VideoContext } from "./context/VideoContext";

const Upload = () => {
  const [video, setVideo] = useState(null);
  const [thumbnailImg, setThumbnailImg] = useState(thumbnail);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const { addVideo } = useContext(VideoContext);

  const handleVideoChange = (e) => {
    e.preventDefault();
    setVideo(e.target.files[0]);
  };

  const handleThumbnailChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!video) {
      alert("Please select a video file");
      return;
    }

    // Use the original file directly - don't create a new Blob
    const videoUrl = URL.createObjectURL(video);
    
    const newVideo = {
      id: Date.now().toString(),
      title,
      description,
      videoUrl: videoUrl, // Direct blob URL from original file
      videoFile: video, // Store the actual file object
      thumbnail: thumbnailImg,
      channel: "You",
      views: "0",
      timestamp: new Date().toLocaleDateString()
    };

    // Add video using context
    addVideo(newVideo);
    
    navigate("/"); // Redirect to home after upload
  };

  return (
    <div className="upload-container">
      <h2>Upload Video</h2>
      <form onSubmit={handleSubmit}>
        <div className="upload-section">
          <div className="video-upload">
            <label htmlFor="video-upload" className="upload-box">
              {video ? (
                <video controls src={URL.createObjectURL(video)} />
              ) : (
                <div>
                  <p>Select video to upload</p>
                  <p>MP4 or WebM</p>
                </div>
              )}
            </label>
            <input
              id="video-upload"
              type="file"
              accept="video/mp4,video/webm,video/avi,video/mov"
              onChange={handleVideoChange}
              required
            />
          </div>

          <div className="details-section">
            <div className="thumbnail-upload">
              <label htmlFor="thumbnail-upload">
                <p>Thumbnail</p>
                <img src={thumbnailImg} alt="Thumbnail preview" />
              </label>
              <input
                id="thumbnail-upload"
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
              />
            </div>

            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add a title"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell viewers about your video"
              />
            </div>

            <button type="submit" className="upload-btn">
              Upload
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Upload;