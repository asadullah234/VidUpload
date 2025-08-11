import React, { useState,useEffect,useContext } from "react";
import "./Feed.css";
import { Link } from "react-router-dom";
import { API_KEY } from "../../data";
import { VideoContext } from "../../context/VideoContext";
 
const Feed = ({ category, data: propData, isSearchResults }) => {
    const { videos } = useContext(VideoContext);
    const [internalData, setInternalData] = useState([]);
    
    const fetchData = async () => {
        try {
            const videoList_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=50&regionCode=US&videoCategoryId=${category}&key=${API_KEY}`;
            const response = await fetch(videoList_url);
            const result = await response.json();
            setInternalData(result.items || []);
        } catch (error) {
            console.error("Error fetching YouTube data:", error);
            setInternalData([]);
        }
    };

    useEffect(() => {
        if (!isSearchResults) {
            fetchData();
        }
        
    }, [category, isSearchResults]);

    // Use propData if provided (for search results), otherwise use internalData
    const youtubeData = isSearchResults ? (propData || []) : internalData;

    // Format view count for display
    const formatViewCount = (count) => {
        if (!count) return '0';
        const num = parseInt(count);
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    };

    // Calculate time ago from publishedAt
    const getTimeAgo = (publishedAt) => {
        if (!publishedAt) return 'Just uploaded';
        const now = new Date();
        const published = new Date(publishedAt);
        const diffInHours = Math.floor((now - published) / (1000 * 60 * 60));
        
        if (diffInHours < 24) {
            return `${diffInHours} hours ago`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays} days ago`;
        }
    };

    // Combine YouTube API data with locally uploaded videos
    const allVideos = [
        ...videos.map(v => ({
            id: v.id,
            snippet: {
                thumbnails: { 
                    medium: { 
                        url: v.thumbnail || '/path/to/default-thumbnail.jpg'
                    } 
                },
                title: v.title,
                channelTitle: v.channel || 'Unknown Channel',
                publishedAt: v.timestamp || new Date().toISOString(),
                categoryId: 'uploaded'
            },
            statistics: {
                viewCount: v.views || '0'
            },
            isUploaded: true
        })),
        ...youtubeData.map(item => ({
            ...item,
            isUploaded: false
        }))
    ];

    return (
        <div className="feed">
            {allVideos.map((item, index) => {
                const thumbnailUrl = item.snippet?.thumbnails?.medium?.url || 
                                   item.snippet?.thumbnails?.default?.url || 
                                   '/path/to/default-thumbnail.jpg';

                return (
                    <Link
                        to={`/video/${item.id}`}
                        className="card"
                        key={`${item.id}-${index}`}
                    >
                        <img
                            src={thumbnailUrl}
                            alt={item.snippet?.title || 'Video thumbnail'}
                            onError={(e) => {
                                e.target.src = '/path/to/default-thumbnail.jpg';
                            }}
                        />
                        <h2>{item.snippet?.title || 'Untitled Video'}</h2>
                        <h3>{item.snippet?.channelTitle || 'Unknown Channel'}</h3>
                        <p>
                            {formatViewCount(item.statistics?.viewCount)} views • {' '}
                            {item.isUploaded ? 'Just uploaded' : getTimeAgo(item.snippet?.publishedAt)}
                        </p>
                    </Link>
                );
            })}
        </div>
    );
};

export default Feed;