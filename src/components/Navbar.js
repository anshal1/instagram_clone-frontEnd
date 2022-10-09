import React, { useContext, useEffect, useState } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import "../Stylings/Navbar.css"

import URL from './URL'
import Mycontext from '../context/context'
const Navbar = () => {
    const a = useContext(Mycontext)
    const { checkid, socket } = a
    const navigate = useNavigate()
    const [menu, setmenu] = useState("block")
    const [hide, sethide] = useState("none")
    const [showmenu, setshowmenu] = useState('phone_menu_shrinked')
    const [shrink, setshrink] = useState("main_navbar-container")
    const [name, setname] = useState("")
    const [user, setuser] = useState([])
    const [shownotification, setshownotification] = useState("notification_count")
    const [chatnotification, setchatnotification] = useState("notification_count")
    const location = useLocation()
    let notification = []
    let chatnotif = []
    useEffect(() => {
        socket?.on("like_msg", async data => {
            if (location.pathname !== "/message") {
                notification.push(data)
                setshownotification("notification_count_display")
                if (localStorage.getItem("notification") >= 1) {
                    localStorage.setItem("notification", localStorage.getItem("notification") + notification.length)
                } else {
                    localStorage.setItem("notification", notification.length)
                }
            }
        })
    }, [socket])
    useEffect(() => {
        socket?.on("receive_chat", (data) => {
            if (location.pathname !== "/user/chat") {
                console.log(data)
                chatnotif.push(data)
                setchatnotification("notification_count_display")
                if (localStorage.getItem("chatnotification") >= 1) {
                    localStorage.setItem("chatnotification", localStorage.getItem("chatnotification") + chatnotif.length)
                } else {
                    localStorage.setItem("chatnotification", chatnotif.length)
                }
            }
        })
    }, [socket])
    useEffect(() => {
        socket?.on("comment_msg", async data => {
            if (location.pathname !== "/message") {
                notification.push(data)
                setshownotification("notification_count_display")
                if (localStorage.getItem("notification") >= 1) {
                    localStorage.setItem("notification", localStorage.getItem("notification") + notification.length)
                } else {
                    localStorage.setItem("notification", notification.length)
                }
            }
        })
    }, [socket])
    useEffect(() => {
        window.onscroll = () => {
            if (document.documentElement.scrollTop > 1) {
                setshrink("main_navbar-container_shrink")
            } else {
                setshrink("main_navbar-container")
            }
        }
        window.onload = () => {
            if (localStorage.getItem("notification") >= 1) {
                setshownotification("notification_count_display")
            } else {
                setshownotification("notification_count")
            }
            if (localStorage.getItem("chatnotification") >= 1) {
                setchatnotification("notification_count_display")
            } else {
                setchatnotification("notification_count")
            }
        }
    }, [])
    const ShowMenu = (e) => {
        if (e.target.className === "fa-solid fa-bars") {
            setshowmenu("phone_menu")
            sethide("block")
            setmenu("none")
        } else {
            setshowmenu("phone_menu_shrinked")
            sethide("none")
            setmenu("block")
        }
    }
    const changename = (e) => {
        setname(e.target.value)
    }
    const search = async () => {
        let url = `${URL}/search/user`
        let data = await fetch(url, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                instagram_clone: localStorage.getItem("instagram_clone")
            },
            body: JSON.stringify({ name: name })
        })
        let res = await data.json()
        if (res.find_user.length < 1) {

        } else {
            setuser(res.find_user)
        }
    }
    const someuser = async () => {
        let url = `${URL}/some/user`
        let data = await fetch(url)
        let res = await data.json()
        setuser(res.user)
    }
    const toUser = (id) => {
        if (id === checkid) {
            navigate("/profile")
        } else {
            localStorage.setItem("user_id", id)
            navigate("/user/profile")
        }
    }
    const [none, setnone] = useState("block")
    useEffect(() => {
        someuser()
        if (location.pathname === "/signup" || location.pathname === "/login") {
            setnone("none")
        } else {
            setnone("")
        }
    }, [location])
    const logout = () => {
        if (localStorage.getItem("instagram_clone")) {
            localStorage.removeItem("instagram_clone")
            navigate("/signup")
        }
    }
    const removeMessage = () => {
        notification = []
        setshownotification("notification_count")
        localStorage.setItem("notification", 0)
    }
    const removeChatmessage = () => {
        chatnotif = []
        setchatnotification("notification_count")
        localStorage.setItem("chatnotification", 0)
    }
    return (
        <>
            <div className={`${shrink} d-${none}`}>
                <div className="brand_name">
                    <Link to="/">Instagram</Link>
                </div>
                <div className="search_box">
                    <span className='parent_box'> <i className="fa-solid fa-magnifying-glass" onClick={search} id='search_btn'></i><input type="text" value={name} onChange={changename} id='search' /><div className="users_fromsearch">
                        {user.map((e) => {
                            return <span key={e._id} onClick={() => { toUser(e._id) }} className='suggested_box'><img src={e.profile} alt="" className='search_profile' /><p>{e.username}</p><button>Follow</button></span>
                        })}
                    </div></span>
                </div>
                <div className="other_icons">
                    <Link to="/upload"><li className='other_items'><i className="fa-solid fa-circle-plus"></i><span></span></li></Link>
                    <Link to="/message" onClick={removeMessage}><li className='other_items'><i className="fa-regular fa-heart"><span id={shownotification}></span></i></li></Link>
                    <Link to="/profile"><li className='other_items'><i className="fa-regular fa-circle-user"><span></span></i></li></Link>
                    <Link to="/chat" onClick={removeChatmessage}><li className='other_items'><i className="fa-regular fa-comments"><span id={chatnotification}></span></i></li></Link>
                    <li className='other_items' onClick={logout}><i className="fa-solid fa-arrow-right-from-bracket"><span></span></i></li>
                </div>
                <div className="phonenavbar">
                    <i className="fa-solid fa-bars" id={`${menu}`} onClick={ShowMenu}></i>
                    <i className="fa-solid fa-xmark" id={`${hide}`} onClick={ShowMenu} ></i>
                </div>
                <div className={`${showmenu}`}>
                    <li className='other_items'><i className="fa-regular fa-compass"></i> Explore</li>
                    <Link to="/message"><li className='other_items'><i className="fa-regular fa-heart"><span></span></i> Message</li></Link>
                    <Link to="/profile"><li className='other_items'><i className="fa-regular fa-circle-user"><span></span></i> Profike</li></Link>
                    <li className='other_items'><i className="fa-solid fa-arrow-right-from-bracket"><span></span></i> Logout</li>
                </div>
            </div>
        </>
    )
}

export default Navbar
