import React from 'react'
import {Redirect} from 'react-router-dom'
import Navbar from '../reusable/Navbar'

class About extends React.Component {


    render() {

        if(localStorage.getItem("Token") ===null)
            return <Redirect to="/" />

        return(
            <>
                <Navbar />
            </>
        )
    }
}

export default About;