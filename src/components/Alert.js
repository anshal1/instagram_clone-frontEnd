import React from 'react'
import { useContext } from 'react'
import Mycontext from '../context/context'

const Alert = () => {
    const a = useContext(Mycontext)
    const { alert, setalert } = a
    const style = {
        zIndex: "100"
    }
    if (alert.display === "block") {
        setTimeout(() => {
            setalert({
                display: "none",
                msg: ""
            })
        }, 4000)
    }
    return (
        <div className="container w-50 fixed-bottom" style={style}>
            <div className={`alert alert-dark border border-secondary shadow p-3 mb-5 bg-body rounded d-${alert.display} fw-bolder container `} role="alert">
                {alert.msg}
            </div>
        </div>

    )
}

export default Alert
