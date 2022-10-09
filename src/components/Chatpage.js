import React from 'react'
import { useRef } from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Mycontext from '../context/context'
import "../Stylings/Chatpage.css"
import { format } from 'timeago.js'
import URL from './URL'
const Chatpage = () => {
    const [message, setmessage] = useState("")
    const a = useContext(Mycontext)
    const { socket, setalert, allchats, setallchat } = a
    const [btntext, setbtntext] = useState("Send")
    const [onlineUser, setonlineuser] = useState("")
    const navigate = useNavigate()
    const changemessage = (e) => {
        setmessage(e.target.value)
    }
    const allchat = async () => {
        let url = `${URL}/all/chat`;
        let data = await fetch(url, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                instagram_clone: localStorage.getItem("instagram_clone")
            },
            body: JSON.stringify({ friend: localStorage.getItem("chat_id") })
        });
        let res = await data.json();
        setallchat(res.find_chats)
    }
    const Send = async () => {
        let url = `${URL}/chat/save`;
        let data = await fetch(url, {
            method: 'POST',
            headers: {
                "Content-type": "application/json",
                instagram_clone: localStorage.getItem("instagram_clone")
            },
            body: JSON.stringify({ friend: localStorage.getItem("chat_id"), text: message })
        });
        let res = await data.json()
        if (res.create_chat) {
            setallchat(allchats.concat(res.create_chat))
            setmessage("")
            socket?.emit("chat", res.create_chat)
            return
        }
    }
    const scrollref = useRef()
    useEffect(() => {
        scrollref.current?.scrollIntoView({ behavior: "smooth" })
    }, [allchats])
    useEffect(() => {
        allchat()
    }, [])
    const toProfile = () => {
        localStorage.setItem("user_id", localStorage.getItem("chat_id"))
        navigate("/user/profile")
    }
    const myprofile = (id) => {
        if (id !== localStorage.getItem("chat_id")) {
            navigate("/profile")
        } else {
            toProfile()
        }
    }
    const deleteChat = async (id) => {
        const newChat = allchats.filter((e) => {
            return e._id !== id
        })
        setallchat(newChat)
        let url = `${URL}/delete/chat/${id}`
        let data = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json",
                instagram_clone: localStorage.getItem("instagram_clone")
            }
        });
        let res = await data.json()
        if (res.msg) {
            setalert({
                display: "block",
                msg: res.msg
            })
        } else if (res.error) {
            setalert({
                display: "block",
                msg: res.error
            })
        }
    }
    return (
        <>
            <div className="main_chat_container">
                <div className='container chat_container' id="type">
                    <div className="online_box">
                        {onlineUser.username}
                    </div>
                    {allchats.length >= 1 ? allchats.map((e) => {
                        return <p className={`${e.sender !== localStorage.getItem("chat_id") ? "Me" : "Friend"}`} ref={scrollref} key={e._id}>{e.text} <img src={e.profile} alt="" onClick={() => { myprofile(e.sender) }} className='profile_chat' ></img> <span className='delete_chat' onClick={() => { deleteChat(e._id) }}><i className="fa-solid fa-trash-can"></i></span> <span id="message_date">{e.date ? format(e.date) : ""}</span>{e.sender === localStorage.getItem("chat_id") ? <span className="typing"></span> : ""}</p>
                    }) : <p>No chats</p>}

                </div>
                <div className="input-group mb-3 container message_sender">
                    <input type="text" className="form-control border-dark" placeholder="" aria-label="Recipient's username" aria-describedby="button-addon2" value={message} onChange={changemessage} />
                    <button className="btn btn-outline-primary" onClick={Send} type="button" id="button-addon2">{btntext}</button>
                </div>
            </div>
        </>
    )
}

export default Chatpage
