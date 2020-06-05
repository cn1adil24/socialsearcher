import React from 'react'
import {Redirect} from 'react-router-dom'
import Navbar from '../reusable/Navbar'
import Trend from '../reusable/Trend'
import Searchbar from '../reusable/Searchbar'
import Summary from '../reusable/Summary'
// import Footer from '../reusable/Footer'


import axios from '../api/api'

import '../css/Timeline.css'

const cache = {}
class Timeline extends React.Component {

    state = {summary:[], term: null, spinner:false, trends:[], err: null}
    
    slideMenuToggle(e){

        e.preventDefault();
        var width = document.getElementById('menu').style.width;
        console.log(width);
        if(width === '0px' || width === ''){
            
            document.getElementById('menu').style.width = '270px';
            document.getElementById('content').style.marginLeft = '270px';
        }
        else{
            
            document.getElementById('menu').style.width = '0px';
            document.getElementById('content').style.marginLeft = '0px';
        }
    }
    async apiCalling(key) {

        this.setState({spinner:true, summary:[], err: null})
        const response = await axios.get(`/summary?id=${localStorage.getItem("Token")}&key=${key}`)
        if(response.data[0].data.length>0){
            cache["term"] = key
            this.setState({summary: response.data[0].data, term:response.data[1].query, spinner:false, err: null});
        }
        else
            this.setState({summary:[], err: 'No data found', spinner:false})

    }
    async componentDidMount() {
        
        if(this.props.location.state !== undefined){
            
            this.apiCalling(this.props.location.state)
        }
        else if(cache["term"] !== undefined){

            this.apiCalling(cache["term"])
        }

        const trends = await axios.get(`/trends`)
        this.setState({trends: trends.data})
    }
    
    onFormSubmit = (term) => {

        
        this.apiCalling(term)
        
    }

    render() {
        if(localStorage.getItem("Token") === null)
            return <Redirect to="/" />


        return(
            <>
                <Navbar />
                <div id="content">
                    <span className="slide d-inline d-md-none ">
                        <a href="/" onClick={this.slideMenuToggle}>
                            <i className="fas fa-bars"></i>
                        </a>
                    </span>
                    <div id="menu" className="nav">
                        <Trend trends={this.state.trends} />
                    </div>
                    
                    <div className="container-fluid">
                        <Searchbar onFormSubmit={this.onFormSubmit}/>
                        <h1 className="no-data-head">{this.state.err}</h1>
                        {
                            
                            this.state.summary.length>0?
                            <Summary  data={{summary: this.state.summary, term: this.state.term}}/>:<></>
                        }                             
                            {
                                this.state.spinner ? 
                                <div className="spinner-grow spinner-custom text-muted"></div>
                                :
                                <></>
                            }
                       
                    </div>
                </div>
                {/* <Footer /> */}
            </>
        )
    }
}

export default Timeline;