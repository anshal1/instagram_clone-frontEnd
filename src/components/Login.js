import React, { useContext, useEffect, useState } from 'react'
import "../Stylings/Login.css"
import {Link, useNavigate} from "react-router-dom"
import Mycontext from '../context/context'
import URL from './URL'
const Login = () => {
    const a = useContext(Mycontext)
    const {setload, setalert, socket} = a
    const [image] = useState("https://www.instagram.com/static/images/homepage/screenshots/screenshot2.png/4d62acb667fb.png")
    const [login ,setlogin] = useState({
        username: "",
        password: ""
    })
    const navigate = useNavigate()
    useEffect(()=>{
        setload({
            width: "100%",
            visibility: "1"
        })
    }, [])
    const Changelogin =(e)=>{
        setlogin({...login, [e.target.name]: e.target.value})
    }
    const Login =async()=>{
        let url = `${URL}/login`
        let data = await fetch(url, {
            method: "POST",
            headers:{
                "Content-type": "application/json"
            },
            body: JSON.stringify({username: login.username, password: login.password})
        })
        let res = await data.json()
        if(res.localtoken){
            localStorage.setItem("instagram_clone", res.localtoken)
            navigate("/")
        } else if(res.error){
            setalert({
                display: "block",
                msg: res.error
            })
        }
    }

    return (
        <div className='main_login_container'>
            <div className="upper_container">
                <div className="image_container">
                    <img src={image} alt="" id='login_page_img' />
                </div>
                <div className="form_container">
                    <div className="login_form">
                        <p className="brandname_login">Instagram</p>
                        <input type="text" id='username' placeholder='username' name="username" value={login.username} onChange={Changelogin} />
                        <input type="text" id='password' placeholder='password' name='password' value={login.password} onChange={Changelogin} />
                        <button className='btn btn-primary' onClick={Login} id='login_btn'>Log In</button>
                        <div className="or">
                            <hr /><span>OR</span><hr />
                        </div>
                        <p className="login_with">Login with Facebook</p>
                        <p className="forgot_pass">Forgot password?</p>
                    </div>
                    <div className="to_signup">
                        <p className="no_account">Don't have an account? <span> <Link to="/signup">Sign up</Link></span> </p>
                    </div>
                    <p className="get_app">Get the app</p>
                    <div className="getapp_link">
                        <img src="https://www.instagram.com/static/images/appstore-install-badges/badge_ios_english-en.png/180ae7a0bcf7.png" alt="" className='link_img' />
                        <img src="https://www.instagram.com/static/images/appstore-install-badges/badge_android_english-en.png/e9cd846dc748.png" alt="" className='link_img' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
