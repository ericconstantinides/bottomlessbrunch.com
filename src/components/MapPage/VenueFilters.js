import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Range } from 'rc-slider'
import 'rc-slider/assets/index.css'

import * as filterActions from '../../actions/filterActions'

import { drinks, drinkIncludes, days } from '../../lib/enumerables'
import {
  makeSliderHours,
  makeSliderPrices,
  makeDayMarks,
  numTimeToString,
  numDayToStr
} from '../../lib/myHelpers'

drinks.push('All')

const prices = makeSliderPrices(0, 60)

const drinksObj = {}
drinks.forEach((drink, i) => {
  drinksObj[drink] = {
    disabled: false,
    checked: true
  }
})

const pricesMeta = {}
drinkIncludes.forEach((priceMeta, i) => {
  pricesMeta[priceMeta] = {
    disabled: false,
    checked: true
  }
})

class VenueFilters extends Component {
  constructor (props) {
    super(props)
    this.state = {
      activeClass: 'is-active',
      // these are ranges:
      hours: [8, 16],
      days: [0, 6],
      prices: [0, 60],
      // see these are checkboxes:
      drinks: drinksObj,
      pricesMeta
    }
  }
  handleFiltersToggle = () => {
    const activeClass = this.state.activeClass === 'not-active'
      ? 'is-active'
      : 'not-active'
    this.setState({ activeClass })
  }
  handleTimeChange = hours => {
    this.setState({ hours })
  }
  handleDayChange = days => {
    this.setState({ days })
  }
  handlePriceChange = prices => {
    this.setState({ prices })
  }
  handleDrinkClick = drinkName => event => {
    const drinkChecked = !this.state.drinks[drinkName].checked
    const drinkDisabled = this.state.drinks[drinkName].disabled
    let drinks = {}
    if (drinkName === 'All') {
      Object.keys(this.state.drinks).forEach(drink => {
        drinks[drink] = {
          disabled: drinkDisabled,
          checked: drinkChecked
        }
      })
    } else {
      drinks = {
        ...this.state.drinks,
        [drinkName]: {
          disabled: drinkDisabled,
          checked: drinkChecked
        }
      }
      // now double check the status of All and if it needs to be updated:
      const allSame = Object.keys(drinks).every(drink => {
        if (drink === 'All') return true
        return drinks[drink].checked === drinkChecked
      })
      drinks = {
        ...this.state.drinks,
        [drinkName]: {
          disabled: drinkDisabled,
          checked: drinkChecked
        },
        All: {
          disabled: false,
          checked: allSame ? drinkChecked : false
        }
      }
    }
    this.setState({ drinks })
  }
  handleMetaClick = meta => event => {
    const pricesMeta = {
      ...this.state.pricesMeta,
      [meta]: {
        disabled: this.state.pricesMeta[meta].disabled,
        checked: !this.state.pricesMeta[meta].checked
      }
    }
    this.setState({ pricesMeta })
  }
  renderDrinks = () => {
    return drinks.map((drink, i) => {
      return (
        <div className='VenueFilters__checkbox' key={i}>
          <label
            className='VenueFilters__label'
            disabled={this.state.drinks[drink].disabled}
          >
            <input
              name={drink}
              type='checkbox'
              disabled={this.state.drinks[drink].disabled}
              checked={
                this.state.drinks[drink].checked &&
                  !this.state.drinks[drink].disabled
              }
              onChange={this.handleDrinkClick(drink)}
            />
            {drink}
          </label>
        </div>
      )
    })
  }
  renderPricesMeta = () => {
    return Object.entries(this.state.pricesMeta).map(([meta, metaObj], i) => {
      return (
        <div className='VenueFilters__checkbox' key={i}>
          <label className='VenueFilters__label' disabled={metaObj.disabled}>
            <input
              name={meta}
              type='checkbox'
              disabled={metaObj.disabled}
              checked={metaObj.checked && !metaObj.disabled}
              onChange={this.handleMetaClick(meta)}
            />
            {meta
              .replace('Drink +', 'w/')
              .replace('Full Course Meal', 'Prix Fixe')}
          </label>
        </div>
      )
    })
  }
  render () {
    const { filters } = this.props
    const displayHours = this.state.hours[0] === this.state.hours[1]
      ? numTimeToString(this.state.hours[0])
      : numTimeToString(this.state.hours[0]) +
          ' - ' +
          numTimeToString(this.state.hours[1])
    const displayDays = this.state.days[0] === this.state.days[1]
      ? numDayToStr(this.state.days[0], days)
      : numDayToStr(this.state.days[0], days) +
          ' - ' +
          numDayToStr(this.state.days[1], days)
    const displayPrices = this.state.prices[0] === this.state.prices[1]
      ? '$' + this.state.prices[0]
      : '$' + this.state.prices[0] + ' - $' + this.state.prices[1]
    return (
      <div className={`VenueFilters ${this.state.activeClass}`}>
        <h3 className='VenueFilters__title' onClick={this.handleFiltersToggle}>
          Filters
        </h3>
        <div className='VenueFilters__inner'>
          <div className='VenueFilters__item'>
            <h4 className='VenueFilters__item-title'>
              Brunch Hours: {displayHours}
            </h4>
            <p className='VenueFilters__description'>
              Brunch available for the selected hours but not necessarily all the selected hours
            </p>
            <div className='VenueFilters__slider-container'>
              <Range
                className='VenueFilters__slider'
                min={filters.timeStart}
                max={filters.timeEnd}
                marks={makeSliderHours(filters.timeStart, filters.timeEnd)}
                onChange={this.handleTimeChange}
                defaultValue={[filters.timeStart, filters.timeEnd]}
                allowCross={false}
              />
            </div>
          </div>
          <div className='VenueFilters__item'>
            <h4 className='VenueFilters__item-title'>
              Brunch Days: {displayDays}
            </h4>
            <p className='VenueFilters__description'>
              Brunch available on the selected days but not necessarily on all the selected days
            </p>
            <div className='VenueFilters__slider-container'>
              <Range
                className='VenueFilters__slider'
                min={0}
                max={6}
                marks={makeDayMarks(days, 3)}
                onChange={this.handleDayChange}
                defaultValue={this.state.days}
                allowCross={false}
              />
            </div>
          </div>
          <div className='VenueFilters__item'>
            <h4 className='VenueFilters__item-title'>
              Bottomless Brunch Price: {displayPrices}
            </h4>
            <div className='VenueFilters__horz width-25 u-mb-0_5'>
              {this.renderPricesMeta()}
            </div>
            <div className='VenueFilters__slider-container'>
              <Range
                className='VenueFilters__slider'
                min={0}
                max={60}
                marks={prices}
                onChange={this.handlePriceChange}
                defaultValue={this.state.prices}
                allowCross={false}
              />
            </div>
          </div>
          <div className='VenueFilters__item'>
            <h4 className='VenueFilters__item-title'>
              Bottomless Drink Options
            </h4>
            <div className='VenueFilters__horz'>
              {this.renderDrinks()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
const mapStateToProps = ({ filters }) => {
  return { filters }
}

export default connect(mapStateToProps, filterActions)(VenueFilters)
