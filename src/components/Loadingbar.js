import React, { useContext, useEffect } from 'react'
import Mycontext from '../context/context'
const Loadingbar = () => {
    const a = useContext(Mycontext)
    const {load, setload} = a
    const loadingStyle = {
        width: load.width,
        height: "7px",
        background: "rgb(255,0,121)",
        background: "linear-gradient(90deg, rgba(255,0,121,1) 0%, rgba(255,206,3,1) 37%)",
        opacity: load.visibility,
        transition: "all .4s",
        position: "sticky",
        top: "0"
    }
        if(load.width === "100%"){
            setTimeout(()=>{
                setload({
                    visibility: "0",
                    width: "100%"
                })
            }, 600)
        }
    return (
        <>
            <div style={loadingStyle}>

            </div>
        </>
    )
}

export default Loadingbar
