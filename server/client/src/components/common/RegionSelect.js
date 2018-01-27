import React from 'react'
import Select from 'react-select'
import 'react-select/dist/react-select.css'

const RegionSelect = ({ className, region, handleChange, options }) => {
  return (
    <div className={`RegionSelect__container ${className && className}`}>
      <Select
        className='RegionSelect'
        value={region}
        searchable={false}
        clearable={false}
        onChange={handleChange}
        options={options}
      />
    </div>
  )
}

export default RegionSelect
