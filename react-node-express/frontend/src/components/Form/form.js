import React, {useState} from 'react'
import Input             from '../Input/Input'
import Button            from '../Button/Button'

const Form = props => {
  const {submitHandler, inputs, buttonName} = props
  
  function submit (e) {
    e.preventDefault()
    e.stopPropagation()
    submitHandler()
  }
  
  return (
      <section>
        <form onSubmit={submit} className='font-30'>
          {inputs.map(input=>(
              <Input key={input.id} type={input.type} config={input.config} label={input.label} id={input.name} placeholder={input.placeholder} onChange={input.changeHandler}/>
          ))}
          <Button type="submit">{buttonName}</Button>
        </form>
      </section>
  )
}

export default Form