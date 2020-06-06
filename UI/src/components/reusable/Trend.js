import React from 'react'
import '../css/Trends.css'
import { Link } from 'react-router-dom';

class Trend extends React.Component {

    refreshPage() {

        window.location.reload(false);
    }
    render() {

        
        return (
            <div className="sidebar">
                <div className="d-flex justify-content-between trend-heading">
                    <div>                
                        <h4 className="">Trends for you</h4>
                    </div>
                    <div>                
                       <i className="fab fa-twitter tw-icon"></i>
                    </div>
                </div>
                <ul className="trend-list">
                    {
                        this.props.trends.map((elem,i) => {

                            return(
                                <li key={i}>
                                    <Link key={i} onClick={this.refreshPage} className="" to={{pathname: '/timeline', state: elem.replace('#', '')}}>{elem}</Link>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>  
        )
    }
}
export default Trend;