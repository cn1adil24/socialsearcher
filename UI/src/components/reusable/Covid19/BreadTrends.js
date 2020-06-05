import React from 'react'
import {Link} from 'react-router-dom'

const BreadTrends = () => {

    return (

        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light p-0">
                <div className="container">
                    <a className="navbar-brand bread-text" href="/">Trends</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item ">
                                <Link className="nav-link bread-text" to={{pathname: '/timeline', state: 'CoronaVirusPakistan'}}>#CoronaVirusPakistan</Link>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link bread-text" href="/">#CoronaSymptoms</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link bread-text" href="/">#COVID19</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link bread-text" href="/">#Coronavirus</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link bread-text" href="/">#CoronavirusPandemic</a>
                            </li>
                        
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}
export default BreadTrends;