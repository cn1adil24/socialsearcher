import React from 'react'
import {Link} from 'react-router-dom'
import '../css/Navbar.css'
import Logo from '../images/logo-white.png'
class Navbar extends React.Component {


    render() {

        return (
            <>
                <nav className="navbar navbar-expand-md bg-dark navbar-dark navbar-brown sticky-top">
                    <div className="container-fluid mr-4 ml-3">
                        <Link className="navbar-brand brand-font" to="/">
                            <img src={Logo} alt="logo" style={{width: '180px', height: '45px'}} />
                        </Link>

                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse" id="collapsibleNavbar">
                            <ul className="navbar-nav ml-auto py-2">
                                <li className="nav-item px-3">
                                    <Link className="nav-link link-font" to="/">
                                        <i className="fas fa-home"></i> Home
                                    </Link>
                                </li>
                                <li className="nav-item px-3">
                                    <Link className="nav-link link-font" to="/history">
                                        <i className="fas fa-history"></i> History
                                    </Link>
                                </li>
                                <li className="nav-item px-3">
                                    <Link className="nav-link link-font" to="/profile">
                                        <i className="fas fa-user-circle"></i> Profile
                                    
                                    </Link>
                                </li>
                                <li className="nav-item px-3">
                                    <Link className="nav-link link-font" to="/about">
                                        <i className="fas fa-users"></i> About
                                    </Link>
                                </li>
                                {/* <li className="nav-item px-3">
                                    <Link className="nav-link link-font" to="/Covid19">
                                        <i className="fas fa-star"></i> Covid_19
                                    </Link>
                                </li> */}
                                <li className="nav-item mx-2">
                                    <Link className="btn btn-warning text-white custom-logout" to="/logout">Logout</Link>    
                                </li>
                                
                            </ul>
                        </div>
                    </div>
                </nav>
            </>
        )
    }
}

export default Navbar;