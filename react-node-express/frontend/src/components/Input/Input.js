import React from 'react'

const Input = props => {
  const {imgSrc, width = 'width-670'} = props.config || {}
  const classStr = `${width} height-07 padding-left-02 border-1 border-radius-016`
  return (
    <div className="input flex-start margin-top-03 position-relative width-670 border-bottom font-888d91">
      <label className='font-main width-200 font-333333' htmlFor={props.name}>{props.label}:</label>
      <input
        className='height-07 padding-left-02 min-width-400 font-333333'
        type={props.type}
        id={props.id}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
      />
      {imgSrc && <img className='width-200 height-07' alt='' src={imgSrc}/>}
    </div>
  )
}

export default Input