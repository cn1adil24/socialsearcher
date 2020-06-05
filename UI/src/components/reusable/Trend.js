import React from 'react'
import '../css/Trends.css'
import { Link } from 'react-router-dom';

class Trend extends React.Component {

    refreshPage() {

        window.location.reload(false);
    }
    render() {

        
        return (
            <>
            
            <div className="scroll-trend">
                
                <h2 className="trend-heading">Trends</h2>
                <ul className="sidemenu-list">

                    {this.props.trends.map(elem => {

                        return <li className="sidelist-item">
                            <Link onClick={this.refreshPage} className="nav-link trend-link" to={{pathname: '/timeline', state: elem.replace('#', '')}}>{elem}</Link>
                            
                        </li>

                    })}
                    
                </ul>
            </div>
            </>
        )
    }
}
export default Trend;