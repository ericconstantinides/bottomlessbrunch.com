import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Field,
  FormSection,
  reduxForm,
  change as changeFieldValue
} from 'redux-form'
import RegionSelect from '../../RegionSelect'
import GoogleMapReact from 'google-map-react'
import { addVenue, editVenue } from '../../../actions'
import { usaMap } from '../../../config'
import Marker from '../../Marker'

class AddEditVenue extends Component {
  constructor (props) {
    super(props)
    this.state = {
      map: usaMap
    }
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
    if (this.props.match.params.id && this.props.initialValues) {
      this.setState((prevState, props) => {
        return { map: this.props.initialValues }
      })
    }
  }
  handleMapMoved = position => {
    // if (
    //   this.props.thisForm &&
    //   this.props.thisForm.addEditVenue
    // ) {
    //   this.props.changeFieldValue('addEditVenue', 'zoom', position.zoom)
    //   this.props.changeFieldValue('addEditVenue', 'position.lat', position.center.lat)
    //   this.props.changeFieldValue('addEditVenue', 'position.lng', position.center.lng)
    // }

    // this.setState((prevState, props) => {
    //   return { map: position }
    // })
  }
  render () {
    // pull out the redux-form handleSubmit function from props:
    const { handleSubmit, pristine, submitting, thisForm } = this.props
    const title = thisForm.addEditVenue &&
      thisForm.addEditVenue.values &&
      thisForm.addEditVenue.values.name
      ? <h1>{thisForm.addEditVenue.values.name}</h1>
      : <h1>&nbsp;</h1>
    return (
      <div className='AddEdit AddEditVenue container'>
        {title}
        {/* the handleSubmit is from redux-form */}
        <form
          className='AddEdit__form'
          onSubmit={handleSubmit(this.onSubmit.bind(this))}
        >
          <div className='AddEdit__col-left'>
            <Field lbl='Venue Name' name='name' component={this.renderField} />
            <RegionSelect
            />
              {/* region={this.props.ui.region} */}
            <Field
              lbl='Neighborhood'
              name='neighborhood'
              component={this.renderField}
            />
            <Field
              lbl='Google Places ID'
              name='googlePlacesId'
              component={this.renderField}
            />
            <Field
              lbl='Yelp ID'
              name='yelpId'
              component={this.renderField}
            />
            <Field
              lbl='Zomato ID'
              name='zomatoId'
              component={this.renderField}
            />
            <Field
              lbl='Research Notes'
              name='researchNotes'
              type='textarea'
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
            <Link to='/admin/venues' className='btn btn-sm btn-danger'>
              Cancel
            </Link>
          </div>
          <div className='AddEdit__col-right'>
            <GoogleMapReact
              onGoogleApiLoaded={this.handleMapLoaded}
              yesIWantToUseGoogleMapApiInternals
              zoom={14}
              center={this.state.map.position}
              onChange={this.handleMapMoved}
            >
              <Marker
                lat={this.state.map.position.lat}
                lng={this.state.map.position.lng}
              />
            </GoogleMapReact>
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
  changeFieldValue
})(
  reduxForm({
    form: 'addEditVenue',
    validate,
    enableReinitialize: true
  })(AddEditVenue)
)
