import Mycontext from "./context";
import React, { useEffect, useState } from 'react'
import URL from "../components/URL";
import io from "socket.io-client"
const State = (props) => {
  const [load, setload] = useState({
    width: "0%",
    visibility: "0",
  })
  const [alert, setalert] = useState({
    display: "none",
    msg: ""
  })
  //   }
  // }, [localStorage.getItem("instagram_clone")])
  const [data, setdata] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
    link: ""
  })
  const [progress, setprogress] = useState({
    visibility: "hidden",
    width: "0%"
  })
  const [socket, setsocket] = useState(null)
  const [comment_post, setcomment_post] = useState({})
  const [message, setmessage] = useState([])
  const [id, setid] = useState("")
  const [visible, setvisible] = useState("invisible")
  const [postlen, setpostlen] = useState([])
  const [username, setusername] = useState("")
  const [checkid, setcheckid] = useState("")
  const [post, setpost] = useState([])
  const [text_profile, settext_profile] = useState("")
  const [Current_user, setCurrentuser] = useState({})
  const [uploading_state, setuploading_state] = useState("Not started")
  const [allchats, setallchat] = useState([])
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
      setmessage(message.concat(res.current_user.like_messages, res.current_user.comment_messages, res.current_user.follow_messages))
      setCurrentuser(res.current_user)
    }
  }
  useEffect(() => {
    setsocket(io(URL))
  }, [username])
  useEffect(() => {
    socket?.emit("newuser", username)
  }, [socket, username])
  useEffect(() => {
    socket?.on("receive_chat", (data) => {
      if (data) {
        return setallchat((prev) => [...prev, data])
      }
    })
  }, [socket])
  useEffect(() => {
    current_user();
    // eslint-disable-next-line
  }, [])

  // ? the states below is going to be in use to render profiles and other user data because when we will host our app uploading a image is going to take time so we want some states to be in a que an change themselves 

  const [after_profile, setafter_edit_profile] = useState("")
  return (
    <Mycontext.Provider value={{ load, setload, alert, setalert, data, setdata, username, postlen, setpostlen, progress, setprogress, visible, setvisible, id, setid, setcomment_post, comment_post, post, setpost, checkid, setusername, setcheckid, after_profile, setafter_edit_profile, message, text_profile, settext_profile, uploading_state, setuploading_state, socket, Current_user, allchats, setallchat }} >
      {props.children}
    </Mycontext.Provider>
  )
}

export default State
