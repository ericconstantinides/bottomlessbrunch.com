import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Field, FormSection, reduxForm } from 'redux-form'
import { addRegion, editRegion } from '../../../actions'

class AddEditRegion extends Component {
  renderField (field) {
    // console.log(field)
    const { touched, error } = field.meta
    const className = `form-group ${touched && error ? 'has-danger' : ''}`
    return (
      <div className={className}>
        <label>{field.labelOfThis}</label>
        <input className='form-control' type={field.type} {...field.input} />
        <small className='text-help'>
          {touched ? error : ''}
        </small>
      </div>
    )
  }
  // gets called after successful validation:
  onSubmit (values) {
    if (this.props.task === 'add') {
      this.props.addRegion(values, this.props.history)
    } else {
      this.props.editRegion(
        this.props.match.params.id,
        values,
        this.props.history
      )
    }
  }
  render () {
    // pull out the redux-form handleSubmit function from props:
    const { handleSubmit, pristine, submitting, thisForm } = this.props
    const title = thisForm.addEditRegion &&
      thisForm.addEditRegion.values &&
      thisForm.addEditRegion.values.name
      ? <h1>{thisForm.addEditRegion.values.name}</h1>
      : <h1>&nbsp;</h1>
    // const title = 'hello'
    // console.log(this.props)
    return (
      <div className='container'>
        {title}
        <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
          {/* the handleSubmit is from redux-form */}
          <Field
            labelOfThis='Region Name'
            name='name'
            type='text'
            component={this.renderField}
          />
          <Field
            labelOfThis='Slug'
            name='slug'
            type='text'
            component={this.renderField}
          />
          <Field
            labelOfThis='Zoom'
            name='zoom'
            type='number'
            component={this.renderField}
          />
          <FormSection name='position'>
            <Field
              labelOfThis='Latitude'
              name='lat'
              type='text'
              component={this.renderField}
            />
            <Field
              labelOfThis='Longitude'
              name='lng'
              type='text'
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

// connect needs to be the last thing run
export default connect(mapStateToProps, { addRegion, editRegion })(
  reduxForm({
    form: 'addEditRegion',
    validate,
    enableReinitialize: true
  })(AddEditRegion)
)
