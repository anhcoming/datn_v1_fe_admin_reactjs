import React from 'react'

const RadioItem = ({id, name, value, defaultChecked, label, handleClick, register}) => {
  return (
    <div className="form-check">
    <input className="form-check-input" type="radio" name={name} id={id} value={value} defaultChecked={defaultChecked || false} onClick={handleClick} {...register(`${register}`)} />
    <label className="form-check-label" htmlFor="percentTypeRadio">{label}</label>
</div>  )
}

export default RadioItem