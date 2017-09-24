import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Field, FormSection, reduxForm } from 'redux-form'
import { addRegion } from '../../../actions'

class AddRegion extends Component {
  renderField (field) {
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
    this.props.addRegion(values, () => {
      // as long as its in the <Route>
      this.props.history.push('/admin/regions')
    })
  }
  render () {
    // pull out the redux-form handleSubmit function from props:
    const { handleSubmit, pristine, submitting, form } = this.props
    const title = form.addRegion.values &&
      form.addRegion.values.name
      ? <h1>{form.addRegion.values.name}</h1>
      : <h1>&nbsp;</h1>
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
          <button type='submit' className='btn btn-sm btn-primary' disabled={pristine || submitting}>
            Submit
          </button>
          <Link to='/admin/regions' className='btn btn-sm btn-danger'>Cancel</Link>
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

function mapStateToProps ({ form }) {
  return { form }
}

// AddRegionForm is the _unique_ form name
export default reduxForm({
  validate,
  form: 'addRegion'
})(connect(mapStateToProps, { addRegion })(AddRegion))
