import React from 'react'

import {  TwitterTweetEmbed  } from 'react-twitter-embed';

import axios from '../api/api'
import Navbar from './Navbar'
import '../css/TweetsTimeline.css'
import Entities from './Entities'
import { Redirect } from 'react-router-dom'

class TweetsTimeline extends React.Component {

    state = {
                summary: null, 
                tweets: [], 
                videos: [], 
                seen: 'tweets', 
                entity:[],
                spinner: true
            }

    async componentDidMount() {

        
        const {id} = this.props.match.params;
        
        console.log('id', id)
        const response = await axios.get(`/tweet?id=${id}`)
        const response2 = await axios.get(`/video?id=${id}`)
        const response3 = await axios.get(`/entity?id=${id}`)
        
       
        this.setState( 
                {
                    summary: this.props.location.state, 
                    tweets: response.data, 
                    videos:response2.data, 
                    entity: response3.data,
                    spinner:false
                } 
            )
     
    }

    renderVideos() {

        
        return (
            
            this.state.videos.map( (data, i) => {
                const code = data.URL.split("https://www.youtube.com/watch?v=")
                return <div className="row no-gutters justify-content-end justify-content-md-around align-items-start  tweets-timeline-nodes" key={i}>
                    <div className="col-10 col-md-5 order-3 order-md-1 tweets-timeline-content video-card">
                    <div className="pt-1 m-0 d-flex">
                        <i class="fab fa-youtube fa-2x mt-1 mx-2" style={{color: 'red'}}></i>
                        <p className="p-0">{data.Title}</p>
                    </div>
                    <iframe className="iframe-videos"className="mt-2" title={data.Title}
                        src={`https://www.youtube.com/embed/${code[1]}`}>
                    </iframe>
                        
                    </div>
                    <div className="col-2 col-sm-1 px-md-3 order-2 tweets-timeline-image text-md-center mt-3">
                        
                    </div>
                    <div className="col-10 col-md-5 order-1 order-md-3 py-3 tweets-timeline-date">
                        {/* <time>{data.Created_time}</time> */}
                    </div>
                   
                </div>

            })
            

        )
    }

    embeedTweets = (url) => {

        const token = url.split('/')
        // console.log("token",token[4])
        
        
        return (

            <TwitterTweetEmbed
                tweetId={token[4]}
            />
        )
        


    }
    renderTweet () {

        
        
        return (
            
            this.state.tweets.map( (data, i) => {
                return (
                    <div className="row no-gutters justify-content-end justify-content-md-around align-items-start tweets-timeline-nodes" key={i}>
                        
                        <div key={i} className="col-10 col-md-5 order-3 order-md-1 tweets-timeline-content tweet-card pt-2">
                            
                            <span className="sentiment">
                                { data.Sentiment==='#8caa0b' ?
                                    <i style={{color: '#8caa0b'}}
                                    className="fas fa-smile fa-2x"></i>:
                                    (data.Sentiment==='#ff0000' ?
                                        <i style={{color: '#ff0000'}} className="fas fa-angry fa-2x"></i> :
                                        <i style={{color: '#b3b3b3'}} className="fas fa-meh fa-2x"></i>
                                    )

                                }
                            </span>
                            {this.embeedTweets(data.URL)}
                            <span className="float-right mr-3 text-primary" style={{fontStyle: 'italic'}}>Retweet Count: {data.Retweet_count}</span>
                            {/* {this.checkVisibility(i)} */}
                            
                            {/* <div className="d-flex justify-content-between">
                                
                                <h5 className="text-dark p-3 tweet-name"><i className="fab fa-twitter"></i> {data.User_name}</h5>
                                <div className="tweets-sentiment" style={{background: `${data.Sentiment}`}}></div>
                            </div>
                            <p className="tweet-text">{data.Description}</p>
                            <hr></hr>
                            <small className="text-dark float-right pr-3 pb-3 tweet-date"><time>{data.Created_time}</time></small>
                             */}
                            
                        </div>

                        <div className="col-2 col-sm-1 px-md-3 order-2 tweets-timeline-image text-md-center mt-3">
                            
                        </div>
                        <div className="col-10 col-md-5 order-1 order-md-3 py-3 tweets-timeline-date">
                        </div>
                   
                    </div>
                )
            })
            

        )
    }
    render() {
        if(!localStorage.getItem("Token"))
            return <Redirect to="/" />
        return (

            <>
            <div className="page-container">
                <Navbar />
                
                <div className="container mt-3">
                    
                    <div className="text-center mb-5">
                        <h1>STORY</h1>
                        <p className="summary-text">{this.state.summary}</p>
                    </div>
                    <Entities entities={this.state.entity} />
                    <div className="text-center mb-5">
                        <button className="btn btn-tweets" onClick={() => this.setState({seen: 'tweets'}) }>Tweets</button>
                        <button className="btn btn-videos" onClick={() => this.setState({seen: 'videos'}) } >videos</button>
                    </div>
                    {/* test */}
                    <div className="container">
                    {

                        this.state.spinner ? 
                        <div className="spinner-grow text-muted tweet-spinner"></div>
                        :
                        (
                            this.state.seen==='tweets' && this.state.tweets.length>0 ? 
                            <div className="tweets-timeline">
                                {this.renderTweet()}
                            </div> : 
                            (this.state.seen==='videos' && this.state.videos.length>0 ? 
                            <div className="tweets-timeline">
                                {this.renderVideos()}
                            </div> : 
                            <div className="tweet-timeline-err">No data found</div> )
                        )
                    }
                    </div>
                   

                </div>
            </div>
            </>
        )

    }

    

}
export default TweetsTimeline;