import React from 'react'
import {Redirect} from 'react-router-dom'
import axios from '../api/api'
// import {Redirect} from 'react-router-dom'
import Navbar from '../reusable/Navbar'
import '../css/profile.css'

class Profile extends React.Component {


    
    state = {
                disabled: true,
                name:JSON.parse(localStorage.getItem("User")).name,
                email:JSON.parse(localStorage.getItem("User")).email,
                password:JSON.parse(localStorage.getItem("User")).password,
                id: JSON.parse(localStorage.getItem("User")).id,

                errorMessage: null
            }

    constructor(props) {
        super(props)
        this.myRef = React.createRef();
    }
    
    Edit = (e) => {

        e.preventDefault();
        this.setState({disabled: false})
        
    }
    onChange = (e) => {

        this.setState({[e.target.name]: e.target.value})
    }
    onSubmit = async (e) => {

        e.preventDefault();
        const response = await axios.post('/edit', {name: this.state.name, id: this.state.id, email: this.state.email, password: this.state.password})
        // console.log(response);
        // console.log((typeof response.data))
        if(typeof response.data === 'string'){

            this.setState({errorMessage: 'something went wrong'})
        }
        else{
            localStorage.setItem("User", JSON.stringify(response.data));
            this.setState({disabled: true, errorMessage: null})
        }
        
        
    }
    showPassword = (e) => {
        const pass = this.myRef.current
        if(pass.type === 'password')
            pass.type = 'text';
        else
            pass.type = 'password';
    }
    renderProfile() {

        if(localStorage.getItem("Token") ===null)
            return <Redirect to="/" />

        return (

            <div className="container profile">
    
                <div className="row">

                    <div className="col-md-3 custom-side">
                        <h2 className="text-center">User Profile</h2>
                        <div className="mt-3 text-center">
                            <img src="http://ssl.gstatic.com/accounts/ui/avatar_2x.png" className="avatar img-circle img-thumbnail" alt="avatar" />
                            <h6 className="mt-3">Upload a different photo...</h6>
                            <input type="file" className="text-center center-block file-upload" />
                        </div>
                    </div>
                    
                    <div className="col-md-9 custom-all">    
                        <div className="tab-content">
                            <div className="tab-pane active" id="home">
                                
                                <form className="form mt-4" method="post" id="registrationForm" onSubmit={this.onSubmit}>
                                    <div className="form-group">
                                        
                                        <div className="col-xs-6">
                                            <label htmlFor="first_name"><h4>Name</h4></label>
                                            <input type="text" className="form-control" name="name" id="first_name" placeholder="first name"  
                                                    value={this.state.name}
                                                    disabled={this.state.disabled}
                                                    onChange={this.onChange}
                                                    required
                                             />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        
                                        <div className="col-xs-6">
                                            <label htmlFor="email"><h4>Email</h4></label>
                                            <input type="email" className="form-control" name="email" id="email" placeholder="you@email.com" 
                                                    value={this.state.email}
                                                    disabled={this.state.disabled}
                                                    onChange={this.onChange}
                                                    required
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        
                                        <div className="col-xs-6">
                                            <label htmlFor="password"><h4>Password</h4></label>
                                            <input type="password" className="form-control" name="password" id="password" placeholder="password"
                                                    ref={this.myRef}
                                                    value={this.state.password}
                                                    disabled={this.state.disabled}
                                                    onChange={this.onChange}
                                                    required
                                            />
                                            <div className="float-right eye-icon" onClick={this.showPassword}><i className="fa fa-eye"></i></div>
                                        </div>
                                    </div>
                                    <small className="text-danger">{this.state.errorMessage}</small>
                                    <div className="form-group pb-4 mt-4">

                                        { this.state.disabled?
                                            <button className="btn prof-btn" onClick={this.Edit}>Edit</button> :
                                            <button className="btn prof-btn" type="submit" >Save</button>}
                                                
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
        
    }
    render() {
        
        return(
            <>

                <div className="page-container">
                   <Navbar />
                    {this.renderProfile()}
                </div>

            </>
        )

    }
}

export default Profile