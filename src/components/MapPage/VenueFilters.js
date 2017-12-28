import React, { Component } from 'react'
import Slider from 'rc-slider'
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
  drinksObj[drink] = true
})
const pricesMeta = {}
drinkIncludes.forEach((priceMeta, i) => {
  pricesMeta[priceMeta] = true
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
  handleDrinkClick = drink => event => {
    const drinkStatus = !this.state.drinks[drink]
    let drinks = {}
    if (drink === 'All') {
      Object.keys(this.state.drinks).forEach(drink => {
        drinks[drink] = drinkStatus
      })
    } else {
      drinks = { ...this.state.drinks, [drink]: drinkStatus }
      // now double check the status of All and if it needs to be updated:
      const allSame = Object.keys(drinks).every(drink => {
        if (drink === 'All') return true
        return drinks[drink] === drinkStatus
      })
      drinks = {
        ...this.state.drinks,
        [drink]: drinkStatus,
        All: allSame ? drinkStatus : false
      }
    }
    this.setState({ drinks })
  }
  handleMetaClick = meta => event => {
    const pricesMeta = {
      ...this.state.pricesMeta,
      [meta]: !this.state.pricesMeta[meta]
    }
    this.setState({ pricesMeta })
  }
  renderDrinks = () => {
    return drinks.map((drink, i) => {
      return (
        <div className='VenueFilters__checkbox' key={i}>
          <label className='VenueFilters__label'>
            <input
              name={drink}
              type='checkbox'
              checked={this.state.drinks[drink]}
              onChange={this.handleDrinkClick(drink)}
            />
            {drink}
          </label>
        </div>
      )
    })
  }
  renderPricesMeta = () => {
    return Object.entries(this.state.pricesMeta).map(([meta, val], i) => {
      return (
        <div className='VenueFilters__checkbox' key={i}>
          <label className='VenueFilters__label'>
            <input
              name={meta}
              type='checkbox'
              checked={val}
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
    return (
      <div className={`VenueFilters ${this.state.activeClass}`}>
        <h3 className='VenueFilters__title' onClick={this.handleFiltersToggle}>
          Filters
        </h3>
        <div className='VenueFilters__inner'>
          <div className='VenueFilters__item'>
            <h4 className='VenueFilters__item-title'>
              Brunch Hours:
              {' '}
              {hours[this.state.hours[0]]}
              {' '}
              -
              {' '}
              {hours[this.state.hours[1]]}
            </h4>
            <div className='VenueFilters__slider-container'>
              <Slider.Range
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
              Brunch Days:
              {' '}
              {days[this.state.days[0]]}
              {' '}
              -
              {' '}
              {days[this.state.days[1]]}
            </h4>
            <div className='VenueFilters__slider-container'>
              <Slider.Range
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
              Bottomless Brunch Price:
              {' '}
              ${this.state.prices[0]}
              {' '}
              -
              {' '}
              ${this.state.prices[1]}
            </h4>
            <div className='VenueFilters__horz width-25 u-mb-0_5'>
              {this.renderPricesMeta()}
            </div>
            <div className='VenueFilters__slider-container'>
              <Slider.Range
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
