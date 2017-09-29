/* global google */
import React from 'react'
import PlacesAutocomplete from 'react-places-autocomplete'
import { usaMap } from '../config'

const MapSearch = props => {
  const AutocompleteItem = ({ formattedSuggestion }) => (
    <div>
      <strong>{formattedSuggestion.mainText}</strong>{' '}
      <small>{formattedSuggestion.secondaryText}</small>
    </div>
  )
  const inputProps = {
    value: props.address,
    onChange: props.onChange,
    placeholder: props.placeholder
  }
  const options = {
    location: new google.maps.LatLng(usaMap.lat, usaMap.lng),
    radius: 3500,
    types: ['(cities)']
  }
  return (
    <PlacesAutocomplete
      inputProps={inputProps}
      autocompleteItem={AutocompleteItem}
      styles={{ root: { zIndex: 999999999 } }}
      onSelect={props.handleSelect}
      options={options}
      googleLogo={false}
    />
  )
}
export default MapSearch
