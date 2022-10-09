import React from 'react'

const Pageloader = () => {
    const style ={
        height: "90vh"
    }
    return (
        <div className='w-100 d-flex align-items-center justify-content-center' style={style}>
            <div className="spinner-grow text-dark" role="status" >
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )
}

export default Pageloader
