import React from 'react'
import Select from 'react-select'
// Be sure to include styles at some point, probably during your bootstrapping
import 'react-select/dist/react-select.css'

export default props => {
  if (!props.multi) {
    return (
      <Select
        {...props}
        value={props.input.value}
        onChange={valueObj => {
          props.input.onChange(valueObj.value)
        }}
        onBlur={() => props.input.onBlur(props.input.value)}
        options={props.options}
      />
    )
  } else {
    return (
      <Select
        {...props}
        value={props.input.value}
        onChange={valueArr => {
          props.input.onChange(valueArr.map(val => val.value))
        }}
        onBlur={() => props.input.onBlur(props.input.value)}
        options={props.options}
      />
    )
  }
}
