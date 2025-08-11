import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import Feed from "../../components/Feed/Feed";
import { API_KEY } from "../../data";
import { VideoContext } from "../../context/VideoContext";

const SearchFeed = () => {
  const { searchQuery } = useParams();
  const { videos } = useContext(VideoContext);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Search YouTube API
        const searchUrl = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=${encodeURIComponent(searchQuery)}&key=${API_KEY}`;
        const response = await fetch(searchUrl);
        
        if (!response.ok) {
          throw new Error(`YouTube API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Get video details for each search result
        const videoIds = data.items.map(item => item.id.videoId).join(',');
        const detailsUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoIds}&key=${API_KEY}`;
        const detailsResponse = await fetch(detailsUrl);
        const detailsData = await detailsResponse.json();
        
        setSearchResults(detailsData.items || []);
      } catch (err) {
        console.error("Search error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) {
      fetchSearchResults();
    }
  }, [searchQuery]);

  // Filter local videos that match search query
  const filteredLocalVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.channel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Combine search results
  const allResults = [
    ...filteredLocalVideos.map(v => ({
      id: v.id,
      snippet: {
        thumbnails: { medium: { url: v.thumbnail } },
        title: v.title,
        channelTitle: v.channel,
        publishedAt: v.timestamp,
        categoryId: 'uploaded'
      },
      statistics: {
        viewCount: v.views
      },
      isUploaded: true
    })),
    ...searchResults.map(item => ({
      ...item,
      isUploaded: false
    }))
  ];

  if (loading) return <div className="loading">Searching videos...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div>
      <h2 className="search-results-title">Search Results for "{searchQuery}"</h2>
      <Feed data={allResults} isSearchResults />
    </div>
  );
};

export default SearchFeed;