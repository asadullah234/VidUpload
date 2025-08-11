import React, { useEffect, useState } from "react";
import "./Play.css";
import { API_KEY } from "../../data";

const Play = ({ videoId, uploadedVideo }) => {
    const [apiData, setApiData] = useState(null);
    const [channelData, setChannelData] = useState(null);
    const [commentData, setCommentData] = useState([]);
    const [liked, setLiked] = useState(false);
    const [videoUrl, setVideoUrl] = useState(null);

    // Create blob URL if uploaded video exists
    useEffect(() => {
        if (uploadedVideo?.videoFile instanceof File) {
            const url = URL.createObjectURL(uploadedVideo.videoFile);
            setVideoUrl(url);
            return () => URL.revokeObjectURL(url);
        } else if (uploadedVideo?.videoUrl) {
            setVideoUrl(uploadedVideo.videoUrl);
        }
    }, [uploadedVideo]);

    // Fetch video data for YouTube videos
    const fetchVideoData = async () => {
        if (!videoId || uploadedVideo) return;

        try {
            const videoDetailsUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${API_KEY}`;
            const res = await fetch(videoDetailsUrl);
            const data = await res.json();
            setApiData(data.items[0]);
        } catch (err) {
            console.error("Error fetching video data:", err);
        }
    };

    // Fetch channel and comments data for YouTube videos
    const fetchOtherData = async () => {
        if (!apiData || uploadedVideo) return;

        try {
            const channelUrl = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
            const channelRes = await fetch(channelUrl);
            const channelResult = await channelRes.json();
            setChannelData(channelResult.items[0]);

            const commentsUrl = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&maxResults=50&videoId=${videoId}&key=${API_KEY}`;
            const commentRes = await fetch(commentsUrl);
            const commentResult = await commentRes.json();
            setCommentData(commentResult.items || []);
        } catch (err) {
            console.error("Error fetching extra data:", err);
        }
    };

    useEffect(() => {
        fetchVideoData();
    }, [videoId]);

    useEffect(() => {
        fetchOtherData();
    }, [apiData]);

    const formatViewCount = (count) => {
        if (!count) return "0";
        const num = parseInt(count);
        if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
        if (num >= 1000) return (num / 1000).toFixed(1) + "K";
        return num.toString();
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="play-video">
            {/* Video Player */}
            <div className="video-player">
                {uploadedVideo ? (
                    <video
                        src={videoUrl}
                        controls
                        muted
                        autoPlay
                        style={{ width: "100%", height: "400px" }}
                        onError={() => {
                            console.error("Error playing uploaded video.");
                            if (uploadedVideo?.videoFile instanceof File) {
                                const newUrl = URL.createObjectURL(uploadedVideo.videoFile);
                                setVideoUrl(newUrl);
                            }
                        }}
                    />
                ) : (
                    apiData && (
                        <iframe
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            title={apiData.snippet.title}
                            style={{ width: "100%", height: "400px" }}
                        ></iframe>
                    )
                )}
            </div>

            {/* Video Information */}
            <div className="play-video-info">
                <h3>{uploadedVideo ? uploadedVideo.title : apiData?.snippet?.title}</h3>
                <div className="play-video-info-stats">
                    <p>
                        {uploadedVideo
                            ? `${uploadedVideo.views} views • ${uploadedVideo.timestamp}`
                            : `${formatViewCount(apiData?.statistics?.viewCount)} views • ${formatDate(apiData?.snippet?.publishedAt)}`}
                    </p>
                    <div className="stats">
                        <button
                            onClick={() => setLiked(!liked)}
                            className={`like-btn ${liked ? "liked" : ""}`}
                        >
                            👍 {liked ? "Liked" : "Like"}
                        </button>
                        {!uploadedVideo && (
                            <span>💬 {formatViewCount(apiData?.statistics?.commentCount)}</span>
                        )}
                    </div>
                </div>

                {/* Channel Info (YouTube only) */}
                {!uploadedVideo && channelData && (
                    <div className="channel-info">
                        <img
                            src={channelData.snippet.thumbnails.default.url}
                            alt={channelData.snippet.title}
                        />
                        <div>
                            <h4>{channelData.snippet.title}</h4>
                            <p>
                                {formatViewCount(channelData.statistics.subscriberCount)} subscribers
                            </p>
                        </div>
                    </div>
                )}

                <div className="video-description">
                    <p>{uploadedVideo ? uploadedVideo.description : apiData?.snippet?.description}</p>
                </div>
            </div>

            {/* Comments Section (YouTube only) */}
            {!uploadedVideo && (
                <div className="comments-section">
                    <h4>{formatViewCount(apiData?.statistics?.commentCount)} Comments</h4>
                    {commentData.map((item, index) => (
                        <div key={index} className="comment">
                            <img
                                src={item.snippet.topLevelComment.snippet.authorProfileImageUrl}
                                alt={item.snippet.topLevelComment.snippet.authorDisplayName}
                            />
                            <div>
                                <h5>{item.snippet.topLevelComment.snippet.authorDisplayName}</h5>
                                <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
                                <div className="comment-stats">
                                    <span>👍 {item.snippet.topLevelComment.snippet.likeCount}</span>
                                    <span>{formatDate(item.snippet.topLevelComment.snippet.publishedAt)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Play;
