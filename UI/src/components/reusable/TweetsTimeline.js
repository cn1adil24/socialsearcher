import React from 'react'

import TweetEmbed from 'react-tweet-embed';

import axios from '../api/api'
import Navbar from './Navbar'
import '../css/TweetsTimeline.css'
import Entities from './Entities'
import { Redirect } from 'react-router-dom'

import Angry from '../images/angry-icon.png'
import Smile from '../images/smile-icon.png'
import Neutral from '../images/neutral-icon.png'



class TweetsTimeline extends React.Component {

    state = {
                summary: null, 
                tweets: [],
                tempTweets: [],
                videos: [], 
                seen: 'tweets', 
                entity:[],
                spinner: true
            }

    async componentDidMount() {

        
        const {id} = this.props.match.params;
        
        const response = await axios.get(`/tweet?id=${id}`)
        const response2 = await axios.get(`/video?id=${id}`)
        const response3 = await axios.get(`/entity?id=${id}`)
        
       
        this.setState( 
                {
                    summary: this.props.location.state, 
                    tweets: response.data,
                    tempTweets: response.data,
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
                        <i className="fab fa-youtube fa-2x mt-1 mx-2" style={{color: 'red'}}></i>
                        <p className="p-0">{data.Title}</p>
                    </div>
                    <iframe className="iframe-videos mt-2" title={data.Title}
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

            <TweetEmbed
                id={token[4]}
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
                                {
                                    data.Sentiment === '#8caa0b' ? 
                                    <img src={Smile} className="sent-icon" alt="Smile" />:
                                    (
                                        data.Sentiment === '#ff0000'?
                                        <img src={Angry} className="sent-icon" alt="Angry" /> :
                                        <img src={Neutral} className="sent-icon" alt="Neutral" />
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
    sortBy = (type) => {
        

        let sorted = []
        if(type === 'retweet'){

            sorted = this.state.tempTweets.sort(function(a, b) {
                return b.Retweet_count - a.Retweet_count;
            });
        }
        else if(type === 'date'){

            sorted = this.state.tempTweets.sort(function(a, b) {
                var dateA = new Date(a.Created_time), dateB = new Date(b.Created_time);
                return dateB - dateA;
            });
        }
        else{

            
            const filter = {
                angry: '#ff0000',
                smile: '#8caa0b',
                neutral: '#b3b3b3',
            }

            this.state.tempTweets.forEach(tweet => {

                if(tweet.Sentiment === filter[type]){
                    sorted.push(tweet)
                }
            })
        }
        
        this.setState({tweets: sorted})
        
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
                    <div className="text-center">
                        <button className="btn btn-tweets" onClick={() => this.setState({seen: 'tweets'}) }>Tweets</button>
                        <button className="btn btn-videos" onClick={() => this.setState({seen: 'videos'}) } >videos</button>
                    </div>
                    {this.state.seen === 'tweets' ?
                        <div className="form-group w-50 m-auto">
                            <label htmlFor="sel1">Sort by</label>
                            <select className="form-control"
                                value={this.state.sortBy}
                                onChange={(e) => this.sortBy(e.target.value)}
                            >
                                <option value="retweet">Retweet Count</option>
                                <option value="date">Date</option>
                                <option value="angry">Negative Sentiment</option>
                                <option value="smile">Positive Sentiment</option>
                                <option value="neutral">Neutral Sentiment</option>
                            </select>
                        </div>
                        :
                        <></>
                    }
                    {/* test */}
                    <div className="container mt-5">
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