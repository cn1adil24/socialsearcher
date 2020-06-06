import React from 'react'
import {Link} from 'react-router-dom'
import '../css/Summary.css'

class Summary extends React.Component {


    renderContent(){
        
        const {summary} = this.props.data

        return summary.map( (summary, i) => {

            return (

                <li key={i} className="summary-card">
                    <div className="d-flex justify-content-between mb-3">
                        <h3 className="story-head">Story {i+1}</h3>
                        <div className="sentiment-circle" style={{background: summary.Sentiment}}></div>
                    </div>
                    <p className="summary-text">{summary.Summary}</p>
                    <div className="justify-content-between d-flex">
                        <div className="summary-date">
                            <i className="far fa-clock"></i> {summary.Date}
                            <br/>
                            <i class="fab fa-twitter"></i>tweet count: {summary.tweet_count}
                        </div>
                        <Link to={{pathname: `tweetstimeline/${summary.id}`, state:summary.Summary}} className="btn btn-primary btn-expand">Expand</Link>
                    </div>
                </li>
            )
        })

    }
    render() {

        if(this.props.data.term === null)
            return <div></div>

        return (

            <div className="container mt-5 mb-5 summary-container">
                <div className="row w-100">
                    <div className="col">
                        <h5 className="summary-heading">Search results for: <strong className="term-heading">{this.props.data.term}</strong></h5>
                        <h2 className="text-center timeline-head">Timeline</h2>
                        <ul className="timeline">
                            {this.renderContent()}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}
export default Summary;