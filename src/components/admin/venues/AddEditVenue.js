import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Field,
  FieldArray,
  // FormSection,
  reduxForm,
  change as fieldValue
} from 'redux-form'
// I may need these later below: geocodeByAddress, getLatLng
import { geocodeByPlaceId } from 'react-places-autocomplete'
import MapSearch from '../../MapSearch'
import RegionSelect from '../../RegionSelect'
import GoogleMapReact from 'google-map-react'
import { addVenue, editVenue } from '../../../actions'
import { usaMap } from '../../../config'
import { convertToBounds, fitBoundsGoogleReady } from '../../../lib/myHelpers'
import Marker from '../../Marker'

class AddEditVenue extends Component {
  constructor (props) {
    super(props)
    this.state = {
      zoom: usaMap.zoom,
      lat: usaMap.lat,
      lng: usaMap.lng,
      loadMarker: false,
      address: ''
    }
    this.onChange = address => this.setState({ address })
  }
  renderField (field) {
    const { touched, error } = field.meta
    const fieldType = field.type ? field.type : 'text'
    const className = `AddEditVenue__form-group form-group ${touched && error ? 'has-danger' : ''}`
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
    const { addVenue, editVenue, history, match } = this.props
    if (match.params.id) {
      editVenue(match.params.id, values, history)
    } else {
      addVenue(values, history)
    }
  }
  handleMapLoaded = map => {
    // we have a venue already:
    if (this.props.match.params.id && this.props.initialValues) {
      this.setState((prevState, props) => {
        const { lat, lng } = this.props.initialValues
        return { lat, lng, zoom: 14, loadMarker: true }
      })
    }
  }
  handleMapMoved = position => {
    // if (
    //   this.props.thisForm &&
    //   this.props.thisForm.addEditVenue
    // ) {
    //   this.props.fieldValue('addEditVenue', 'zoom', position.zoom)
    //   this.props.fieldValue('addEditVenue', 'position.lat', position.center.lat)
    //   this.props.fieldValue('addEditVenue', 'position.lng', position.center.lng)
    // }
    // this.setState((prevState, props) => {
    //   return { map: position }
    // })
  }
  // Fires on Google AutoSelect selection:
  handleSelect = (address, placeId) => {
    geocodeByPlaceId(placeId)
      .then(results => {
        const { geometry, address_components } = results[0]
        const {
          b: { b: lngWest, f: lngEast },
          f: { b: latSouth, f: latNorth }
        } = geometry.bounds
        const bounds = convertToBounds(latNorth, latSouth, lngWest, lngEast)
        this.props.fieldValue(
          'addEditRegion',
          'name',
          address_components[0].long_name
        )
        this.props.fieldValue(
          'addEditRegion',
          'state',
          address_components[2].short_name
        )
        this.props.fieldValue('addEditRegion', 'gpId', placeId)
        // this.props.fieldValue('addEditRegion', 'bounds.latNorth', latNorth)
        // this.props.fieldValue('addEditRegion', 'bounds.latSouth', latSouth)
        // this.props.fieldValue('addEditRegion', 'bounds.lngWest', lngWest)
        // this.props.fieldValue('addEditRegion', 'bounds.lngEast', lngEast)
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
  renderFunItems = ({ fields, meta: { error, submitFailed } }) => (
    <div className='AddEdit__full-across'>
      <div>
        <button
          className='btn btn-sm btn-primary'
          type='button'
          onClick={() => fields.push({})}
        >
          Add Menu Item
        </button>
        {submitFailed && error && <span>{error}</span>}
      </div>
      <div className='XXXXAddEdit__field-wrapper'>
        {fields.map((funItems, index) => (
          <div className='AddEdit__field-wrapper--alt' key={index}>
            <Field
              name={`${funItems}.name`}
              type='text'
              component={this.renderField}
              lbl='Name'
            />
            <Field
              name={`${funItems}.price`}
              type='number'
              component={this.renderField}
              lbl='Price'
            />
            <button
              className='btn btn-sm btn-danger'
              onClick={() => fields.remove(index)}
            >
              Delete Item
            </button>
          </div>
        ))}
      </div>
    </div>
  )
  render () {
    // pull out the redux-form handleSubmit function from props:
    const { handleSubmit, pristine, submitting, thisForm } = this.props
    const title = thisForm.addEditVenue &&
      thisForm.addEditVenue.values &&
      thisForm.addEditVenue.values.name
      ? <h1>{thisForm.addEditVenue.values.name}</h1>
      : <h1>&nbsp;</h1>
    const renderField = this.renderField
    return (
      <div className='AddEdit AddEditVenue container'>
        {title}
        {/* the handleSubmit is from redux-form */}
        <form
          className='AddEdit__form'
          onSubmit={handleSubmit(this.onSubmit.bind(this))}
        >
          <div className='AddEdit__col-left'>
            <div className='AddEdit__field-wrapper'>
              <RegionSelect />
              {/* region={this.props.ui.region} */}
              <Field lbl='Venue Name' name='name' component={renderField} />
              <Field lbl='Places ID' name='gpId' component={renderField} />
              <Field lbl='Yelp ID' name='yId' component={renderField} />
              <Field lbl='Zomato ID' name='zomatoId' component={renderField} />
              <Field
                lbl='Neighborhood'
                name='neighborhood'
                component={renderField}
              />
              <Field
                lbl='Research'
                name='research'
                type='textarea'
                component={renderField}
              />
              <Field lbl='Latitude' name='lat' component={renderField} />
              <Field lbl='Longitude' name='lng' component={renderField} />
              <Field
                lbl='Street'
                name='address.street'
                component={renderField}
              />
              <Field lbl='City' name='address.city' component={renderField} />
              <Field lbl='State' name='address.state' component={renderField} />
              <Field
                lbl='Zip Code'
                name='address.zip'
                component={renderField}
              />
              <Field lbl='Phone #' name='phone' component={renderField} />
              <FieldArray name='funItems' component={this.renderFunItems} />
            </div>
            <button
              type='submit'
              className='btn btn-sm btn-primary'
              disabled={pristine || submitting}
            >
              Submit
            </button>
            <Link to='/admin/venues' className='btn btn-sm btn-danger'>
              Cancel
            </Link>
          </div>
          <div className='AddEdit__col-right'>
            <MapSearch
              address={this.state.address}
              onChange={this.onChange}
              placeholder='Search for Venue...'
              handleSelect={this.handleSelect}
              types={['establishment']}
            />
            <div className='m-ratio m-ratio--1-1 AddEdit__map-container'>
              <div className='m-ratio__child'>
                <GoogleMapReact
                  onGoogleApiLoaded={this.handleMapLoaded}
                  yesIWantToUseGoogleMapApiInternals
                  zoom={this.state.zoom - 1}
                  center={{ lat: this.state.lat, lng: this.state.lng }}
                  onChange={this.handleMapMoved}
                  style={{ height: '300px', position: 'relative' }}
                >
                  {this.state.loadMarker &&
                    <Marker lat={this.state.lat} lng={this.state.lng} />}
                </GoogleMapReact>
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
  // if we have an id, load the id venue:
  if (ownProps.match.params.id) {
    return {
      thisForm: state.form,
      initialValues: state.venues[ownProps.match.params.id]
    }
  }
  // if we don't, just use your default
  return {
    thisForm: state.form
  }
}
// connect needs to be the outer-most thing run
export default connect(mapStateToProps, {
  addVenue,
  editVenue,
  fieldValue
})(
  reduxForm({
    form: 'addEditVenue',
    validate,
    enableReinitialize: true
  })(AddEditVenue)
)
