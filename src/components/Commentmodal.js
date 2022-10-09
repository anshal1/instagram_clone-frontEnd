import React, { useContext, useEffect, useState } from 'react'
import Mycontext from '../context/context'
import URL from './URL'

const Commentmodal = () => {
  const a = useContext(Mycontext)
  const { visible, setvisible, comment_post, setpost, socket} = a
  const [comment, setcomment] = useState("")
  const [err, seterr] = useState("")
  const [post_user, setpost_user] = useState("")
  const style = {
    border: "2px solid grey",
    boxShadow: "3px 3px 200px grey",
    position: "relative"
  }
  let style2 = {
    transition: "all .4s"
  }
  const style3 = {
    position: "absolute",
    zIndex: "1",
    right: "-53px",
    top: "-6px",
    cursor: "pointer",
    fontSize: "1.5rem"
  }
  const Comment = (e) => {
    setcomment(e.target.value)
  }
  const current_post = async()=>{
    let url = `${URL}/one/post/${localStorage.getItem("comment_id")}`
    let data = await fetch(url, {
      method:"POST",
      headers:{
        "Content-type": "application/json",
        instagram_clone: localStorage.getItem("instagram_clone")
      }
    })
    let res = await data.json()
    console.log(res)
    setpost_user(res.find_post)
  }
  useEffect(()=>{
    if(visible === "visible"){
      current_post()
    } else {
  
    }
  }, [visible])
  const addComment = async () => {
    let url = `${URL}/comment/${localStorage.getItem("comment_id")}`
    let data = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        instagram_clone: localStorage.getItem("instagram_clone")
      },
      body: JSON.stringify({ comment: comment })
    })
    let res = await data.json()
    if (res.error) {
      seterr(res.error)
      setTimeout(() => {
        seterr("")
      }, 4000)
    } else if(res.find_post) {
      setvisible("invisible")
      socket?.emit("comment", post_user)
      let newPost = comment_post.map((e)=>{
        if(e._id === res.find_post._id){
          return res.find_post
        } else {
          return e
        }
      })
      setpost(newPost)
      setcomment("")
    }
  }
  const hide = () => {
    setvisible("invisible")
  }
  return (
    <div className={`container d-flex align-items-center justify-content-center w-100 fixed-bottom my-3 border-rounded ${visible}`} style={style2} >
      <div className="w-100 d-flex align-items-center flex-column">
        <span className='text-danger fw-bold' style={style3} onClick={hide} >Close</span>
        <textarea className="form-control" id="exampleFormControlTextarea1" style={style} value={comment} onChange={Comment} rows="3" cols="5"></textarea>
        <span className='text-danger h4 fw-bolder inline-block'>{err}</span>
        <button className='btn btn-primary fw-bold w-25 my-2' onClick={(event) => {
          addComment()
        }}>Add comment</button>
      </div>
    </div>
  )
}

export default Commentmodal
