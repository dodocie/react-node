import React from 'react'

const Button = props => {
  return (
    <button className="width-450 margin-top-03 margin-auto height-96 bg-blue font-white border-radius-024 flex-center font-subtitle-large" type={props.type}>{props.children}</button>
  )
}

export default Button