import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Mycontext from '../context/context'
import "../Stylings/Edit.css"
import Loader from './Loader'
import URL from './URL'
const Edit = () => {
    const a = useContext(Mycontext)
    const { setalert, data, setdata, setprogress, setafter_edit_profile , settext_profile} = a
    const [error, seterror] = useState({
        error: "",
        display: "none"
    })
    const [error2, seterror2] = useState({
        error: "",
        display: "none"
    })
    const [profile, setprofile] = useState("")
    const [backend_profile, setbackend_profile] = useState({})
    const [preview, setpreview] = useState("")
    const [none, setnone] = useState("none")
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
            let res = await data.json()
            setprofile(res.current_user.profile)
            setafter_edit_profile(res.current_user.profile)
            setdata({
                name: res.current_user.name,
                username: res.current_user.username,
                bio: res.current_user.bio,
                email: res.current_user.email,
                link: res.current_user.link
            })
        }
    }
    const editProfile = async () => {
        if (!backend_profile) {
            setalert({
                display: "block",
                msg: "Please select a valid image"
            })
            setTimeout(() => {
                setalert({
                    display: "none",
                    msg: ""
                })
            }, 4000)
        } else {
            let url = `${URL}/edit/profile`
            const fd = new FormData()
            fd.append("profile", backend_profile)
            const req = new XMLHttpRequest()
            req.open("PUT", url)
            req.upload.addEventListener("progress", (e) => {
                setprogress({
                    visibility: "visible",
                    width: `${Math.round((e.loaded / e.total) * 100)}%`
                })
                if (Math.round((e.loaded / e.total) * 100) === 100) {
                    setprogress({
                        visibility: "visible",
                        width: "100%"
                    })
                }
            })
            req.addEventListener("load", () => {
                current_user()
                if (req.response) {
                    setprogress({
                        visibility: "hidden",
                        width: "100%"
                    })
                    setalert({
                        display: "block",
                        msg: "Profile Image updated successfully"
                    })
                    settext_profile(req.responseText)
                    
                }
            })
            req.setRequestHeader("instagram_clone", localStorage.getItem("instagram_clone"))
            req.send(fd)
        }
    }
    useEffect(() => {
        current_user()
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        console.log(ca)
    }, [])
    const getprofile = (e) => {
        const reader = new FileReader()
        reader.addEventListener("progress", (e) => {
            setprogress({
                visibility: "visible",
                width: `${Math.round((e.loaded / e.total) * 100)}%`
            })
            if (Math.round((e.loaded / e.total) * 100) === 100) {
                setprogress({
                    visibility: "visible",
                    width: "100%"
                })
                setTimeout(() => {
                    setprogress({
                        visibility: "hidden",
                        width: "100%"
                    })
                }, 300)
            }
        })
        reader.addEventListener("load", (e) => {
            document.cookie = "profile=changed"
            setprofile(e.target.result)
        })
        reader.readAsDataURL(e.target.files[0])
        if (e.target || e.target.files) {
            setbackend_profile(e.target.files[0])
        }
    }
    const otherUpdate = async() => {
        let url = `${URL}/edit`
        let Data = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                instagram_clone: localStorage.getItem("instagram_clone")
            },
            body: JSON.stringify({ name: data.name, username: data.username, email: data.email, bio: data.bio, link: data.link })
        })
        let res = await Data.json()
        if (res.success === "username") {
            seterror({
                error: res.error,
                display: "block"
            })
            setTimeout(() => {
                seterror({
                    error: "",
                    display: "none"
                })
            }, 3000)
        } else if (res.success === "email") {
            seterror2({
                error: res.error,
                display: "block"
            })
            setTimeout(() => {
                seterror2({
                    error: "",
                    display: "none"
                })
            }, 3000)
        } else {
            setprogress({
                visibility: "visible",
                width: "100%"
            })
            setTimeout(() => {
                setprogress({
                    visibility: "hidden",
                    width: "100%"
                })
            }, 300)
            setalert({
                display: "block",
                msg: "Profile updated"
            })
            setTimeout(() => {
                setalert({
                    display: "none",
                    msg: ""
                })
            }, 3000)
        }
        if (res.update) {
            navigate("/profile")
        }
    }
    const navigate = useNavigate()
    const Update = async () => {
        otherUpdate()
        editProfile()
        document.cookie("", "expires=Thu, 01 Jan 1970 00:00:00 UTC;")
        document.cookie("", "expires=Thu, 01 Jan 1970 00:00:00 UTC;")
    }
    const getData = (e) => {
        document.cookie = "profile-data=changed"
        setdata({ ...data, [e.target.name]: e.target.value })
    }
    const ref = useRef()
    const Upload = () => {
        ref.current.click()
    }
    return (
        <>
            <div className="edit_container">
                <input type="file" className='d-none' ref={ref} onChange={getprofile} />
                <span className={`d-${none}`}> <Loader /> </span>
                <img src={profile} onClick={Upload} alt="" id='user_image' />
                <div className="all_inputs">
                    <div className="mb-3">
                        <label htmlFor="exampleFormControlInput1" className="form-label fw-bold">Name</label>
                        <input type="text" className="form-control" onChange={getData} name='name' value={data.name} id="exampleFormControlInput1" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleFormControlInput1" className="form-label fw-bold">username</label>
                        <input type="text" className="form-control" onChange={getData} name='username' value={data.username} id="exampleFormControlInput1" /> <span className={`text-danger fw-bolder d-${error.display}`}>{error.error}</span>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleFormControlInput1" className="form-label fw-bold">Email address</label>
                        <input type="email" className="form-control" onChange={getData} name='email' value={data.email} id="exampleFormControlInput1" /> <span className={`text-danger fw-bolder d-${error2.display}`}>{error2.error}</span>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleFormControlTextarea1" className="form-label fw-bold">Bio</label>
                        <textarea className="form-control" onChange={getData} name='bio' value={data.bio} id="exampleFormControlTextarea1" rows="3"></textarea>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleFormControlInput1" className="form-label fw-bold">Link</label>
                        <input type="url" className="form-control" onChange={getData} name='link' value={data.link} id="exampleFormControlInput1" />
                    </div>
                </div>
                <button className='btn btn-primary fw-bold' onClick={Update}>Update</button>
            </div>
        </>
    )
}

export default Edit
