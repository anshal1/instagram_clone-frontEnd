import React, { useContext, useEffect, useRef, useState } from 'react'
import Mycontext from '../context/context'
import "../Stylings/Home.css"
import Storybox from './Storybox'
import { useNavigate } from "react-router-dom"
import URL from "./URL"
import Defaultpost from './Defaultpost'
import StoryLoader from './StoryLoader'
import { format } from 'timeago.js'
const Home = () => {
  const navigate = useNavigate()
  const ref = useRef()
  const a = useContext(Mycontext)
  const { setload, username, setvisible, visible, post, setpost, setid, setcomment_post, checkid, setalert, setusername, setcheckid, uploading_state, socket } = a
  const [story, setstory] = useState("")
  const [myclass, setmyclass] = useState("story_container")
  const [msg, setmsg] = useState("")
  const [current_userstory, setcurrent_userstory] = useState({})
  const [followerstory, setfollowerstory] = useState([])
  const [story_poster, setstory_poster] = useState("")
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
      setusername(res.current_user.username);
      setcheckid(res.current_user._id);
      setstory_poster(res.current_user.profile);
    }
  }

  const follower_post = async () => {
    setload({
      width: "10%",
      visibility: "1"
    })
    let url = `${URL}/follower/posts`
    let data = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        instagram_clone: localStorage.getItem("instagram_clone")
      }
    })
    setload({
      width: "40%",
      visibility: "1"
    })
    let res = await data.json()
    if (!res.success) {
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
      if (res.find_post.length < 1) {
        setmsg("Follow other peoples to see their photos and videos")
      }
    }
    else if (res.success) {
      setpost(res.follower_post)
      setcomment_post(res.follower_post)
    } else {
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
      if (res.find_post.length < 1) {
        setmsg("Follow other peoples to see their photos and videos")
      }
    }
    setload({
      width: "100%",
      visibility: "1"
    })
  }
  const [story_msg, setstory_msg] = useState("")
  const user_story = async () => {
    let url = `${URL}/user/story`
    let data = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        instagram_clone: localStorage.getItem("instagram_clone")
      }
    })
    let res = await data.json()
    setloading(false)
    if (!res.story) {
      setstory_msg(res.msg)
      document.getElementById("addstory").setAttribute("id", "addstory_dis_block")
      document.getElementById("current_user_story").style.display = "none"
    } else {
      document.getElementById("addstory").setAttribute("id", "addstory")
      document.getElementById("current_user_story").style.display = "block"
      setcurrent_userstory(res.story)
      story_Date(res.story.date)
      setstory_msg("")
    }
    // .log(res)
  }
  // this function will fetch the stories of the users the current user follows
  const follower_story = async () => {
    let url = `${URL}/follower/story`
    let data = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        instagram_clone: localStorage.getItem("instagram_clone")
      }
    })
    let res = await data.json()
    if (res.story) {
      setfollowerstory(res.story)
    }
  }
  useEffect(() => {
    if (localStorage.getItem("instagram_clone") === null) {
      navigate("/signup")
    } else {
      if (uploading_state === "Not started") {
        navigate("/")
        current_user()
        follower_post()
        user_story()
        follower_story()

      } else {
        current_user()
        user_story()
      }
    }
  }, [uploading_state])

  // function to show the story
  const Showstory = async (id) => {
    setmyclass("_block")
    let url = `${URL}/one/user/story/${id}`
    let data = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        instagram_clone: localStorage.getItem("instagram_clone")
      }
    })
    let res = await data.json()
    setstory(res.story.story)
  }
  // function to close the story
  const close = () => {
    setstory("")
    setmyclass("story_container")
  }
  const toUser = (id) => {
    if (id === checkid) {
      navigate("/profile")
    } else {
      localStorage.setItem("user_id", id)
      navigate("/user/profile")
    }
  }
  const Like = async (image) => {
    let url = `${URL}/like/${image._id}`
    let data = await fetch(url, {
      method: "PUT",
      headers: {
        instagram_clone: localStorage.getItem("instagram_clone")
      }
    })
    let res = await data.json()
    if(res){
      socket?.emit("like", image)
    }
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
  const Right = () => {
    document.getElementById("parent").scrollLeft += 60
  }
  const Left = () => {
    document.getElementById("parent").scrollLeft -= 60
  }
  const toShare = (e) => {
    navigate("/upload")
  }
  const comment = (id) => {
    setvisible("visible")
    setid(id)
    localStorage.setItem("comment_id", id)
    if (visible === "visible") {
      setvisible("invisible")
    } else {
      setvisible("visible")
    }
  }
  const toComment = (id) => {
    localStorage.setItem("postcomment_id", id)
    navigate("/comment")
  }
  const getDate = (date) => {
    const ideaDate = new Date(date)
    const idea_seconds = ideaDate.getSeconds()
    const idea_minute = ideaDate.getMinutes()
    const idea_hour = ideaDate.getHours()
    const idea_date = ideaDate.getDate()
    const idea_month = ideaDate.getMonth()
    const idea_year = ideaDate.getFullYear()

    const current_date = new Date()
    const current_minutes = current_date.getMinutes()
    const current_seconds = current_date.getSeconds()
    const current_hour = current_date.getHours()
    const current_Date = current_date.getDate()
    const current_month = current_date.getMonth()
    const current_year = current_date.getFullYear()
    if (Math.abs(current_seconds - idea_seconds) <= 59 && Math.abs(current_seconds - idea_seconds) >= 0 && Math.abs(current_minutes - idea_minute) === 0 && Math.abs(current_hour - idea_hour) === 0 && idea_date === current_Date && idea_month === current_month && idea_year === current_year) {
      return ("Just Now")
    } else if (Math.abs(current_minutes - idea_minute) >= 0 && Math.abs(current_minutes - idea_minute) <= 59 && Math.abs(current_hour - idea_hour) === 0 && idea_date === current_Date && idea_month === current_month && idea_year === current_year) {
      return (`${current_minutes - idea_minute} minutes ago`)
    } else if (Math.abs(current_hour - idea_hour) >= 0 && Math.abs(current_hour - idea_hour) <= 23 && current_Date === idea_date && idea_month === current_month && idea_year === current_year) {
      return (`${current_hour - idea_hour} hours ago`)
    } else if (Math.abs(current_Date - idea_date) >= 1 && Math.abs(current_Date - idea_date) <= 30 && idea_month === current_month && idea_year === current_year) {
      return (`${current_Date - idea_date} day ago`)
    } else if (Math.abs(current_month - idea_month) >= 0 && Math.abs(current_month - idea_month) <= 11 && idea_year === current_year) {
      return (`${current_month - idea_month} months ago`)
    }
    else {
      return (`${current_year - idea_year} years ago`)
    }
  }
  const remove_story = async () => {
    let url = `${URL}/remove/story`
    let data = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        instagram_clone: localStorage.getItem("instagram_clone")
      }
    })
    let res = await data.json()
  }
  const story_Date = (date) => {
    const current_date = new Date()
    const current_hour = current_date.getHours()
    const current_Date = current_date.getDate()
    const current_month = current_date.getMonth()
    const current_year = current_date.getFullYear()

    const story_date = new Date(date)
    const story_hour = story_date.getHours()
    const story_Date = story_date.getDate()
    const story_month = story_date.getMonth()
    const story_year = story_date.getFullYear()
    if (Math.abs(current_hour - story_hour) === 0 && Math.abs(current_Date - story_Date) === 1 && current_month === story_month && current_year === story_year) {
      remove_story()
    }

  }

  // this function will add the story video to the video tag when the user clicks on the story
  const ShowCurrent_user_story = async () => {
    setmyclass("_block")
    let url = `${URL}/user/story`
    let data = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        instagram_clone: localStorage.getItem("instagram_clone")
      }
    })
    let res = await data.json()
    setstory(res.story.story)
  }
  const Deletepost = async (id) => {
    const newpost = post.filter((e) => {
      return e._id !== id
    })
    setpost(newpost)
    let url = `${URL}/delete/post/${id}`
    let data = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        instagram_clone: localStorage.getItem("instagram_clone")
      }
    })
    let res = await data.json()
    if (res.success) {
      setalert({
        display: "block",
        msg: res.msg
      })
      setTimeout(() => {
        setalert({
          display: "none",
          msg: ""
        })
      }, 3000)
    }
  }
  const bookmark = async (id) => {
    let url = `${URL}/save/${id}`
    let data = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        instagram_clone: localStorage.getItem("instagram_clone")
      }
    })
    let res = await data.json()
    if (res.success) {
      setalert({
        display: "block",
        msg: res.msg,
      })
      const newpost = post.map((e) => {
        if (e._id === res.find_post._id) {
          return res.find_post
        } else {
          return e
        }
      })
      setpost(newpost)
    } else if (!res.success) {
      setalert({
        display: "block",
        msg: res.error,
      })
    }
  }
  const removebookmark = async (id) => {
    let url = `${URL}/remove/save/${id}`
    let data = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        instagram_clone: localStorage.getItem("instagram_clone")
      }
    })
    let res = await data.json()
    if (res.success) {
      setalert({
        display: "block",
        msg: res.msg,
      })
      const newpost = post.map((e) => {
        if (e._id === res.find_post._id) {
          return res.find_post
        } else {
          return e
        }
      })
      setpost(newpost)
    } else if (!res.success) {
      setalert({
        display: "block",
        msg: res.error,
      })
    }
  }
  const Callme = (e) => {
    
  }
  useEffect(() => {
    current_user()
  }, [])
  return (
    <>
      <Storybox class={myclass} close={close} video={story} />
      <div className='main_container'>
        <div className="stories_and_post">
          {followerstory.length <= 7 ? " " : <div className="arrowbtns">
            <i className="fa-solid fa-arrow-left" id="left" onClick={Left}></i>
            <i className="fa-solid fa-arrow-right" onClick={Right}></i>
          </div>}
          <div className="scroll_story" id='parent'>
            <div className="stories">
              {/* Story box */}

              {/* this is current user story */}
              {/* add story loader here */}
              {loading ? <StoryLoader /> : <div>
                <i className='fa-solid fa-plus' id='addstory' onClick={toShare}><span id='story_msg'>{story_msg}</span></i>
                <img onClick={ShowCurrent_user_story} src={current_userstory.poster} alt="" id="current_user_story" className='Story_image' />
              </div>}

              {/* this is the stories of the users current user follows */}
              {followerstory.map((e) => {
                return <img onClick={() => { Showstory(e.user_id) }} key={e._id} src={e.poster} alt="" className='Story_image' />

              })}
            </div>
          </div>
          <div className="post">
            {post.length < 1 ? <Defaultpost msg={msg} /> : ""}
            {post.map((e) => {
              return <div className="post_box" key={e._id}>
                {/* Posts Box */}
                <span className='profile_name_box'> <span id='to_profile' onClick={() => { toUser(e.user_id) }}><img src={e.user_profile} alt="" className='profile' /><p className="home_username">{e.username}</p></span>  <span className='post_menu'><div className="btn-group dropstart">
                  <i className="dropdown-toggle fa-2x" data-bs-toggle="dropdown" ref={ref} aria-expanded="false">
                  </i>
                  <ul className="dropdown-menu">
                    {e.username === username ? <li className='dropdown-item' onClick={() => { Deletepost(e._id) }}>Delete</li> : ""}
                    <li className='dropdown-item'>Report</li>
                    <li className='dropdown-item'>Share</li>
                  </ul>
                </div>
                </span> </span>
                <img src={e.image} onLoad={Callme} alt="" className='post_img' />
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
                      Like(e)
                    }, 500)
                  }}></i>
                  {/* Comment btn */}
                  <i className="fa-regular fa-comment" onClick={() => {
                    comment(e._id)
                  }} ></i>
                  {/* Save btn */}
                  {e.saved.includes(username) ? <i className="fa-solid fa-bookmark" onClick={(event) => {
                    event.target.classList = "fa-regular fa-bookmark"
                    removebookmark(e._id)
                  }}></i> : <i className="fa-regular fa-bookmark" onClick={(event) => {
                    event.target.classList = "fa-solid fa-bookmark"
                    bookmark(e._id)
                  }}></i>}
                </div>
                <div className="captions">
                  <p className="likes">{e.likes.length} Likes</p>
                  <p className="caption">{e.caption}</p>
                </div>
                <div className="comments">
                  <p className="one_comment">{e.comments.length < 1 ? "" : <span><span className='fw-bolder' style={{ fontSize: ".7rem", cursor: "pointer" }} onClick={() => { toUser(e.comments[e.comments.length - 1].user_id) }}>{e.comments[e.comments.length - 1].username} </span>{e.comments[e.comments.length - 1].comment.length > 85 ? e.comments[e.comments.length - 1].comment.slice(0, 85) + "..." : e.comments[e.comments.length - 1].comment}</span>}</p>
                  <p className="allcomment" onClick={() => { toComment(e._id) }}>{e.comments.length < 1 ? "No comments" : `See all ${e.comments.length} comments`} </p>
                  <p className="date">{e.current_date ?format(e.current_date) : ""}</p>
                </div>
              </div>
            })}
          </div>
        </div>
        {/* <div className="others">
          <div className="suggested">
            <h3 style={{ textAlign: "center" }}>Suggested for you</h3>
            <hr />
            {!suggest || suggest.length < 1 ? <span className='suggested_box'><p>{sugmsg}</p></span> : <span className='suggested_box'><img src={Image} alt="" className='profile' /><p>Anshal_18</p><button>Follow</button></span>}
            <hr />
            <p className="see_all">See all</p>
          </div>
        </div> */}
      </div>
    </>
  )
}

export default Home
