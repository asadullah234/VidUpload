import React, { useState, useEffect, useContext } from "react";
import "./Feed.css";
import thumbnail1 from "../../assets/thumbnail1.png";
import thumbnail2 from "../../assets/thumbnail2.png";
import thumbnail3 from "../../assets/thumbnail3.png";
import thumbnail4 from "../../assets/thumbnail4.png";
import thumbnail5 from "../../assets/thumbnail5.png";
import thumbnail6 from "../../assets/thumbnail6.png";
import thumbnail7 from "../../assets/thumbnail7.png";

import thumbnail8 from "../../assets/thumbnail8.png";
import { Link } from "react-router-dom";
import { API_KEY } from "../../data";
import { VideoContext } from "../../context/VideoContext"; // Add this import

const Feed = ({ category }) => {
    const { videos } = useContext(VideoContext); // Now using the context
    const [data, setData] = useState([]);
    
    const fetchData = async () => {
        const videoList_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=50&regionCode=US&videoCategoryId=${category}&key=${API_KEY}`;
        await fetch(videoList_url)
            .then(response => response.json())
            .then(data => setData(data.items));
    };

    useEffect(() => {
        fetchData();
    }, [category]);

    // Combine YouTube API data with locally uploaded videos
    const allVideos = [
        ...videos.map(v => ({
            id: v.id,
            snippet: {
                thumbnails: { medium: { url: v.thumbnail } },
                title: v.title,
                channelTitle: v.channel,
                categoryId: 'uploaded' // Custom category for uploaded videos
            },
            statistics: {
                viewCount: v.views
            }
        })),
        ...data
    ];

    return (
        <div className="feed">
            {allVideos.map((item, index) => {
                return (
                    <Link 
                        to={`/video/${item.id}`} 
                        className="card" 
                        key={item.id}
                    >
                        <img 
                            src={item.snippet.thumbnails.medium.url} 
                            alt={item.snippet.title} 
                        />
                        <h2>{item.snippet.title}</h2>
                        <h3>{item.snippet.channelTitle}</h3>
                        <p>
                            {item.statistics?.viewCount || '0'} views • 
                            {item.snippet?.publishedAt ? ' 2 days ago' : ' Just uploaded'}
                        </p>
                    </Link>
                );
            })}
        </div>
    );
};

export default Feed;