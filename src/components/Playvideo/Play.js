import React, { useState,useEffect } from "react";
import "./Play.css";
import { valueConverter } from "../../data";
import video1 from "../../assets/video.mp4";
import like from "../../assets/like.png";
import dislike from "../../assets/dislike.png";
import share from "../../assets/share.png";
import save from "../../assets/jack.png";
import user_profile from "../../assets/user_profile.jpg";
import jack from "../../assets/jack.png";
import { API_KEY } from "../../data";

const PlayVideo = ({videoId}) => {
    
    const[apiData,setApiData]=useState(null)
   
    const fetchVideoData=async()=>{
        const videoDetails_url=`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`
   
   await fetch(videoDetails_url).then(res=>res.json()).then(data=>setApiData(data.items[0]))
   
}
useEffect(()=>{
fetchVideoData();
},[videoId])   
    return (

    

        <div className="play-video">
            {/*
            <video src={video.snippet.url} controls autoPlay muted></video>
            */}
       <iframe 
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`}
                frameBorder="0"
                allowFullScreen
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
            <h3>{apiData?apiData.snippet.title:"Title Here"}</h3>
            <div className="play-video-info">
                <p>{apiData?valueConverter(apiData.statistics.viewCount):"16k"} views &bull; </p>
                <div>
                    <span>
                        <img src={like} alt="" />
                        {apiData?valueConverter(apiData.statistics.likeCount):155}
                    </span>
                    <span>
                        <img src={dislike} alt="" />
                        {apiData?apiData.statistics.dislikeCount:2}
                    </span>
                    <span>
                        <img src={share} alt="" />
                        Share
                    </span>
                    <span>
                        <img src={save} alt="" />
                        Save
                    </span>
                </div>
            </div>
            <hr />
            <div className="publisher">
                <img src={jack} alt="" />
                <div>
                    <p>Greatstack</p>
                    <span>1M subscribers</span>
                </div>
                <button>Subscribe</button>
            </div>
            <div className="vid-description">

                
                <p>Channel that makes learning Easy</p>
                <p>Subscribe Greatstack</p>
                <hr/>
                <h4>130 comments</h4>
                <div className="comment">
                    <img src={user_profile} alt=" " />
                    <div>
                        <h3>Jack Nicholson</h3>
                        <span>1 day ago</span>
                        <p>hello</p>
                        <div className="comment-action">
                            <img src={like} alt="" />
                            <span>244</span>
                            <img src={dislike} alt=" "/>

                        </div>
                    </div>
                </div>
                     <div className="comment">
                    <img src={user_profile} alt=" " />
                    <div>
                        <h3>Jack Nicholson</h3>
                        <span>1 day ago</span>
                        <p>hello</p>
                        <div className="comment-action">
                            <img src={like} alt="" />
                            <span>244</span>
                            <img src={dislike} alt=" "/>
                            
                        </div>
                    </div>
                </div>
                     <div className="comment">
                    <img src={user_profile} alt=" " />
                    <div>
                        <h3>Jack Nicholson</h3>
                        <span>1 day ago</span>
                        <p>hello</p>
                        <div className="comment-action">
                            <img src={like} alt="" />
                            <span>244</span>
                            <img src={dislike} alt=" "/>
                            
                        </div>
                    </div>
                </div>
                     <div className="comment">
                    <img src={user_profile} alt=" " />
                    <div>
                        <h3>Jack Nicholson</h3>
                        <span>1 day ago</span>
                        <p>hello</p>
                        <div className="comment-action">
                            <img src={like} alt="" />
                            <span>244</span>
                            <img src={dislike} alt=" "/>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlayVideo;