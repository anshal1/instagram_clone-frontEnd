import React, { useContext } from 'react'
import Mycontext from '../context/context'

const Progressbar = () => {
    const a = useContext(Mycontext)
    const {progress} = a
    const style ={
        height: "10px",
        visibility: progress.visibility,
        transition: "all .4s"
    }
    const style2 = {
        width: progress.width
    }
    return (
        <div className={`progress fixed-bottom my-3 mx-2`} style={style}>
            <div className="progress-bar" role="progressbar" style={style2} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
    )
}

export default Progressbar
