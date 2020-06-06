import React, {useState} from 'react'
import {Redirect} from 'react-router-dom'
import '../css/SignupLogin.css'
import axios from '../api/api'



const SignupLogin = () => {

    const [spinner, setSpinner] = useState(false)
    const [resource, setResource] = useState(false);
    const [nameError, setNameError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [success, setSuccess] = useState(null)
    const [account, setAccount] = useState({
    
        name: '',
        email: '',
        password: ''
    });
    const text = resource===true ? "If you have already Registered click here" : "If you haven't Register yet then click here";
    const renderSignIn = () => {
        
        const onFormSubmit = async ( e) =>{

            e.preventDefault();
            
            setSpinner(true)
            if(account.email === '' || account.password === ''){
                
                if(account.email === '')
                    setEmailError("Please Provide the email")
                if(account.password === '')
                    setPasswordError("Please Provide the password")
                    
            }
            else{
                
                setEmailError('')
                setPasswordError('')
                
                const response = await axios.post('/login', account);
                console.log("abcd",response.data, account.email, account.password)
                if( response.data.email === account.email){
                    const token = response.data.id;
                    localStorage.setItem("Token", token)
                    localStorage.setItem("User", JSON.stringify(response.data));
                    
                }
                else{
                    setPasswordError('Invalid email or Password')
                }
               
            }
            setSpinner(false)
        }
        const onChange = (e) => {

            let name = e.target.name;
            let value = e.target.value;
            account[name] = value;
            setAccount(account);

            if(account.email !== '')
                setEmailError('')
            if(account.password !== '')
                setPasswordError('')

        }
        return (
    
            <form className="form" method="POST" onSubmit={onFormSubmit}>
                <h2 className="mb-4 text-center signin-text" >Sign In</h2>
    
                <div className="wrap-input mt-5">
                    <label className="label-input">Email</label>
                    <br />
                    <input className="input" type="email" name="email" title="Email is not in a correct format e.g: abc@example.com" placeholder="Email address..." onChange={onChange} />
                </div>
                <small className="text-danger">{emailError}</small>
    
                <div className="wrap-input mt-4">
                    <span className="label-input">Password</span>
                    <br />
                    <input className="input" type="password" name="password" placeholder="*************" onChange={onChange} />
                </div>
                <small className="text-danger">{passwordError}</small>
                <div classaName="mb-4 pt-0 mt-4">
                    {/* <a href="">Forgot Password</a> */}
                </div>
    
                <div className="d-flex mt-3">
                    <div className="">
                        <button className="btn btn-signup">
                            {spinner===true?'Wait...':'Sign in'}
                        </button>
                    </div>
                </div>
            </form>
        )
    
    }
    
    const renderRegister = () => {

        const handleChange = (e) => {
        
            setSuccess(null)
            let name = e.target.name;
            let value = e.target.value;
            account[name] = value;
            setAccount(account);
    
            if(account.name !== '')
                setNameError('')
            if(account.email !== '')
                setEmailError('')
            if(account.password !== '')
                setPasswordError('')
    
            
        }
        const onFormSubmit = async (e) =>{
            e.preventDefault();
            setSpinner(true)
            if(account.name === '' || account.email === '' || account.password === ''){
                if(account.name === '')
                    setNameError("Pleasae provide the name")
                if(account.email === '')
                    setEmailError("Please Provide the email")
                if(account.password === '')
                    setPasswordError("Please Provide the password")
                    
            }
            else{
                setNameError('')
                setEmailError('')
                setPasswordError('')
                
                const response = await axios.post('/register', account);
                if(response.data === 'Successfully registered')
                    setSuccess(true)
                else
                    setSuccess(false)
            }
            setSpinner(false)
        }
        return(
                
            <form className="form" onSubmit={onFormSubmit} method="POST">
                <h2 className="mb-4 text-center signin-text" >Register</h2>
                <div className="wrap-input mt-5">
                    <label className="label-input">Name</label>
                    <br />
                    <input 
                        className="input" 
                        type="text" 
                        name="name" 
                        placeholder="Name..." 
                        onChange={handleChange} 
                        required />
                </div>
                <small className="text-danger">{nameError}</small>
                <div className="wrap-input mt-4">
                    <label className="label-input">Email</label>
                    <br />
                    <input 
                        className="input" 
                        type="email" 
                        name="email" 
                        placeholder="Email address..."
                        onChange={handleChange} 
                        required
                        title='Please Enter valid email eg: abc@example.com' 
                    />
                    
                </div>
                <small className="text-danger">{emailError}</small>
                
                <div className="wrap-input mt-4">
                    <span className="label-input">Password</span>
                    <br />
                    <input 
                        className="input" 
                        type="password" 
                        name="password" 
                        placeholder="********" 
                        onChange={handleChange}
                        pattern=".{8}"
                        title="Password must contain atleast characters"
                        required/>
                    
                </div>
                <small className="text-danger">{passwordError}</small>
                
                <div className="d-flex mt-4">
                    <button type="submit" className="btn btn-signup" >
                        {spinner===true?'Wait...':'Register'}
                    </button>
                    
                </div>
                
                <div className="text-primary">
                    <small>
                        { 
                            success===true? 
                            <div><i class="fa fa-check"></i> Successfully registered please signin to get access</div>:
                            (success===false ?<div className="text-danger">User already exist</div> : <></>)
                        }
                    </small>
                </div>
            </form>
        )
    
    }
    
    if(localStorage.getItem("Token") !== null)
        return <Redirect to="/timeline" />
    return(
        <div className="container-fluid p-0">
            <div className="row content">
                <div className="col-md-6 d-none d-md-block p-0 col-content">
                    <div className="overlay"></div>
                    <div className="carousel-caption">
                        <h2>Welcome to Social Searcher</h2>
                        <p className="text-white carousel-text paragraph">This platform provides you with the latest news of events, politics and many more you want</p>
                        <p className="text-white paragraph">{text}</p>
                        { resource===true ? 
                        <button className="btn btn-reg" onClick={() => setResource(false)}>Sign in</button>  : 
                        <button className="btn btn-reg" onClick={() => setResource(true)}>Register</button>}
                    </div>
                    <div id="demo" className="carousel slide" data-ride="carousel">
                        <ul className="carousel-indicators indicators-index">
                            <li data-target="#demo" data-slide-to="0" className="active"></li>
                            <li data-target="#demo" data-slide-to="1"></li>
                            <li data-target="#demo" data-slide-to="2"></li>
                        </ul>
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <img src={require('../images/signup-1.jpg')} alt="lorem" width="1100" height="500" />
                            </div>
                            <div className="carousel-item">
                                <img src={require('../images/signup-1.jpg')} alt="lorem ipsum" width="1100" height="500" />
                            </div>
                            <div className="carousel-item">
                                <img src={require('../images/signup-3.jpg')} alt="lorem i ipsum" width="1100" height="500" />
                            </div>
                        </div>
                        <a className="carousel-control-prev indicators-index" href="#demo" data-slide="prev">
                            <span className="carousel-control-prev-icon"></span>
                        </a>
                        <a className="carousel-control-next indicators-index" href="#demo" data-slide="next">
                            <span className="carousel-control-next-icon"></span>
                        </a>
                    </div>
                </div>
                <div className="col-md-6">
                    { resource===true ? renderRegister() : renderSignIn()}
                </div>
            </div>
        </div>       
    )
}

export default SignupLogin;