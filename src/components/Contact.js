import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import * as actions from '../actions'
import {
  Field,
  // FormSection,
  reduxForm
  // change as fieldValue
} from 'redux-form'
class Contact extends Component {
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
  render () {
    return (
      <div className='Contact'>
        <form className='Contact__form' onSubmit={handleSubmit(this.onSubmit)}>
          <div className='AddEdit__col-left'>
            <Field lbl='Region Name' name='name' component={this.renderField} />
            <Field lbl='State' name='state' component={this.renderField} />
            <Field
              lbl='Name thyself'
              name='name'
              component={this.renderField}
            />
            <Field
              lbl='Email'
              name='email'
              component={this.renderField}
            />
            <Field
              lbl='Message'
              name='message'
              type='number'
              component={this.renderField}
            />
            <Field
              lbl='Google Places ID'
              name='gpId'
              component={this.renderField}
            />
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

function mapStateToProps (state) {
  return {
    thisForm: state.form
  }
}
// connect needs to be the outer-most thing run
export default connect(mapStateToProps, actions)(
  reduxForm({
    form: 'contactForm',
    validate,
    enableReinitialize: true
  })(Contact)
)
