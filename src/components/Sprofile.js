import React, { useContext, useEffect } from 'react'
import "../Stylings/Profile.css"
import { useState } from 'react'
import Postbox from './Postbox'
import Saved from './Saved'
import URL from './URL'
import Loader from './Loader'
import Mycontext from '../context/context'
import ErrorPage from './ErrorPage'
const SProfile = () => {
    const [pages, setpages] = useState(<Postbox />)
    const [postactive, setpostactive] = useState("active")
    const [saveactive, setsaveactive] = useState("")
    const [taggedactive, settaggedactive] = useState("")
    const [userdata, setuserdata] = useState({
    })
    const [error, seterror] = useState(false)
    const [allpost, setallpost] = useState([])
    const [errormsg, seterrormsg] = useState("")
    const [followdata, setfollowdata] = useState({
        follower: [],
        following: []
    })
    const a = useContext(Mycontext)
    const { username } = a
    const ChangePage = (e) => {
        if (e.target.innerHTML === "Posts") {
            setpostactive("active")
            setsaveactive("")
            settaggedactive("")
            setpages(<Postbox />)
        } else if (e.target.innerHTML === "Saved") {
            setpages(<Saved />)
            setsaveactive("active")
            setpostactive("")
            settaggedactive("")
        } else {
            setpages("Hello")
            settaggedactive("active")
            setpostactive("")
            setsaveactive("")
        }
    }
    const [text, settext] = useState("Follow")
    const [text2, settext2] = useState("Unfollow")
    const user = async () => {
        let url = `${URL}/one/user/${localStorage.getItem("user_id")}`
        let data = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })
        let res = await data.json()
        if (res.success === false) {
            seterror(true)
            seterrormsg(res.error)
        } else {
            setuserdata(res.find_user)
            setfollowdata({
                follower: res.find_user.follower,
                following: res.find_user.following
            })
        }
    }
    const user_post =async()=>{
        let url = `${URL}/one/user/post/${localStorage.getItem("user_id")}`
        let data = await fetch(url, {
            method:"POST",
            headers:{
                "Content-type": "application/json",
                instagram_clone: localStorage.getItem("instagram_clone")
            }
        })
        let res = await data.json()
        setallpost(res.find_post)
    }
    useEffect(() => {
        user()
        user_post()
    }, [])
    const Follow = async () => {
        settext(<Loader />)
        let url = `${URL}/follow/${localStorage.getItem("user_id")}`
        let data = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                instagram_clone: localStorage.getItem("instagram_clone")
            }
        })
        let res = await data.json()
        setuserdata(res.find_user)
        if(res.find_user){
            settext("Follow")
        }
        setfollowdata({
            follower: res.find_user.follower,
            following: res.find_user.following
        })
    }
    const Unfollow = async () => {
        settext2(<Loader />)
        let url = `${URL}/unfollow/${localStorage.getItem("user_id")}`
        let data = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                instagram_clone: localStorage.getItem("instagram_clone")
            }
        })
        let res = await data.json()
        setuserdata(res.find_user)
        if(res.find_user){
            settext2("Unfollow")
        }
        setfollowdata({
            follower: res.find_user.follower,
            following: res.find_user.following
        })
    }
    return (
        <>
            {error ? <ErrorPage msg={errormsg} /> : <div className='main_profile_container'>
                <div className="profile_page_img">
                    <div className="user_image_container">
                        <img src={userdata.profile} alt="" id='user_image' />
                    </div>
                    <div className="user_info">
                        <p id='name_others'>{userdata.name}</p>
                        <div className="post_follow_data">
                            <p className="user_follow_post">{allpost.length}  <span>Posts</span> </p>
                            <p className="user_follow_post">{followdata.follower.length} <span>Followers</span></p>
                            <p className="user_follow_post">{followdata.following.length} <span>Following</span></p>
                        </div>
                        <div className="bio">
                            <p id="profile_username">{userdata.username}</p>
                            <p className="biodata">{userdata.bio ? userdata.bio : ""}</p>
                            <a href={userdata.link}>{userdata.link}</a>
                        </div>
                        <div className="follow_btn">
                            {followdata.follower.includes(username) ? <button id='user_profile_follow' onClick={Unfollow}>{text2}</button> : ""}
                            {!followdata.follower.includes(username) ? <button id='user_profile_follow' onClick={Follow}>{text}</button>: ""}
                        </div>
                    </div>
                </div>
                <hr />
                <div className="profile_user_posts">
                    <div className="postandother_btn">
                        <i onClick={ChangePage} className={`fa-regular fa-image ${postactive}`}><span>Posts</span></i>
                        <i onClick={ChangePage} className={`fa-regular fa-bookmark ${saveactive}`} id='other_bookmark'><span>Saved</span></i>
                        <i onClick={ChangePage} className={`fa-regular fa-user ${taggedactive}`}><span>Tagged</span></i>
                    </div>
                </div>
                {pages}
            </div>}
        </>
    )
}

export default SProfile
