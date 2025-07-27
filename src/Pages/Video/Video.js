
import React, { useContext } from "react";
import "./Video.css";
import Recommended from "../../components/Recommended/Recommended";
import Play from "../../components/Playvideo/Play";
import { useParams } from "react-router-dom";
import { VideoContext } from "../../context/VideoContext"; // Import the context

const Video = () => {
    const { videoId, categoryId } = useParams();
    const { videos } = useContext(VideoContext); // Get uploaded videos from context

    // Check if this is an uploaded video
    const uploadedVideo = videos.find(video => video.id === videoId);

    return (
        <div className="play-container">
            {uploadedVideo ? (
                // Show uploaded video player
                <div className="uploaded-video-player">
                    <video controls autoPlay style={{ width: "100%" }}>
                        <source src={uploadedVideo.videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    <div className="video-info">
                        <h2>{uploadedVideo.title}</h2>
                        <p>{uploadedVideo.views} views • {uploadedVideo.timestamp}</p>
                        <p>{uploadedVideo.description}</p>
                    </div>
                </div>
            ) : (
                // Show regular YouTube player
                <Play videoId={videoId} />
            )}
            <Recommended categoryId={categoryId} />
        </div>
    );
};

export default Video;