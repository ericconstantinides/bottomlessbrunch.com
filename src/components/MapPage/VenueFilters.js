import React, { Component } from 'react'
import { Range } from 'rc-slider'
import 'rc-slider/assets/index.css'

import { drinks, drinkIncludes } from '../../lib/enumerables'
import { makeSliderHours, makeSliderPrices } from '../../lib/myHelpers'

drinks.push('All')

const days = {
  0: 'Mon',
  1: 'Tue',
  2: 'Wed',
  3: 'Thu',
  4: 'Fri',
  5: 'Sat',
  6: 'Sun'
}
const prices = makeSliderPrices(0, 60)
const hours = makeSliderHours(7, 17)

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
      hours: [8, 16],
      days: [0, 6],
      prices: [0, 60],
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
    const displayHours = this.state.hours[0] === this.state.hours[1]
      ? hours[this.state.hours[0]]
      : hours[this.state.hours[0]] + ' - ' + hours[this.state.hours[1]]
    const displayDays = this.state.days[0] === this.state.days[1]
      ? days[this.state.days[0]]
      : days[this.state.days[0]] + ' - ' + days[this.state.days[1]]
    const displayPrices = this.state.prices[0] === this.state.prices[1]
      ? '$' + this.state.prices[0]
      : '$' + this.state.prices[0] + ' - ' + '$' + this.state.prices[1]
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
              Brunch available at some time within the selected hours but not necessarily all hours
            </p>
            <div className='VenueFilters__slider-container'>
              <Range
                className='VenueFilters__slider'
                min={7}
                max={17}
                marks={hours}
                onChange={this.handleTimeChange}
                defaultValue={this.state.hours}
                allowCross={false}
              />
            </div>
          </div>
          <div className='VenueFilters__item'>
            <h4 className='VenueFilters__item-title'>
              Brunch Days: {displayDays}
            </h4>
            <p className='VenueFilters__description'>
              Brunch available at least one of the selected days
            </p>
            <div className='VenueFilters__slider-container'>
              <Range
                className='VenueFilters__slider'
                min={0}
                max={6}
                marks={days}
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

export default VenueFilters
