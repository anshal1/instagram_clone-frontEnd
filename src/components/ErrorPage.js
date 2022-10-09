import React from 'react'
import "../Stylings/ErrorPage.css"
const ErrorPage = (props) => {
  return (
    <div className='main_error_container'>
      <h1>{props.msg}</h1>
    </div>
  )
}

export default ErrorPage
