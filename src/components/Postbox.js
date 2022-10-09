import React, { useContext, useEffect, useState } from 'react'
import Mycontext from '../context/context'
import URL from "./URL"
import { useLocation, useNavigate } from "react-router-dom"
import Pageloader from './Pageloader'
const Postbox = () => {
    const location = useLocation()
    const a = useContext(Mycontext)
    const { setpostlen } = a
    const [post, setpost] = useState([])
    const navigate = useNavigate()
    const [loading, setloading] = useState(true)
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
        setpostlen(res.find_post)
        setloading(false)
    }
    const user_post = async () => {
        let url = `${URL}/one/user/post/${localStorage.getItem("user_id")}`
        let data = await fetch(url, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                instagram_clone: localStorage.getItem("instagram_clone")
            }
        })
        let res = await data.json()
        setpost(res.find_post)
        setloading(false)
    }
    const toPost = () => {
        navigate("/post")
    }
    useEffect(() => {
        if (location.pathname === "/user/profile") {
            user_post()
        } else {
            allPost()
        }

    }, [])
    return (
        <div>
            {loading ? <Pageloader /> : <div className="postsandother">
                {post.length < 1 ? <h1 style={{ margin: "1rem auto" }}>No post available</h1> : ""}
                {post.map((e) => {
                    return <img src={e.image} key={e._id} onClick={toPost} alt={e.username} className="profile_page_posts" />
                })}
            </div>}
        </div>
    )
}

export default Postbox
