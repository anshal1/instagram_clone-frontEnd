import React, { useContext, useEffect, useState } from 'react'
import "../Stylings/Signup.css"
import { Link, useNavigate } from "react-router-dom"
import Mycontext from '../context/context'
import URL from "./URL"
const Signup = () => {
    const [image] = useState("https://www.instagram.com/static/images/homepage/screenshots/screenshot2.png/4d62acb667fb.png")
    const a = useContext(Mycontext)
    const { setload, setalert, socket } = a
    const navigate = useNavigate()
    const [Data, setData] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
    })
    useEffect(() => {
        setload({
            width: "100%",
            visibility: "1"
        })
        if(localStorage.getItem("instagram_clone") !== null){
            navigate("/")
        } else {

        }
    }, [])
    const Getdata = (e) => {
        setData({ ...Data, [e.target.name]: e.target.value })
    }
    const SignUp = async () => {
        let fd = new FormData()
        fd.append("name", Data.name)
        fd.append("username", Data.username)
        fd.append("email", Data.email)
        fd.append("password", Data.password)
        let url = `${URL}/signup`
        let data = await fetch(url, {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name: Data.name, username: Data.username, email: Data.email, password: Data.password})
        })
        let res = await data.json()
        if (res.localtoken) {
            localStorage.setItem("instagram_clone", res.localtoken)
            navigate("/")
            setalert({
                display: "block",
                msg: "Sign in successfull"
            })
            setTimeout(() => {
                setalert({
                    display: "none",
                    msg: ""
                })
            }, 4000)
        } else if(res.error){
            setalert({
                display: "block",
                msg: res.error
            })
        }
    }
    return (
        <div className='main_signup_container'>
            <div className="img_container_signup">
                <img src={image} alt="" id='signup_page_img' />
            </div>
            <div className="for_another">
                <div className="sign_up_container">
                    <div className="brand_name_signup">
                        <p className="name">Instagram</p>
                    </div>
                    <div className="message_signup">
                        <p className="message">Sign up to see photos and videos from your friends.</p>
                    </div>
                    <div className="signup_with_facebook">
                        <button className='btn btn-primary' id='signup_btn_facebook'>Log In with facebook</button>
                    </div>
                    <div className="or">
                        <hr /> <span>OR</span> <hr />
                    </div>
                    <div className="sign_up_form">
                        <input type="text" name='name' value={Data.name} onChange={Getdata} className='signup_inputs' placeholder='Full Name' />
                        <input type="text" name='username' value={Data.username} onChange={Getdata} className='signup_inputs' placeholder='Username' />
                        <input type="email" name='email' value={Data.email} onChange={Getdata} className='signup_inputs' placeholder='Email' />
                        <input type="password" name='password' value={Data.password} onChange={Getdata} className='signup_inputs' placeholder='Password' />
                    </div>
                    <div className="others_message">
                        <p className="other_msg_1">People who use our service may have uploaded your contact information to Instagram. Learn More
                        </p>
                        <p className="other_msg_2">By signing up, you agree to our Terms , Data Policy and Cookies Policy .

                        </p>
                        <div className="sign_up_btn">
                            <button className='btn btn-primary' id='sign_up_btn-bottom' onClick={SignUp} >Sign Up</button>
                        </div>
                    </div>
                </div>
                <div className="have_account">
                    <p className="account_have">Have an account? <span> <Link to="/login">Login In</Link></span></p>
                </div>
                <div className="getapp_link">
                    <img src="https://www.instagram.com/static/images/appstore-install-badges/badge_ios_english-en.png/180ae7a0bcf7.png" alt="" className='link_img' />
                    <img src="https://www.instagram.com/static/images/appstore-install-badges/badge_android_english-en.png/e9cd846dc748.png" alt="" className='link_img' />
                </div>
            </div>
        </div>
    )
}

export default Signup
