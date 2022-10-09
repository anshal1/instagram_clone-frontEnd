import React from 'react'
import "../Stylings/Storybox.css"
const Storybox = (props) => {
  return (
    <div className={`${props.class}`}>
      <div className="story_box">
        <button className='close'onClick={props.close}>Close</button>
      <video src={props.video} autoPlay={true} controls={true} ></video>
      </div>
    </div>
  )
}

export default Storybox
