import React from 'react'
import "../Stylings/Profilepost.css"
import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import Mycontext from "../context/context"
import URL from "./URL"
const Profilepost = () => {
    const a = useContext(Mycontext)
    const { username, visible, setvisible, setid } = a
    const [post, setpost] = useState([])
    const navigate = useNavigate()
    const allPost = async () => {
        let url = `${URL}/user/post`
        let data = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                instagram_clone: localStorage.getItem("instagram_clone")
            }
        })
        let res = await data.json()
        setpost(res.find_post)
    }
    const Like = async (id) => {
        let url = `${URL}/like/${id}`
        let data = await fetch(url, {
            method: "PUT",
            headers: {
                instagram_clone: localStorage.getItem("instagram_clone")
            }
        })
        let res = await data.json()
        let newPost = post.map((e) => {
            if (e._id === res.find_post._id) {
                return res.find_post
            } else {
                return e
            }
        })
        setpost(newPost)
    }
    const unlike = async (id) => {
        let url = `${URL}/unlike/${id}`
        let data = await fetch(url, {
            method: "PUT",
            headers: {
                instagram_clone: localStorage.getItem("instagram_clone")
            }
        })
        let res = await data.json()
        let newPost = post.map((e) => {
            if (e._id === res.find_post._id) {
                return res.find_post
            } else {
                return e
            }
        })
        setpost(newPost)
    }
    useEffect(() => {
        allPost()
    }, [])
    const toUser = (id) => {
        localStorage.setItem("user_id", id)
        navigate("/user/profile")
    }
    const comment =(id)=>{
        setvisible("visible")
        setid(id)
        if(visible === "visible"){
          setvisible("invisible")
        } else {
          setvisible("visible")
        }
      }
    return (
        <div className='main_profile_post_container'>
            {post.map((e) => {
                return <div className="post_box" key={e._id}>
                    {/* Posts Box */}
                    <span className='profile_name_box' onClick={() => { toUser(e.user_id) }}><img src={e.user_profile} alt="" className='profile' /><p className="home_username">{e.username}</p></span>
                    <img src={e.image} alt="" className='post_img' />
                    <div className="buttons">
                        {/* Like btn */}
                        <i className={`fa-solid fa-heart text-danger d-${e.likes.includes(username) ? "block" : "none"}`} onClick={(event) => {
                            event.target.classList = "fa-regular fa-heart fa-shake"
                            setTimeout(() => {
                                event.target.classList = "fa-regular fa-heart"
                                unlike(e._id)
                            }, 500)
                        }}></i>  <i className={`fa-regular fa-heart d-${e.likes.includes(username) ? "none" : "block"}`} id='like' onClick={(event) => {
                            (event.target.classList = "fa-solid fa-heart fa-bounce text-danger")
                            setTimeout(() => {
                                event.target.classList = "fa-solid fa-heart text-danger"
                                Like(e._id)
                            }, 500)
                        }}></i>
                        {/* Comment btn */}
                        <i className="fa-regular fa-comment" onClick={()=>{
                    comment(e._id)
                  }} ></i>
                        {/* Save btn */}
                        <i className="fa-regular fa-bookmark"></i>
                    </div>
                    <div className="captions">
                        <p className="likes">{e.likes.length} Likes</p>
                        <p className="caption">{e.caption}</p>
                    </div>
                    <div className="comments">
                        <p className="one_comment">{e.comments.length < 1 ? "" : <span><span className='fw-bolder' style={{ fontSize: ".7rem", cursor: "pointer" }} onClick={() => { toUser(e.comments[e.comments.length - 1].user_id) }}>{e.comments[e.comments.length - 1].username} </span>{e.comments[e.comments.length - 1].comment}</span>}</p>
                        <p className="allcomment">{e.comments.length < 1 ? "No comments" : `See all ${e.comments.length} comments`} </p>
                    </div>
                </div>
            })}
        </div>
    )
}

export default Profilepost
