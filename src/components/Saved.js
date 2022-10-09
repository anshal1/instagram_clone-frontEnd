import React, { useEffect, useState } from 'react'
import URL from './URL'
const Saved = () => {
  const [saved, setsaved] = useState([])
    const current_user = async () => {
        if (localStorage.getItem("instagram_clone") === null) {
    
        } else {
          let url = `${URL}/saved/post`;
          let data = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              instagram_clone: localStorage.getItem("instagram_clone")
            }
          });
          let res = await data.json();
          setsaved(res.find_saved)
        }
      }
      useEffect(()=>{
        current_user()
      }, [])
    return (
        <div>
            <div className="saved">
              {saved.map((e)=>{
                return <img key={e.post._id} src={e.post.image} className='profile_page_posts' />
              })}
            </div>
        </div>
    )
}

export default Saved
