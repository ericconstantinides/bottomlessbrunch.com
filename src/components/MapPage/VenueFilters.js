import React, { Component } from 'react'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

import { drinks } from '../../lib/enumerables'
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
console.log(hours)

class VenueFilters extends Component {
  constructor (props) {
    super(props)
    this.state = {
      activeClass: 'not-active',
      hours: [8, 16],
      days: [0, 6],
      prices: [0, 60]
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
  renderDrinks = () => {
    return drinks.map((drink, i) => {
      return (
        <div key={i}>
          <input type='checkbox' />
          <label>{drink}</label>
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
              Brunch Price:
              {' '}
              {prices[this.state.prices[0]]}
              {' '}
              -
              {' '}
              {prices[this.state.prices[1]]}
            </h4>
            <div className='VenueFilters__slider-container'>
              <Slider.Range
                className='VenueFilters__slider'
                min={0}
                max={60}
                marks={prices}
                step={5}
                onChange={this.handlePriceChange}
                defaultValue={this.state.prices}
                allowCross={false}
              />
            </div>
            <div className='VenueFilters__item VenueFilters__horz'>
              <div>
                <input type='checkbox' />
                <label>Drink Only</label>
              </div>
              <div>
                <input type='checkbox' />
                <label>w/ Entree</label>
              </div>
              <div>
                <input type='checkbox' />
                <label>w/ Buffet</label>
              </div>
              <div>
                <input type='checkbox' />
                <label>w/ Prix Fixe</label>
              </div>
            </div>
          </div>
          <div className='VenueFilters__item'>
            <h4 className='VenueFilters__item-title'>Drinks Available</h4>
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
