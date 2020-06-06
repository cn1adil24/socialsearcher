import React from 'react'
import {Redirect} from 'react-router-dom'
import Navbar from '../reusable/Navbar'

import '../css/About.css'
import Logo from '../images/logo-color.png'
class About extends React.Component {


    render() {

        if(localStorage.getItem("Token") ===null)
            return <Redirect to="/" />

        return(
            <>
                <Navbar />

                <div className="container">
                    <div className="head-about text-center">
                        <h1 className="pb-0 m-0">Social Searcher Team</h1>
                        <h5>The future is here</h5>
                        
                    </div>
                    <div className="d-flex justify-content-around fixed-bottom mb-5">
                        <div className="about-contact">
                            <h3>Contact Us</h3>
                            <p>- k163782@nu.edu.pk</p>
                            <p>- k163807@nu.edu.pk</p>
                            <p>- k163778@nu.edu.pk</p>
                        </div>
                        <div className="mt-5">
                            <img src={Logo} alt="logo" style={{width: '200px', height: '60px'}} />
                        </div>
                    </div>

                </div>
            </>
        )
    }
}

export default About;