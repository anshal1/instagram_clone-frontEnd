import React, { useContext, useRef } from 'react'
import "../Stylings/Profile.css"
import { useState } from 'react'
import Postbox from './Postbox'
import Saved from './Saved'
import { useEffect } from 'react'
import URL from './URL'
import Mycontext from "../context/context"
import { Link, useNavigate } from 'react-router-dom'
import { ExternalLink } from 'react-external-link';
import Pageloader from './Pageloader'
const Profile = () => {
    const a = useContext(Mycontext)
    const { setalert, setdata, postlen, after_profile, setprogress, text_profile } = a
    const navigate = useNavigate()
    const [pages, setpages] = useState(<Postbox />)
    const [postactive, setpostactive] = useState("active")
    const [saveactive, setsaveactive] = useState("")
    const [taggedactive, settaggedactive] = useState("")
    const [userdata, setuserdata] = useState({
        name: "",
        username: "",
        bio: "",
        link: "",
        email: "",
        follower: [],
        following: []
    })
    const [profile, setprofile] = useState("")
    const [backend_profile, setbackend_profile] = useState()
    const [loading, setloading] = useState(true)
    const ref = useRef(null)
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
    const Data = async () => {
        let url = `${URL}/user/data`
        let credendials = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                instagram_clone: localStorage.getItem("instagram_clone")
            }
        })
        let res = await credendials.json()
        setuserdata({
            name: res.current_user.name,
            username: res.current_user.username,
            email: res.current_user.email,
            bio: res.current_user.bio,
            link: res.current_user.link,
            follower: res.current_user.follower,
            following: res.current_user.following
        })
        setprofile(res.current_user.profile)
        setloading(false)
    }
    useEffect(() => {
        setprofile(after_profile)
        Data()
    }, [])
    useEffect(() => {
        if (text_profile) {
            const profile = document.getElementById("user_image")
            profile.setAttribute("src", text_profile)
        }
    }, [text_profile])

    const getProfile = (e) => {
        if (e.target || e.target.files) {
            setbackend_profile(e.target.files[0])
        }
        const reader = new FileReader()
        reader.onload = (e) => {
            // setprofile(e.target.result)
            const image = document.getElementById("user_image")
            image.setAttribute("src", e.target.result)
        }
        reader.readAsDataURL(e.target.files[0])
    }
    const Upload = () => {
        ref.current.click()
    }
    const Upload_profile = async () => {
        if (!backend_profile) {
            setalert({
                display: "block",
                msg: "Please select a valid image"
            })
            setTimeout(() => {
                setalert({
                    display: "none",
                    msg: ""
                })
            }, 4000)
        } else {
            let url = `${URL}/add/profile`
            let fd = new FormData()
            fd.append("profile", backend_profile)
            const req = new XMLHttpRequest()
            req.open("POST", url)
            req.upload.addEventListener("progress", (e) => {
                setprogress({
                    visibility: "visible",
                    width: `${Math.round((e.loaded / e.total) * 100)}%`
                })
                if (Math.round((e.loaded / e.total) * 100) === 100) {
                    setprogress({
                        visibility: "visible",
                        width: "100%"
                    })
                }
            })
            req.upload.addEventListener("abort", () => {
                setalert({
                    display: "block",
                    msg: "Uploading aborted please check your internet connection"
                })
            })
            req.addEventListener("load", () => {
                if (req.response) {
                    console.log(req.responseText)
                    setalert({
                        display: "block",
                        msg: "Uploaded successfull"
                    })
                    setprogress({
                        visibility: "hidden",
                        width: "100%"
                    })
                }
            })
            req.setRequestHeader("instagram_clone", localStorage.getItem("instagram_clone"))
            req.send(fd)
        }
    }
    const ToEdit = () => {
        navigate("/edit")
        setdata({
            name: userdata.name,
            username: userdata.username,
            email: userdata.email,
            bio: userdata.bio,
            link: userdata.link
        })
    }
    return (
        <div className='main_profile_container'>
            {loading ? <Pageloader /> : <div>
                <div className="profile_page_img">
                    <div className="user_image_container">
                        <img src={profile} onClick={profile === "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHL03nqSptOCTMXb8ym6QffVTfjk2C14HS-w&usqp=CAU" || profile === "" || !profile ? Upload : ToEdit} alt="" id='user_image' />
                        {profile === "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHL03nqSptOCTMXb8ym6QffVTfjk2C14HS-w&usqp=CAU" || profile === "" || !profile ? <span id='for_upload' onClick={Upload_profile}>Add profile</span> : ""}
                        <input type="file" className='d-none' onChange={getProfile} ref={ref} id="" />
                    </div>
                    <div className="user_info">
                        <p id='name_others'>{userdata.name} <span onClick={ToEdit}><button id='edit'>Edit Profile</button></span><i className="fa-solid fa-gear"></i></p>
                        <div className="post_follow_data">
                            <p className="user_follow_post">{postlen.length}  <span>Posts</span> </p>
                            <p className="user_follow_post">{userdata.follower.length} <span>Followers</span></p>
                            <p className="user_follow_post">{userdata.following.length} <span>Following</span></p>
                        </div>
                        <div className="bio">
                            <p id="profile_username">{userdata.username}</p>
                            {!userdata.bio ? <p className="biodata" onClick={ToEdit}>Add Bio</p> : <p className='biodata'>{userdata.bio}</p>}
                            {!userdata.link ? <p className="biodata text-primary" onClick={ToEdit}>Add Link</p> : <ExternalLink href={userdata.link} id="external_link" />}

                            {/* <a href="http://localhost:3000/profile">Profile.com</a> */}
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
                {pages}</div>}
        </div>
    )
}

export default Profile
