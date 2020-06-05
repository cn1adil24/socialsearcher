import React from 'react'
import Navbar from '../reusable/Navbar'
import WorldData from '../reusable/Covid19/WorldData'
import PakistanStats from '../reusable/Covid19/PakistanStats'
import PakistanComparison from '../reusable/Covid19/PakistanComparison'
import BreadTrends from '../reusable/Covid19/BreadTrends'
// import axios from '../api/api'
import '../css/Covid19.css'
import World from '../js/world.json'
import Data from '../js/data.json'

const world = World[0]['world'][0]

class Covid19 extends React.Component {

  
    state = {world: world, pakistan:Data, overall: World}

    
    async componentDidMount() {

        
        // const response = await fetchTweets.get(`/tweet?id=${id}&key=${term}`)
        // const response2 = await fetchTweets.get(`/tweet?id=${id}&key=${term}`)
        

        // this.setState({world: response.data, pakistan: response2.data})
        // console.log()
    }

    
    
    
    render() {

        return (
            <>
                <Navbar />
                <BreadTrends />
                <div className="container mt-5">
                    <nav className="navbar navbar-expand-sm bg-light sticky-top navbar-light covidNav"> 
                        <div className="container">
                            <ul className="navbar-nav">
                                <li className="nav-item mx-4">
                                    <a className="nav-link" href="#section1">World Wide</a>
                                </li>
                                <li className="nav-item mx-4">
                                    <a className="nav-link" href="#section2">Pakistan's Stats</a>
                                </li>
                                <li className="nav-item mx-4">
                                    <a className="nav-link" href="#section3">Pakistan's Comparison</a>
                                </li>
                            </ul>
                        </div>
                    </nav>

                    <div id="section1" className="container-fluid my-5">
                        <WorldData world={this.state.world}/>
                    </div>
                    <hr />
                    <div id="section2" className="container-fluid my-5">
                        <PakistanStats data={this.state.pakistan} />
                    </div>
                    <hr />
                    <div id="section3" className="container-fluid my-5">
                        <PakistanComparison world={this.state.overall} />
                    </div>
                        
                </div>
            </>
        )
    }
}

export default Covid19