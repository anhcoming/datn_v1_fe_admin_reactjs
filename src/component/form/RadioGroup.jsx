import React from 'react'

const RadioGroup = (props) => {
    const { obj, handleClick, registerForm } = props
    const {data} = obj

    return (
        <div>
            {obj && data ? data.map((item, index) => (
                <div key={index} className="form-check">
                    <input className="form-check-input" type="radio"
                        name={obj.name} id={item.id}
                        value={item.value}
                        defaultChecked={item.defaultChecked}
                        onClick={handleClick}
                        {...registerForm(`${obj.registerName}`)} />
                    <label className="form-check-label" htmlFor={item.id}>{item.label}</label>
                </div>
            )) : null}
        </div>
    )
}

export default RadioGroup