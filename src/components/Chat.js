import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Mycontext from '../context/context'
import Pageloader from './Pageloader'
import URL from "./URL"
const Chat = () => {
    const a = useContext(Mycontext);
    const { socket, Current_user } = a;
    const [loading, setloading] = useState(true);
    const [user_msg, setuser_msg] = useState([]);
    const [onlineuser, setonlineuser] = useState([])
    const users_for_msg = async () => {
        let url = `${URL}/message/users`;
        let data = await fetch(url, {
            method: "POST",
            headers: {
                "Contect-type": "application/json",
                instagram_clone: localStorage.getItem("instagram_clone")
            }
        });
        let res = await data.json();
        const message_user = res.filter_user.filter((e)=>{
            return e.username !== Current_user.username
        })
        setuser_msg(message_user);
        setloading(false);
    }
    useEffect(() => {
        socket?.emit("connected_user",)
        socket?.on("All_users", (Users) => {
            if(Users){
                const online = Users.map((user)=>{
                    return user.username
                })
                setonlineuser(online)
                return
            }
        })
    }, [socket])
    useEffect(() => {
        users_for_msg()
    }, [])
    const navigate = useNavigate()
    const toChat_page = (User) => {
        localStorage.setItem("chat_id", User._id);
        localStorage.setItem("chat_user", User.username)
        navigate("/user/chat");
    }
    return (
        <div>
            {loading ? <Pageloader /> : <div className='container d-flex flex-row'>
                <form className="row g-3 container my-3">
                    <div className="col-auto">
                        <label htmlFor="inputPassword2" className="visually-hidden">Password</label>
                        <input type="password" className="form-control" id="inputPassword2" placeholder="Search user" />
                    </div>
                    <div className="col-auto">
                        <button type="submit" className="btn btn-primary mb-3 w-100">Search user</button>
                    </div>
                </form>
                <div className="card mb-3 my-3" style={{ maxWidth: "540px" }}>
                    {user_msg.length >= 1 ? user_msg.map((e) => {
                        return <div key={e._id} onClick={() => { toChat_page(e) }} className="row g-0" style={{ cursor: "pointer", margin: "10px" }}>
                            <div className="col-md-4">
                                <img src={e.profile} className="img-fluid rounded-start" alt="..." />
                            </div>
                            <div className="col-md-8">
                                <div className="card-body">
                                    <h5 className="card-title">{e.username}</h5>
                                    <p className="card-text"><small className={`text-${onlineuser.includes(e.username) ? "success" : "dark"}`}>{onlineuser.includes(e.username) ? "Online" : "Offline"}</small></p>
                                </div>
                            </div>
                        </div>
                    }) : <p className='fw-bolder h4' style={{ textAlign: "center", margin: "auto" }}>No User Found</p>}
                </div>
            </div>}
        </div>
    )
}

export default Chat
