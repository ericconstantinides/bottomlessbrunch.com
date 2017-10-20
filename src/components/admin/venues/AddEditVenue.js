import React, { Component } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Field, FieldArray, reduxForm, change as fieldValue } from 'redux-form'
// I may need these later below: geocodeByAddress, getLatLng
import { geocodeByPlaceId } from 'react-places-autocomplete'
import MapSearch from '../../MapSearch'
import SelectInput from '../../common/SelectInput'
import { getLatLng } from 'react-places-autocomplete'
import GoogleMapReact from 'google-map-react'
import {
  addVenue,
  editVenue,
  fetchGooglePlacesEditVenueDetail,
  fetchYelpPhoneSearchEditVenueDetail,
  fetchYelpMetaEditVenueDetail,
  resetEditVenue,
  addUiAppClass,
  removeUiAppClass
} from '../../../actions'
import { usaMap, DATE_LONG, BRUNCH_TIMES } from '../../../config'
import Marker from '../../common/Marker'
import { times, days, timeCategories, states } from '../../../enumerables'
import {
  findClosestRegion,
  getAddy,
  stripDashesSpaces
} from '../../../lib/myHelpers'

const YELP_PREFIX = 'https://www.yelp.com/biz/'
const YELP_SUFFIX = '?q=bottomless'

const stateOptions = states.map(state => ({ label: state, value: state }))
const timeOptions = times.map(time => ({ label: time, value: time }))
const dayOptions = days.map(day => ({ label: day, value: day }))
const timeCatOptions = timeCategories.map(cat => ({ label: cat, value: cat }))

class venueForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      zoom: usaMap.zoom,
      lat: usaMap.lat,
      lng: usaMap.lng,
      marker: false,
      address: ''
    }
    this.onChange = address => this.setState({ address })
  }
  componentDidMount () {
    this.props.addUiAppClass(['App--AddEditVenue'])
  }
  componentWillUnmount() {
    this.props.removeUiAppClass(['App--AddEditVenue'])
  }
  renderField (field) {
    const { touched, error } = field.meta
    const fieldType = field.type ? field.type : 'text'
    const className = `venueForm__form-group form-group ${touched && error ? 'has-danger' : ''} ${field.className ? field.className : ''}`
    let link = field.externalLink && field.input.value
      ? <span> | <Link target='_blank' to={field.input.value}>link</Link></span>
      : ''
    if (field.input.name === 'yId' && field.input.value) {
      const href = YELP_PREFIX + field.input.value + YELP_SUFFIX
      link = <span> | <Link target='_blank' to={href}>link</Link></span>
    }
    return (
      <div className={className}>
        <label className='AddEdit__label'>{field.lbl} {link}</label>
        <input className='form-control' type={fieldType} {...field.input} />
        <small className='text-help'>
          {touched ? error : ''}
        </small>
      </div>
    )
  }
  componentDidUpdate (prevProps, prevState) {
    // Only run the field update IF: We have gData and no PrevGdata -OR-
    // the old place_id is different than the new place_id
    const { gData } = this.props.editVenueFields
    const { gData: prevGdata } = prevProps.editVenueFields
    if (gData && (!prevGdata || gData.place_id !== prevGdata.place_id)) {
      const { address_components: address } = gData
      const replacements = [
        { field: 'name', data: gData.name },
        { field: 'website', data: gData.website },
        { field: 'phone', data: gData.formatted_phone_number },
        {
          field: 'globalPhone',
          data: stripDashesSpaces(gData.international_phone_number)
        },
        {
          field: 'address.street',
          data: getAddy(address, 'street_number') +
            ' ' +
            getAddy(address, 'route')
        },
        {
          field: 'address.city',
          data: getAddy(address, 'locality', 'long_name')
        },
        {
          field: 'address.state',
          data: getAddy(address, 'administrative_area_level_1')
        },
        { field: 'address.zip', data: getAddy(address, 'postal_code') },
        {
          field: 'neighborhood',
          data: getAddy(address, 'neighborhood')
            ? getAddy(address, 'neighborhood')
            : getAddy(address, 'sublocality')
                ? getAddy(address, 'sublocality')
                : ''
        }
      ]
      replacements.forEach(fieldObj => {
        const data = fieldObj.data ? fieldObj.data : ''
        this.props.fieldValue('venueForm', fieldObj.field, data)
      })
    }
    // now let's do the same for Yelp:
    const { yData } = this.props.editVenueFields
    const { yData: prevYdata } = prevProps.editVenueFields
    if (yData && (!prevYdata || yData.id !== prevYdata.id)) {
      const replacements = [{ field: 'yId', data: yData.id }]
      replacements.forEach(fieldObj => {
        const data = fieldObj.data ? fieldObj.data : ''
        this.props.fieldValue('venueForm', fieldObj.field, data)
      })
    }
  }
  // gets called after successful validation:
  onSubmit = values => {
    // attach yData, yMeta, and gData here:
    const { gData, yData, yMeta } = this.props.editVenueFields
    if (gData) values.gData = gData
    if (yData) values.yData = yData
    if (yMeta) values.yMeta = yMeta

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
        return { lat, lng, zoom: 14, marker: true }
      })
    }
  }
  // Fires on Google AutoSelect selection:
  handleGoogleAutoSelect = (address, placeId) => {
    // set the gpId
    this.props.fieldValue('venueForm', 'gpId', placeId)
    geocodeByPlaceId(placeId)
      .then(results => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        const region = findClosestRegion({ lat, lng }, this.props.regions)
        this.props.fieldValue('venueForm', 'regionId', region)
        this.props.fieldValue('venueForm', 'lat', lat)
        this.props.fieldValue('venueForm', 'lng', lng)
        this.setState({ marker: true, lat, lng, zoom: 15, address: '' })

        // get the google places info and send in the
        // yelp search method after:
        this.props.fetchGooglePlacesEditVenueDetail(
          placeId,
          this.props.fetchYelpPhoneSearchEditVenueDetail,
          this.props.fetchYelpMetaEditVenueDetail
        )
        // this.props.fetchYelpPhoneSearchEditVenueDetail({
        //   international_phone_number: '+1 408 929-5501'
        // })
      })
      .catch(error => console.error(error))
    // this.setState({ address, placeId })

    // You can do other things with address string or placeId. For example, geocode :)
  }
  handleTimeCatChange = (val, index) => {
    if (val === 'Bottomless Brunch') {
      this.props.fieldValue(
        'venueForm',
        `funTimes[${index}].startTime`,
        BRUNCH_TIMES.START
      )
      this.props.fieldValue(
        'venueForm',
        `funTimes[${index}].endTime`,
        BRUNCH_TIMES.END
      )
      this.props.fieldValue(
        'venueForm',
        `funTimes[${index}].days`,
        BRUNCH_TIMES.DAYS
      )
    }
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
      {fields.length > 0 &&
        <div className='AddEdit__array-inner'>
          {fields.map((funTime, index) => (
            <div className='AddEdit__field-wrapper-container' key={index}>
              <div className='AddEdit__field-wrapper'>
                <div className='venueForm__form-group form-group flex-basis-40p'>
                  <label className='AddEdit__label'>Category</label>
                  <Field
                    name={`${funTime}.category`}
                    options={timeCatOptions}
                    component={SelectInput}
                    index={index}
                    myOnChange={this.handleTimeCatChange}
                  />
                </div>
                <div className='venueForm__form-group form-group flex-basis-60p'>
                  <label className='AddEdit__label'>Days</label>
                  <Field
                    name={`${funTime}.days`}
                    options={dayOptions}
                    component={SelectInput}
                    multi
                  />
                </div>
                <div className='venueForm__form-group form-group flex-basis-20p'>
                  <label className='AddEdit__label'>Start Time</label>
                  <Field
                    name={`${funTime}.startTime`}
                    options={timeOptions}
                    component={SelectInput}
                    clearable={false}
                  />
                </div>
                <div className='venueForm__form-group form-group flex-basis-20p'>
                  <label className='AddEdit__label'>End Time</label>
                  <Field
                    name={`${funTime}.endTime`}
                    options={timeOptions}
                    component={SelectInput}
                    clearable={false}
                  />
                </div>
                <div className='flex-basis-60p'>
                  <Field
                    name={`${funTime}.remarks`}
                    component={this.renderField}
                    lbl='Remarks'
                  />
                </div>
              </div>
              <button
                className='btn btn-sm btn-danger'
                type='button'
                onClick={() => fields.remove(index)}
              >
                ✖
              </button>
            </div>
          ))}
        </div>}
    </div>
  )
  renderMenuItems = ({ fields, meta: { error, submitFailed } }) => (
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
      {fields.length > 0 &&
        <div className='AddEdit__array-inner'>
          {fields.map((funItem, index) => (
            <div className='AddEdit__field-wrapper-container' key={index}>
              <div className='AddEdit__field-wrapper'>
                <div className='flex-basis-66p'>
                  <Field
                    name={`${funItem}.name`}
                    component={this.renderField}
                    lbl='Menu Item Name'
                  />
                </div>
                <div className='flex-basis-33p'>
                  <Field
                    name={`${funItem}.price`}
                    type='number'
                    component={this.renderField}
                    lbl='Price ($)'
                  />
                </div>
                <button
                  className='btn btn-sm btn-danger'
                  type='button'
                  onClick={() => fields.remove(index)}
                >
                  ✖
                </button>
              </div>
            </div>
          ))}
        </div>}
    </div>
  )
  renderImages = ({ fields, meta: { error, submitFailed } }) => (
    <div className='AddEdit__array'>
      <header className='AddEdit__array-header'>
        <button
          className='btn btn-sm btn-success'
          type='button'
          onClick={() => fields.push({})}
        >
          <span className='embellish'>+</span>
        </button>
        <h3 className='AddEdit__array-title'>Images</h3>
        {submitFailed && error && <span>{error}</span>}
      </header>
      {fields.length > 0 &&
        <div className='AddEdit__array-inner'>
          {fields.map((image, index) => (
            <div className='AddEdit__field-wrapper-container' key={index}>
              <div className='AddEdit__field-wrapper'>
                <div className='flex-basis-66p'>
                  <Field
                    name={`${image}.fileName`}
                    component={this.renderField}
                    lbl='Filename'
                  />
                </div>
                <div className='flex-basis-33p'>
                  <Field
                    name={`${image}.category`}
                    component={this.renderField}
                    lbl='Category'
                  />
                </div>
                <button
                  className='btn btn-sm btn-danger'
                  type='button'
                  onClick={() => fields.remove(index)}
                >
                  ✖
                </button>
              </div>
            </div>
          ))}
        </div>}
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
      {fields.length > 0 &&
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
                    externalLink
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
                type='button'
                onClick={() => fields.remove(index)}
              >
                ✖
              </button>
            </div>
          ))}
        </div>}
    </div>
  )
  componentWillUnmount () {
    this.props.resetEditVenue()
  }
  handleCompileYelp = () => {
    if (_.has(this.props.thisForm.venueForm.values, 'yId')) {
      this.props.fetchYelpMetaEditVenueDetail(
        this.props.thisForm.venueForm.values.yId
      )
    }
  }
  handleCompileGooglePlaces = () => {
    if (_.has(this.props.thisForm.venueForm.values, 'gpId')) {
      this.props.fetchGooglePlacesEditVenueDetail(
        this.props.thisForm.venueForm.values.gpId
      )
    }
  }
  render () {
    // pull out the redux-form handleSubmit function from props:
    const { handleSubmit, pristine, submitting, thisForm } = this.props
    const title = thisForm.venueForm &&
      thisForm.venueForm.values &&
      thisForm.venueForm.values.name
      ? <h1>{thisForm.venueForm.values.name}</h1>
      : ''
    const renderField = this.renderField
    // format the yMeta for displaying:
    let yMeta = []
    const yMetaObj = _.has(this.props.editVenueFields, 'yMeta')
      ? this.props.editVenueFields.yMeta
      : _.has(this.props.initialValues, 'yMeta')
          ? this.props.initialValues.yMeta
          : {}
    const gDataObj = _.has(this.props.editVenueFields, 'gData')
      ? this.props.editVenueFields.gData
      : _.has(this.props.initialValues, 'gData')
          ? this.props.initialValues.gData
          : {}
    yMeta = Object.entries(yMetaObj).map(([k, v]) => {
      const v2 = v === true ? 'true' : v === false ? 'false' : v
      const v3 = Array.isArray(v2) ? v2.join(', ') : v2
      const v4 = k === 'fetchedTime'
        ? new Date(v3).toLocaleDateString('en-US', DATE_LONG)
        : v3
      return <div key={k}><strong>{k}</strong>: <span>{v4}</span></div>
    })
    yMeta.unshift(<h3 key='yMetaTitle'>yMeta</h3>)
    const regionOptions = this.props.regions
      ? _.map(this.props.regions, rg => ({ label: rg.name, value: rg._id }))
      : ''
    return (
      <div className='AddEdit venueForm site-container'>
        <Link to='/admin/venues'>« Back to Venues</Link>
        <form className='AddEdit__form' onSubmit={handleSubmit(this.onSubmit)}>
          <div className='AddEdit__col-1'>
            {title}
            <MapSearch
              address={this.state.address}
              onChange={this.onChange}
              placeholder='Search for Venue...'
              handleSelect={this.handleGoogleAutoSelect}
              types={['establishment']}
            />
            <div className='m-ratio m-ratio--1-1 AddEdit__map-container'>
              <div className='m-ratio__child'>
                <GoogleMapReact
                  onGoogleApiLoaded={this.handleMapLoaded}
                  yesIWantToUseGoogleMapApiInternals
                  zoom={this.state.zoom - 1}
                  center={{ lat: this.state.lat, lng: this.state.lng }}
                  options={{fullscreenControl: false}}
                  style={{
                    height: '300px',
                    position: 'relative',
                    marginBottom: '1em'
                  }}
                >
                  {this.state.marker &&
                    <Marker lat={this.state.lat} lng={this.state.lng} />}
                </GoogleMapReact>
                <div className='AddEdit__compile-buttons'>
                  <button
                    className='btn btn-sm btn-primary'
                    type='button'
                    onClick={this.handleCompileYelp}
                  >
                    Compile <span>Yelp</span> Meta
                  </button>
                  <button
                    className='btn btn-sm btn-primary'
                    type='button'
                    onClick={this.handleCompileGooglePlaces}
                  >
                    Compile <span>Google</span> Meta
                  </button>
                  {/* <button
                    className='btn btn-sm btn-primary'
                    type='button'
                    onClick={this.handleCompileAllData}
                  >
                    Compile <span>All</span> Fields
                  </button> */}
                </div>
                <div className='AddEdit__field-wrapper'>
                  <div className='venueForm__form-group form-group'>
                    <label className='AddEdit__label'>Region</label>
                    <Field
                      name='regionId'
                      options={regionOptions}
                      component={SelectInput}
                    />
                  </div>
                  <Field lbl='Venue Name' name='name' component={renderField} />
                  <Field
                    lbl='Neighborhood'
                    name='neighborhood'
                    component={renderField}
                  />
                  <Field
                    lbl='Website'
                    name='website'
                    component={renderField}
                    externalLink
                  />
                  <Field
                    lbl='Yelp ID'
                    name='yId'
                    component={renderField}
                  />
                  <Field
                    lbl='Facebook URL'
                    name='facebookUrl'
                    component={renderField}
                    externalLink
                  />
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
                  <div className='venueForm__form-group form-group flex-basis-16p'>
                    <label className='AddEdit__label'>State</label>
                    <Field
                      name='address.state'
                      options={stateOptions}
                      component={SelectInput}
                      clearable={false}
                    />
                  </div>
                  <Field
                    lbl='Zip Code'
                    name='address.zip'
                    component={renderField}
                    className='flex-basis-16p'
                  />
                  <Field
                    lbl='Latitude'
                    name='lat'
                    component={renderField}
                    className='flex-basis-25p'
                  />
                  <Field
                    lbl='Longitude'
                    name='lng'
                    component={renderField}
                    className='flex-basis-25p'
                  />
                  <Field
                    lbl='Display Phone'
                    name='phone'
                    component={renderField}
                    className='flex-basis-25p'
                  />
                  <Field
                    lbl='Global Phone'
                    name='globalPhone'
                    component={renderField}
                    className='flex-basis-25p'
                  />
                  <Field
                    lbl='Google Places ID'
                    name='gpId'
                    component={renderField}
                  />
                  <Field
                    lbl='Zomato ID'
                    name='zomatoId'
                    component={renderField}
                  />
                  <Field
                    lbl='OpenTable URL'
                    name='openTableUrl'
                    component={renderField}
                    externalLink
                  />
                  <Field
                    lbl='Trip Advisor URL'
                    name='tripAdvisorUrl'
                    component={renderField}
                    externalLink
                  />
                  <Field
                    lbl='Zagat URL'
                    name='zagatUrl'
                    component={renderField}
                    externalLink
                  />
                  <Field
                    lbl='Zomato URL'
                    name='zomatoUrl'
                    component={renderField}
                    externalLink
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='AddEdit__col-2'>
            {gDataObj.images && 
              <div className='AddEdit__image-wrapper'>
                <img src={gDataObj.images.large[0].url} alt='' />
              </div>
            }
            <div className='AddEdit__field-wrapper'>
              <FieldArray name='funTimes' component={this.renderFunTimes} />
              <FieldArray name='funItems' component={this.renderMenuItems} />
              <FieldArray name='images' component={this.renderImages} />
              <FieldArray name='research' component={this.renderResearch} />
              <div className='checkbox-wrapper'>
                <label className='AddEdit__label' htmlFor='unpublish'>
                  Unpublish Venue
                </label>
                <Field
                  name='unpublish'
                  id='unpublish'
                  component='input'
                  type='checkbox'
                  className='form-control'
                />
              </div>
            </div>
            <button
              type='submit'
              className='btn btn-sm btn-primary'
              disabled={pristine || submitting}
            >
              Save Venue
            </button>
            <Link to='/admin/venues' className='btn btn-sm btn-danger'>
              Cancel
            </Link>
          </div>
          <div className='AddEdit__col-3'>
            <aside className='AddEdit__yMeta'>{yMeta}</aside>
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
      initialValues: state.venues[ownProps.match.params.id],
      regions: state.regions,
      editVenueFields: state.editVenueFields
    }
  }
  // if we don't, just use your default
  return {
    thisForm: state.form,
    regions: state.regions,
    editVenueFields: state.editVenueFields
  }
}
// connect needs to be the outer-most thing run
export default connect(mapStateToProps, {
  addVenue,
  editVenue,
  fieldValue,
  fetchGooglePlacesEditVenueDetail,
  fetchYelpPhoneSearchEditVenueDetail,
  fetchYelpMetaEditVenueDetail,
  resetEditVenue,
  addUiAppClass,
  removeUiAppClass
})(
  reduxForm({
    form: 'venueForm',
    validate,
    enableReinitialize: true
  })(venueForm)
)
