import React, { useContext, useEffect, useState } from "react";
import "./Video.css";
import Recommended from "../../components/Recommended/Recommended";
import Play from "../../components/Playvideo/Play";
import { useParams } from "react-router-dom";
import { VideoContext } from "../../context/VideoContext";

const Video = () => {
    const { videos } = useContext(VideoContext);
    const { videoId } = useParams();

    const [videoUrl, setVideoUrl] = useState(null);
    const [liked, setLiked] = useState(false);

    // Find uploaded video
    const uploadedVideo = videos.find(video => video.id === videoId);
    const categoryId = uploadedVideo ? "uploaded" : "0";

    // Create blob URL for uploaded videos
    useEffect(() => {
        if (uploadedVideo && uploadedVideo.videoFile instanceof File) {
            const url = URL.createObjectURL(uploadedVideo.videoFile);
            setVideoUrl(url);
            return () => URL.revokeObjectURL(url);
        } else if (uploadedVideo && uploadedVideo.videoUrl) {
            setVideoUrl(uploadedVideo.videoUrl); // fallback to stored URL
        }
    }, [uploadedVideo]);

    const handleVideoError = () => {
        console.error("Error playing uploaded video.");
        if (uploadedVideo?.videoFile instanceof File) {
            const newUrl = URL.createObjectURL(uploadedVideo.videoFile);
            setVideoUrl(newUrl);
        }
    };

    const handleLike = () => setLiked(prev => !prev);

    return (
        <div className="play-container">
            {uploadedVideo ? (
                <div className="uploaded-video-player">
                    <video
                        controls
                        muted
                        autoPlay
                        style={{ width: "100%" }}
                        preload="auto"
                        onError={handleVideoError}
                        key={videoUrl} // refresh player if URL changes
                        src={videoUrl}
                    />
                    <div className="video-info">
                        <h2>{uploadedVideo.title}</h2>
                        <p>
                            {uploadedVideo.views} views • {uploadedVideo.timestamp}
                        </p>
                        <p>{uploadedVideo.description}</p>
                        <button
                            onClick={handleLike}
                            className={`liked-one ${liked ? "liked" : ""}`}
                        >
                            {liked ? "Unlike" : "Like"}
                        </button>
                    </div>
                </div>
            ) : (
                <Play videoId={videoId} />
            )}
            <Recommended categoryId={categoryId} />
        </div>
    );
};

export default Video;
