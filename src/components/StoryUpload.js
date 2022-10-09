import React, { useContext } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Mycontext from '../context/context'
import "../Stylings/Upload.css"
import URL from './URL'
const StoryUpload = () => {
    const ref = useRef()
    const a = useContext(Mycontext)
    const { setalert, setprogress } = a
    const [video, setvideo] = useState()
    const [backend_video, setbackend_video] = useState()
    const navigate = useNavigate()

    const GetVideo = (e) => {
        if (e.target.files[0].size <= 68069200) {
            let myvideo = new FileReader()
            setbackend_video(e.target.files[0])
            myvideo.onload = (e) => {
                setvideo(e.target.result)
            }
            myvideo.readAsDataURL(e.target.files[0])
        } else {
            setalert({
                display: "block",
                msg: "This file is too large"
            })
            setTimeout(() => {
                setalert({
                    display: "none",
                    msg: ""
                })
            }, 4000)
        }
    }
    const upload = async () => {
        if (!backend_video) {
            setalert({
                display: "block",
                msg: "Video is required"
            })
            setTimeout(() => {
                setalert({
                    display: "none",
                    msg: ""
                })
            }, 4000)
        } else {
            let fd = new FormData()
            fd.append("story", backend_video)
            const req = new XMLHttpRequest()
            req.open("POST", `${URL}/story`)
            req.addEventListener('loadstart', () => {
                navigate("/")
            })
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
                    setTimeout(() => {
                        setprogress({
                            visibility: "hidden",
                            width: "100%"
                        })
                    }, 300)
                }
            })
            req.addEventListener("load", () => {

                let res = req.responseText
                if (res) {
                    setalert({
                        display: "block",
                        msg: res
                    })
                    setTimeout(() => {
                        setalert({
                            display: "none",
                            msg: ""
                        })
                    }, 4000)
                }
                if (res === "Story added successfully" || res === "Story updated successfully") {
                }
            })
            req.setRequestHeader("instagram_clone", localStorage.getItem("instagram_clone"))
            req.send(fd)
        }
    }
    useEffect(() => {
        if (video) {
            document.getElementById("Video").style = "visibility: visible"
            document.getElementById("story_upload_btn").style = "display: none"
        } else {
            document.getElementById("Video").style = "visibility: hidden"
            document.getElementById("story_upload_btn").style = "display: block"
        }
    }, [video])
    const ChangeVideo = () => {
        ref.current.click()
    }
    return (
        <>
            <div className="main_story_upload-container">
                <div className="for_video">
                    <video src={video} controls={true} id="Video" onClick={ChangeVideo} ></video>
                    <i className='fa-solid fa-plus' id='story_upload_btn' onClick={ChangeVideo}><span>Choose a Video</span></i>
                </div>
                <input type="file" ref={ref} onChange={GetVideo} id="video_File" />
                <button className='btn btn-primary fw-bold my-2' onClick={upload}>Post</button>
            </div>
        </>
    )
}

export default StoryUpload
