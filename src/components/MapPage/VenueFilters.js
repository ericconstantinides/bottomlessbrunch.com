import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Range } from 'rc-slider'
import _ from 'lodash'
import 'rc-slider/assets/index.css'

import * as filterActions from '../../actions/filterActions'
import { setMainMapFilteredVenues } from '../../actions/mainMapActions'

import { days } from '../../lib/enumerables'
import {
  makeTimeMarks,
  makePriceMarks,
  makeDayMarks,
  numTimeToString,
  numDayToStr
} from '../../lib/myHelpers'

class VenueFilters extends Component {
  constructor (props) {
    super(props)
    this.state = { activeClass: 'is-active' }
  }
  componentWillReceiveProps = nextProps => {
    if (!_.isEqual(this.props.filters, nextProps.filters)) {
      nextProps.setMainMapFilteredVenues(
        nextProps.filters,
        nextProps.venues,
        nextProps.mainMap.visibleVenuesArr
      )  
    }
  }
  handleFiltersToggle = () => {
    const activeClass = this.state.activeClass === 'not-active'
      ? 'is-active'
      : 'not-active'
    this.setState({ activeClass })
  }
  handleTimeChange = hours => {
    this.props.updateFilter({ timeStart: hours[0], timeEnd: hours[1] })
  }
  handleDayChange = days => {
    this.props.updateFilter({ dayStart: days[0], dayEnd: days[1] })
  }
  handlePriceChange = prices => {
    this.props.updateFilter({ priceStart: prices[0], priceEnd: prices[1] })
  }
  handleDrinkClick = drinkName => event => {
    this.props.toggleDrink(this.props.filters.drinks, drinkName)
  }
  handleMetaClick = metaName => event => {
    this.props.togglePriceMeta(this.props.filters.priceMeta, metaName)
  }
  renderDrinks = () => {
    return Object.entries(
      this.props.filters.drinks
    ).map(([drink, drinkObj], i) => {
      return (
        <div className='VenueFilters__checkbox' key={i}>
          <label className='VenueFilters__label' disabled={drinkObj.disabled}>
            <input
              name={drink}
              type='checkbox'
              disabled={drinkObj.disabled}
              checked={drinkObj.checked && !drinkObj.disabled}
              onChange={this.handleDrinkClick(drink)}
            />
            {drink}
          </label>
        </div>
      )
    })
  }
  renderPricesMeta = () => {
    return Object.entries(
      this.props.filters.priceMeta
    ).map(([meta, metaObj], i) => {
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
            {metaObj.label}
          </label>
        </div>
      )
    })
  }
  render () {
    const { filters } = this.props
    const displayHours = filters.timeStart === filters.timeEnd
      ? numTimeToString(filters.timeStart)
      : numTimeToString(filters.timeStart) +
          ' - ' +
          numTimeToString(filters.timeEnd)
    const displayDays = filters.dayStart === filters.dayEnd
      ? numDayToStr(filters.dayStart, days)
      : numDayToStr(filters.dayStart, days) +
          ' - ' +
          numDayToStr(filters.dayEnd, days)
    const displayPrices = filters.priceStart === filters.priceEnd
      ? '$' + filters.priceStart
      : '$' + filters.priceStart + ' - $' + filters.priceEnd
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
              Brunch available for some of the selected hours but not necessarily all the selected hours
            </p>
            <div className='VenueFilters__slider-container'>
              <Range
                className='VenueFilters__slider'
                min={filters.timeMin}
                max={filters.timeMax}
                marks={makeTimeMarks(filters.timeMin, filters.timeMax)}
                onChange={this.handleTimeChange}
                defaultValue={[filters.timeMin, filters.timeMax]}
                allowCross={false}
                pushable
              />
            </div>
          </div>
          <div className='VenueFilters__item'>
            <h4 className='VenueFilters__item-title'>
              Brunch Days: {displayDays}
            </h4>
            <p className='VenueFilters__description'>
              Brunch available at least one of the selected days but not necessarily all the selected days
            </p>
            <div className='VenueFilters__slider-container'>
              <Range
                className='VenueFilters__slider'
                min={filters.dayMin}
                max={filters.dayMax}
                marks={makeDayMarks(days, 3)}
                onChange={this.handleDayChange}
                defaultValue={[filters.dayMin, filters.dayMax]}
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
                min={filters.priceMin}
                max={filters.priceMax}
                marks={makePriceMarks(filters.priceMin, filters.priceMax)}
                onChange={this.handlePriceChange}
                defaultValue={[filters.priceMin, filters.priceMax]}
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
const mapStateToProps = ({ filters, venues, mainMap }) => {
  return { filters, venues, mainMap }
}

export default connect(mapStateToProps, {
  ...filterActions,
  setMainMapFilteredVenues
})(VenueFilters)
