import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Mycontext from '../context/context'
import "../Stylings/Messages.css"
import Pageloader from './Pageloader'
import URL from './URL'
import TimeAgo from 'javascript-time-ago'
// English.
import en from 'javascript-time-ago/locale/en'
import { format } from 'timeago.js'

TimeAgo.addDefaultLocale(en)

const Messages = () => {
  const timeAgo = new TimeAgo('en-US')
  const a = useContext(Mycontext)
  const { username, checkid } = a
  const [likemessage, setlike_message] = useState([])
  const [comment_messages, setcomment_message] = useState([])
  const [follow_messages, setfollow_msg] = useState([])
  const [loading, setloading] = useState(true)
  const current_user = async () => {
    if (localStorage.getItem("instagram_clone") === null) {

    } else {
      let url = `${URL}/get/user`;
      let data = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          instagram_clone: localStorage.getItem("instagram_clone")
        }
      });
      let res = await data.json();
      setlike_message(res.current_user.like_messages)
      setfollow_msg(res.current_user.follow_messages)
      setcomment_message(res.current_user.comment_messages)
      setloading(false)

    }
  }
  useEffect(() => {
    current_user()
  }, [])
  const navigate = useNavigate()
  const toUser = (id) => {
    if (id === checkid) {
      navigate("/profile")
    } else {
      localStorage.setItem("user_id", id)
      navigate("/user/profile")
    }
  }
  return (
    <>
      <div>
        {loading ? <Pageloader /> : <div className="message_box">
          {likemessage.map((e) => {
            return e.liker !== username ? <p key={e._id} onClick={() => { toUser(e.liker_id) }} className="notifications"><span className='message_username'> <img src={e.profile} alt="" /> {e.liker}</span> liked you post <span className='message_date'>{e.date ? format(e.date) : ""}</span></p> : <p className='d-none'></p>
          })}
          {comment_messages.map((e) => {
            return e.commentor !== username ? <p key={e._id} onClick={() => { toUser(e.commentor_id) }} className="notifications"><span className='message_username'> <img src={e.profile} alt="" /> {e.commentor} </span> commented on your post <span className='message_date'>{e.date ? format(e.date) : ""}</span></p> : <p className='d-none'></p>
          })}
          {follow_messages.map((e) => {
            return <p key={e._id} onClick={() => { toUser(e.follower_id) }} className="notifications"><span className='message_username'> <img src={e.profile} alt="" /> {e.follower === username ? "You" : e.follower} </span> started following you <span className='message_date'>{e.date ? format(e.date) : ""}</span></p>
          })}
        </div>}
      </div>
    </>
  )
}

export default Messages
