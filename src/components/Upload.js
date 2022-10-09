import React, { useState } from 'react'
import "../Stylings/Upload.css"
import PostUpload from './PostUpload'
import StoryUpload from './StoryUpload'
const Upload = () => {
    const [border, setborder] = useState("")
    const [border2, setborder2] = useState("borderd")
    const [uploadDOM, setuploadDOM] = useState(<PostUpload />)
    const ChangeDOM =(e)=>{
        if(e.target.innerHTML === "Story"){
            setuploadDOM(<StoryUpload />)
            setborder("borderd")
            setborder2("")
        } else {
            setuploadDOM(<PostUpload />)
            setborder("")
            setborder2("borderd")
        }
    }
    return (
        <>
            <div className="story_post">
                <p className={border2} onClick={ChangeDOM} >Post</p>
                <p className={border} onClick={ChangeDOM} >Story</p>
            </div>
            <div className='main_upload_container'>
                {uploadDOM}
            </div>
        </>
    )
}

export default Upload
