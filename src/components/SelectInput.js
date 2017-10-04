import React from 'react'
import Select from 'react-select'
// Be sure to include styles at some point, probably during your bootstrapping
import 'react-select/dist/react-select.css'

export default props => {
  return (
    <Select
      {...props}
      value={props.input.value}
      onChange={selectedVal => {
        if (Array.isArray(selectedVal)) {
          props.input.onChange(selectedVal.map(val => val.value))
        } else {
          props.input.onChange(selectedVal.value)
        }
        if (props.myOnChange) {
          props.myOnChange(selectedVal.value, props.index)
        }
      }}
      onBlur={() => props.input.onBlur(props.input.value)}
      options={props.options}
    />
  )
}
