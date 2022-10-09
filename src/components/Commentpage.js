import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Mycontext from '../context/context'
import "../Stylings/Commentpage.css"
import URL from './URL'
const Commentpage = () => {
    const a = useContext(Mycontext)
    const {checkid, setalert} = a
    const navigate = useNavigate()
    const [comment, setcomment] = useState([])
    const comments =async()=>{
        let url = `${URL}/all/comments/${localStorage.getItem("postcomment_id")}`
        let data = await fetch(url, {
            method:"POST",
            headers:{
                "Content-type": "application/json",
                instagram_clone: localStorage.getItem("instagram_clone")
            }
        })
        let res = await data.json()
        if(res.error){
          setalert({
            display: "block",
            msg: res.error
          }) 
        } else {
          setcomment(res.find_comments)

        }
        
    }
    const toUser = (id) => {
        if (id === checkid) {
          navigate("/profile")
        } else {
          localStorage.setItem("user_id", id)
          navigate("/user/profile")
        }
      }
    useEffect(()=>{
        comments()
    }, [])
  return (
    <>
    <div className="container" id='comment_page_main_box'>
        {comment.length < 1 ? <p className="post_comment"style={{textAlign: "center"}}>No comments</p> : ""}
        {comment.map((e)=>{
            return <p key={e._id} className="post_comment"><span onClick={()=>{toUser(e.user_id)}}><img src={e.profile} className='profile' alt="" /><span className='comment_username'>{e.username}</span></span>{e.comment}</p>
        })}
    </div>
    </>
  )
}

export default Commentpage
