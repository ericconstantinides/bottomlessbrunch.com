import React from 'react'
import Select from 'react-select'
import 'react-select/dist/react-select.css'

const RegionSelect = props => {
  return (
    <div className='RegionSelect__container'>
      <Select
        className='RegionSelect'
        value={props.region}
        searchable={false}
        clearable={false}
        onChange={props.handleChange}
        options={props.options}
      />
    </div>
  )
}

export default RegionSelect
