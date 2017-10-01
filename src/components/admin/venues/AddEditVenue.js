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
import { usaMap, DATE_LONG } from '../../../config'
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
  renderFunTimes = ({ fields, meta: { error, submitFailed } }) => (
    <div className='AddEdit__array'>
      <header className='AddEdit__array-header'>
        <button
          className='btn btn-sm btn-success'
          type='button'
          onClick={() => fields.push({})}
        >
          <span className='embellish'>+</span>
        </button>
        <h3 className='AddEdit__array-title'>Times</h3>
        {submitFailed && error && <span>{error}</span>}
      </header>
      <div className='AddEdit__array-inner'>
        {fields.map((funTime, index) => (
          <div className='AddEdit__field-wrapper-container' key={index}>
            <div className='AddEdit__field-wrapper'>
              <Field
                name={`${funTime}.category`}
                type='text'
                component={this.renderField}
                lbl='Category'
              />
              <Field
                name={`${funTime}.days`}
                type='text'
                component={this.renderField}
                lbl='Days'
              />
              <Field
                name={`${funTime}.startTime`}
                type='text'
                component={this.renderField}
                lbl='Starts'
              />
              <Field
                name={`${funTime}.endTime`}
                type='text'
                component={this.renderField}
                lbl='Ends'
              />
              <div className='flex-basis-66p'>
                <Field
                  name={`${funTime}.remarks`}
                  type='text'
                  component={this.renderField}
                  lbl='Remarks'
                />
              </div>
            </div>
            <button
              className='btn btn-sm btn-danger'
              onClick={() => fields.remove(index)}
            >✖</button>
          </div>
        ))}
      </div>
    </div>
  )
  renderFunItems = ({ fields, meta: { error, submitFailed } }) => (
    <div className='AddEdit__array'>
      <header className='AddEdit__array-header'>
        <button
          className='btn btn-sm btn-success'
          type='button'
          onClick={() => fields.push({})}
        >
          <span className='embellish'>+</span>
        </button>
        <h3 className='AddEdit__array-title'>Menu Items</h3>
        {submitFailed && error && <span>{error}</span>}
      </header>
      <div className='AddEdit__array-inner'>
        {fields.map((funItem, index) => (
          <div className='AddEdit__field-wrapper-container' key={index}>
            <div className='AddEdit__field-wrapper'>
              <div className='flex-basis-66p'>
                <Field
                  name={`${funItem}.name`}
                  type='text'
                  component={this.renderField}
                  lbl='Name'
                />
              </div>
              <div className='flex-basis-33p'>
                <Field
                  name={`${funItem}.price`}
                  type='number'
                  component={this.renderField}
                  lbl='Price'
                />
              </div>
              <button
                className='btn btn-sm btn-danger'
                onClick={() => fields.remove(index)}
              >
              ✖
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
  renderResearch = ({ fields, meta: { error, submitFailed } }) => (
    <div className='AddEdit__array'>
      <header className='AddEdit__array-header'>
        <button
          className='btn btn-sm btn-success'
          type='button'
          onClick={() => fields.push({})}
        >
          <span className='embellish'>+</span>
        </button>
        <h3 className='AddEdit__array-title'>Research</h3>
        {submitFailed && error && <span>{error}</span>}
      </header>
      <div className='AddEdit__array-inner'>
        {fields.map((researchItem, index) => (
          <div className='AddEdit__field-wrapper-container' key={index}>
            <div className='AddEdit__field-wrapper'>
              <div className='flex-basis-50p'>
                <Field
                  name={`${researchItem}.url`}
                  type='text'
                  component={this.renderField}
                  lbl='URL'
                />
              </div>
              <div className='flex-basis-50p'>
                <Field
                  name={`${researchItem}.remarks`}
                  type='type'
                  component={this.renderField}
                  lbl='Remarks'
                />
              </div>
            </div>
            <button
              className='btn btn-sm btn-danger'
              onClick={() => fields.remove(index)}
            >✖              
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
    let yData = []
    // format the yData for displaying
    if (this.props.initialValues && this.props.initialValues.yData) {
      yData = Object.entries(this.props.initialValues.yData).map(([k, v]) => {
        const v2 = v === true ? 'true' : v === false ? 'false' : v
        const v3 = Array.isArray(v2) ? v2.join(', ') : v2
        const v4 = k === 'fetchedTime'
          ? new Date(v3).toLocaleDateString('en-US', DATE_LONG)
          : v3
        return <div key={k}><strong>{k}</strong>: {v4}</div>
      })
      yData.unshift(<h3>yData</h3>)
    }
    return (
      <div className='AddEdit AddEditVenue site-container'>
        <Link to='/admin/venues'>
        « Back to Venues
        </Link>
        {title}
        {/* the handleSubmit is from redux-form */}
        <form
          className='AddEdit__form'
          onSubmit={handleSubmit(this.onSubmit.bind(this))}
        >
          <div className='AddEdit__col-1'>
            <div className='AddEdit__field-wrapper'>
              <div className='AddEditVenue__form-group form-group'>
                <label className='AddEdit__label'>Region</label>
                <RegionSelect />
                {/* region={this.props.ui.region} */}
              </div>
              <Field lbl='Venue Name' name='name' component={renderField} />
              <div className='AddEditVenue__form-group form-group'>
                <label className='AddEdit__label' htmlFor='active'>
                  Is Venue Active?
                </label>
                <Field
                  name='active'
                  id='active'
                  component='input'
                  type='checkbox'
                  className='form-control'
                />
              </div>
              <Field
                lbl='Google Places ID'
                name='gpId'
                component={renderField}
              />
              <Field lbl='Yelp ID' name='yId' component={renderField} />
              <Field lbl='Zomato ID' name='zomatoId' component={renderField} />
              <FieldArray name='funTimes' component={this.renderFunTimes} />
              <FieldArray name='funItems' component={this.renderFunItems} />
              <FieldArray name='research' component={this.renderResearch} />
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
          <div className='AddEdit__col-2'>
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
                  style={{
                    height: '300px',
                    position: 'relative',
                    marginBottom: '1em'
                  }}
                >
                  {this.state.loadMarker &&
                    <Marker lat={this.state.lat} lng={this.state.lng} />}
                </GoogleMapReact>
                <div className='AddEdit__field-wrapper'>
                  <Field
                    lbl='Neighborhood'
                    name='neighborhood'
                    component={renderField}
                  />
                  <Field lbl='Latitude' name='lat' component={renderField} />
                  <Field lbl='Longitude' name='lng' component={renderField} />
                  <Field
                    lbl='Street'
                    name='address.street'
                    component={renderField}
                  />
                  <Field
                    lbl='City'
                    name='address.city'
                    component={renderField}
                  />
                  <Field
                    lbl='State'
                    name='address.state'
                    component={renderField}
                  />
                  <Field
                    lbl='Zip Code'
                    name='address.zip'
                    component={renderField}
                  />
                  <Field lbl='Phone #' name='phone' component={renderField} />
                  <Field lbl='Website' name='website' component={renderField} />
                  <Field
                    lbl='Facebook URL'
                    name='facebookUrl'
                    component={renderField}
                  />
                  <Field
                    lbl='OpenTable URL'
                    name='openTableUrl'
                    component={renderField}
                  />
                  <Field
                    lbl='Trip Advisor URL'
                    name='tripAdvisorUrl'
                    component={renderField}
                  />
                  <Field
                    lbl='Zagat URL'
                    name='zagatUrl'
                    component={renderField}
                  />
                  <Field
                    lbl='Zomato URL'
                    name='zomatoUrl'
                    component={renderField}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='AddEdit__col-3'>
            <aside className='AddEdit__yData'>
              {yData}
            </aside>
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
