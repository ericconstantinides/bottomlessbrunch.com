/* global google */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Field, FormSection, reduxForm, change as fieldValue } from 'redux-form'
import PlacesAutocomplete, {
  // geocodeByAddress,
  geocodeByPlaceId,
  getLatLng
} from 'react-places-autocomplete'
import GoogleMapReact from 'google-map-react'
import { fitBounds } from 'google-map-react/utils'
import { addRegion, editRegion } from '../../../actions'
import { usaMap } from '../../../config'

class AddEditRegion extends Component {
  constructor (props) {
    super(props)
    this.state = {
      map: usaMap,
      address: '',
      loaded: false
    }
    this.onChange = address => this.setState({ address })
  }
  renderField (field) {
    const { touched, error } = field.meta
    const fieldType = field.type ? field.type : 'text'
    const className = `AddEditRegion__form-group form-group ${touched && error ? 'has-danger' : ''}`
    return (
      <div className={className}>
        <label className='AddEdit__label'>{field.lbl}</label>
        <input className='form-control' type={fieldType} {...field.input} />
        <small className='text-help'>
          {touched ? error : ''}
        </small>
      </div>
    )
  }
  // gets called after successful validation:
  onSubmit (values) {
    const { addRegion, editRegion, history, match } = this.props
    if (match.params.id) {
      editRegion(match.params.id, values, history)
    } else {
      addRegion(values, history)
    }
  }
  handleMapLoaded = map => {
    if (this.props.match.params.id && this.props.initialValues) {
      this.setState((prevState, props) => {
        return { map: this.props.initialValues }
      })
    }
  }
  handleMapMoved = position => {
    // if we're editing an existing region:
    if (this.props.thisForm && this.props.thisForm.addEditRegion) {
      this.props.fieldValue('addEditRegion', 'zoom', position.zoom)
      this.props.fieldValue(
        'addEditRegion',
        'position.lat',
        position.center.lat
      )
      this.props.fieldValue(
        'addEditRegion',
        'position.lng',
        position.center.lng
      )
    } else if (!this.state.loaded) {
      // get the real dimensions for the usa map
      const {center, newBounds, zoom} = fitBounds(usaMap.bounds, position.size)
      this.setState({
        loaded: true,
        map: {bounds: newBounds, position: center, zoom }
      })
    }


  }
  handleSelect = (address, placeId) => {
    geocodeByPlaceId(placeId)
      .then(results => console.log(results))
      .catch(error => console.error(error))
    // this.setState({ address, placeId })

    // You can do other things with address string or placeId. For example, geocode :)
  }
  render () {
    // pull out the redux-form handleSubmit function from props:
    const { handleSubmit, pristine, submitting, thisForm } = this.props
    const title = thisForm.addEditRegion &&
      thisForm.addEditRegion.values &&
      thisForm.addEditRegion.values.name
      ? <h1>{thisForm.addEditRegion.values.name}</h1>
      : <h1>&nbsp;</h1>
    const AutocompleteItem = ({ formattedSuggestion }) => (
      <div>
        <strong>{formattedSuggestion.mainText}</strong>{' '}
        <small>{formattedSuggestion.secondaryText}</small>
      </div>
    )
    const inputProps = {
      value: this.state.address,
      onChange: this.onChange
    }
    const options = {
      location: new google.maps.LatLng(
        usaMap.position.lat,
        usaMap.position.lng
      ),
      radius: 3500,
      types: ['(cities)']
    }
    return (
      <div className='AddEdit AddEditRegion container'>
        {title}
        {/* the handleSubmit is from redux-form */}
        <form
          className='AddEdit__form'
          onSubmit={handleSubmit(this.onSubmit.bind(this))}
        >
          <div className='AddEdit__col-left'>
            <Field lbl='Region Name' name='name' component={this.renderField} />
            <Field lbl='Slug' name='slug' component={this.renderField} />
            <Field
              lbl='Zoom'
              name='zoom'
              type='number'
              component={this.renderField}
            />
            <FormSection name='position'>
              <Field
                lbl='Latitude'
                name='lat'
                type='number'
                component={this.renderField}
              />
              <Field
                lbl='Longitude'
                name='lng'
                type='number'
                component={this.renderField}
              />
            </FormSection>
            <button
              type='submit'
              className='btn btn-sm btn-primary'
              disabled={pristine || submitting}
            >
              Submit
            </button>
            <Link to='/admin/regions' className='btn btn-sm btn-danger'>
              Cancel
            </Link>
          </div>
          <div className='AddEdit__col-right'>
            <PlacesAutocomplete
              inputProps={inputProps}
              autocompleteItem={AutocompleteItem}
              styles={{ root: { zIndex: 999999999 } }}
              onSelect={this.handleSelect}
              options={options}
              googleLogo={false}
            />
            <GoogleMapReact
              onGoogleApiLoaded={this.handleMapLoaded}
              yesIWantToUseGoogleMapApiInternals
              zoom={this.state.map.zoom}
              center={this.state.map.position}
              onChange={this.handleMapMoved}
            />
          </div>
        </form>
      </div>
    )
  }
}

function validate (values) {
  const errors = {}
  // Validate the inputs from 'values'
  if (!values.name) {
    errors.name = 'Enter a name'
  }
  if (!values.slug) {
    errors.slug = 'Enter some slug'
  }
  if (!values.zoom) {
    errors.zoom = 'Enter some zoom please'
  }
  if (!values.lat) {
    errors.lat = 'Enter some latitude please'
  }
  if (!values.lng) {
    errors.lng = 'Enter some longitude please'
  }
  // if errors is still empty, we're bueno!
  return errors
}

function mapStateToProps (state, ownProps) {
  // if we have an id, load the id region:
  if (ownProps.match.params.id) {
    return {
      thisForm: state.form,
      initialValues: state.regions[ownProps.match.params.id]
    }
  }
  // if we don't, just use your default
  return {
    thisForm: state.form
  }
}
// connect needs to be the outer-most thing run
export default connect(mapStateToProps, {
  addRegion,
  editRegion,
  fieldValue
})(
  reduxForm({
    form: 'addEditRegion',
    validate,
    enableReinitialize: true
  })(AddEditRegion)
)
