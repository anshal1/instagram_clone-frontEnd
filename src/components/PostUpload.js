import React, { useContext } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useRef } from 'react'
import { useNavigate } from "react-router-dom"
import Mycontext from '../context/context'
import URL from "./URL"
import Resizer from "react-image-file-resizer";
const PostUpload = () => {
    const ref = useRef(null)
    const [other, setother] = useState({
        caption: "",
        hashtags: ""
    })
    const a = useContext(Mycontext)
    const { setalert, setprogress, socket, username, setpost, setcomment_post, setuploading_state } = a
    const [File, setFile] = useState()
    const [image, setimage] = useState()
    const navigate = useNavigate()

    // ? function to resize the image
    const resizeFile = (file) =>
        new Promise((resolve) => {
            Resizer.imageFileResizer(
                file,
                478,
                500,
                "JPG",
                100,
                0,
                (uri) => {
                    resolve(uri);
                },
                "base64"
            );
        });

        // ? function to turn the base64 string into fileObject to send to the server
    const dataURIToBlob = (dataURI) => {
        const splitDataURI = dataURI.split(",");
        const byteString =
            splitDataURI[0].indexOf("base64") >= 0
                ? atob(splitDataURI[1])
                : decodeURI(splitDataURI[1]);
        const mimeString = splitDataURI[0].split(":")[1].split(";")[0];

        const ia = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);

        return new Blob([ia], { type: mimeString });
    };

    const Showfile = async (e) => {
        const current_file = e.target.files[0].type
        const search_text = current_file.search("image")
        if (search_text === -1) {
            setalert({
                display: "block",
                msg: "File is not acceptable, please choose another file"
            })
            setTimeout(() => {
                setalert({
                    display: "none",
                    msg: ""
                })
            }, 3000)
        } else {
            let reader = new FileReader()
            reader.onload = (e) => {
                if ((e.loaded / e.total) * 100 === 100) {
                    setimage(e.target.result)
                }
            }
            reader.readAsDataURL(e.target.files[0])
            // if (e.target || e.target.files) {
            //     setFile(e.target.files[0])
            // }
            const newImage = await resizeFile(e.target.files[0])
            const newfile = dataURIToBlob(newImage)
            setFile(newfile)
            // setFile(e.target.files[0])
        }
    }
    const ChangeFile = () => {
        ref.current.click()
    }
    const follower_post = async () => {
        let url = `${URL}/follower/posts`
        let data = await fetch(url, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                instagram_clone: localStorage.getItem("instagram_clone")
            }
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
        }
    }
    useEffect(() => {
        if (image) {
            document.getElementById("Upload_btn").style = "display: none"
            document.getElementById("Upload_Image").style = "visibility: visible"
        } else {
            document.getElementById("Upload_btn").style = "display: block"
            document.getElementById("Upload_Image").style = "visibility: hidden"
        }
    }, [image])
    const getcaption_tags = (e) => {
        setother({ ...other, [e.target.name]: e.target.value })
    }
    const post = async () => {
        if (!File) {
            setalert({
                display: "block",
                msg: "Please select a image to share"
            })
            setTimeout(() => {
                setalert({
                    display: "none",
                    msg: ""
                })
            }, 3000)
        } else {

            let fd = new FormData()
            fd.append("post", File)
            fd.append("caption", other.caption)
            fd.append("hashtag", other.hashtags)
            const req = new XMLHttpRequest()
            req.open("POST", `${URL}/share/post`)
            req.upload.addEventListener("loadstart", () => {
                setuploading_state("started")
                setTimeout(() => {
                    navigate("/")
                }, 500)
            })
            req.upload.addEventListener("progress", (e) => {
                setprogress({
                    visibility: "visible",
                    width: `${Math.round((e.loaded / e.total) * 100)}%`
                })
            })
            req.addEventListener('error', (err) => {
                console.log(err)
                setuploading_state("Not started")
            })
            req.onload = () => {
                if (req.response) {
                    setuploading_state("Not started")
                    setprogress({
                        visibility: "hidden",
                        width: "0%"
                    })
                    window.scrollTo(0, 0)
                    setalert({
                        display: "block",
                        msg: req.response
                    })
                    setTimeout(() => {
                        setalert({
                            display: "none",
                            msg: ""
                        })
                    }, 3000)
                    follower_post()
                    socket?.emit("share_post", username)
                }
            }
            req.setRequestHeader("instagram_clone", localStorage.getItem("instagram_clone"))
            req.send(fd)
        }
    }
    return (
        <>
            <div className="file_upload" id='for_file_upload'>
                <input type="file" ref={ref} onChange={Showfile} id="File" />
                <img src={image} alt="" onClick={ChangeFile} id="Upload_Image" />
                <i className="fa-solid fa-plus" id='Upload_btn' onClick={ChangeFile}></i>
            </div>
            <div className="uploadCaption">
                <label >Caption</label>
                <input type="text" name='caption' onChange={getcaption_tags} value={other.caption} />
                <label>Tags</label>
                <textarea name="hashtags" onChange={getcaption_tags} id="tags" cols="50" rows="10" placeholder='#friends etc' value={other.hashtags}></textarea>
                <button className='btn btn-primary my-2 fw-bold' onClick={post}>Post</button>
            </div>
        </>
    )
}

export default PostUpload
