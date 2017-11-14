import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Field,
  // FormSection,
  reduxForm,
  change as fieldValue
} from 'redux-form'
// I may need these later below: geocodeByAddress, getLatLng
import { geocodeByPlaceId } from 'react-places-autocomplete'
import MapSearch from '../../MapSearch'
import GoogleMapReact from 'google-map-react'
import {
  addRegion,
  editRegion,
  addUiAppClass,
  removeUiAppClass
} from '../../../actions'
import { USA_MAP_COORDS } from '../../../config'
import {
  convertToBounds,
  fitBoundsGoogleReady,
  getAddy
} from '../../../lib/myHelpers'

class AddEditRegion extends Component {
  constructor (props) {
    super(props)
    this.state = {
      zoom: USA_MAP_COORDS.zoom,
      lat: USA_MAP_COORDS.center.lat,
      lng: USA_MAP_COORDS.center.lng,
      address: '',
      loaded: false,
      mapSize: {
        width: 0,
        height: 0
      }
    }
  }
  componentDidMount () {
    this.props.addUiAppClass(['App--AddEditRegion'])
  }
  componentWillUnmount () {
    this.props.removeUiAppClass(['App--AddEditRegion'])
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
  onSubmit = values => {
    const { addRegion, editRegion, history, match } = this.props
    if (match.params.id) {
      editRegion(match.params.id, values, history)
    } else {
      addRegion(values, history)
    }
  }
  handleMapLoaded = map => {
    // we're editing an existing region:
    if (this.props.match.params.id && this.props.initialValues) {
      this.setState((prevState, props) => {
        const { lat, lng, zoom } = this.props.initialValues
        return { lat, lng, zoom }
      })
    }
  }
  handleMapMoved = position => {
    // if we're editing an existing region:
    if (this.props.thisForm && this.props.thisForm.addEditRegion) {
      this.props.fieldValue('addEditRegion', 'zoom', position.zoom)
      this.props.fieldValue('addEditRegion', 'lat', position.center.lat)
      this.props.fieldValue('addEditRegion', 'lng', position.center.lng)
    }
    if (!this.state.loaded) {
      // get the real dimensions for the usa map
      this.setState({
        loaded: true,
        map: fitBoundsGoogleReady(USA_MAP_COORDS.bounds, position.size)
      })
    }
    // let's set the size of the map:
    this.setState({
      mapSize: { width: position.size.width, height: position.size.height }
    })
  }
  handleGoogleAutoselectChange = address => {
    this.setState({ address })
  }
  // Fires on Google AutoSelect selection:
  handleSelect = (address, placeId) => {
    geocodeByPlaceId(placeId)
      .then(results => {
        const { geometry, address_components } = results[0]
        const {
          b: { b: lngWest, f: lngEast },
          f: { b: latSouth, f: latNorth }
        } = geometry.viewport
        const bounds = convertToBounds(latNorth, latSouth, lngWest, lngEast)
        this.props.fieldValue(
          'addEditRegion',
          'name',
          getAddy(address_components, 'locality', 'long_name')
        )
        this.props.fieldValue(
          'addEditRegion',
          'state',
          getAddy(address_components, 'administrative_area_level_1')

        )
        this.props.fieldValue('addEditRegion', 'gpId', placeId)
        this.setState((prevState, props) => {
          const { position: { lat, lng }, zoom } = fitBoundsGoogleReady(
            bounds,
            this.state.mapSize
          )
          return { lat, lng, zoom }
        })
      })
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
    return (
      <div className='AddEdit AddEditRegion site-container'>
        {title}
        {/* the handleSubmit is from redux-form */}
        <form className='AddEdit__form' onSubmit={handleSubmit(this.onSubmit)}>
          <div className='AddEdit__col-left'>
            <Field lbl='Region Name' name='name' component={this.renderField} />
            <Field lbl='State' name='state' component={this.renderField} />
            <Field
              lbl='Zoom'
              name='zoom'
              type='number'
              component={this.renderField}
            />
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
            <Field
              lbl='Google Places ID'
              name='gpId'
              component={this.renderField}
            />
            {/* <FormSection name='bounds'>
              <Field lbl='N' name='latNorth' component={this.renderField} />
              <Field lbl='S' name='latSouth' component={this.renderField} />
              <Field lbl='W' name='lngWest' component={this.renderField} />
              <Field lbl='E' name='lngEast' component={this.renderField} />
            </FormSection> */}
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
            <MapSearch
              address={this.state.address}
              onChange={this.handleGoogleAutoselectChange}
              placeholder='Search for City...'
              handleSelect={this.handleSelect}
              types={['(cities)']}
            />
            <div className='m-ratio m-ratio--1-1 AddEdit__map-container'>
              <div className='m-ratio__child'>
                <GoogleMapReact
                  onGoogleApiLoaded={this.handleMapLoaded}
                  yesIWantToUseGoogleMapApiInternals
                  zoom={this.state.zoom}
                  center={{ lat: this.state.lat, lng: this.state.lng }}
                  onChange={this.handleMapMoved}
                  options={{ fullscreenControl: false }}
                />
              </div>
            </div>
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
  fieldValue,
  addUiAppClass,
  removeUiAppClass
})(
  reduxForm({
    form: 'addEditRegion',
    validate,
    enableReinitialize: true
  })(AddEditRegion)
)
