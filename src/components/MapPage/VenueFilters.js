import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Range } from 'rc-slider'
import AnimateHeight from 'react-animate-height'
import _ from 'lodash'
import 'rc-slider/assets/index.css'

import * as filterActions from '../../actions/filterActions'
import { filterMainMapVenues } from '../../actions/mainMapActions'

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
    this.state = {
      filterOpen: true
    }
  }
  componentDidMount = () => {
    this.props.constructFilters(
      this.props.venues,
      this.props.mainMap.activeVenues
    )
  }

  componentWillReceiveProps = nextProps => {
    const visVenuesChanged = !nextProps.mainMap.activeVenues.every(
      ({ _id }, i) =>
        this.props.mainMap.activeVenues.some(({ _id: nId }) => _id === nId)
    )
    if (visVenuesChanged || !_.isEqual(this.props.filters, nextProps.filters)) {
      nextProps.filterMainMapVenues(
        nextProps.filters,
        nextProps.venues,
        nextProps.mainMap.activeVenues
      )
    }
    if (!nextProps.filters.ready) {
      // this allows the Hours to reinitialize
      this.props.updateFilter({ ready: true })
    }
  }
  handleFilterReset = () => {
    this.props.constructFilters(
      this.props.venues,
      this.props.mainMap.activeVenues
    )
  }
  handleFiltersToggle = () => {
    // if going to close filters, reset them too:
    if (this.state.filterOpen) {
      this.props.constructFilters(
        this.props.venues,
        this.props.mainMap.activeVenues
      )
    }
    this.setState({ filterOpen: !this.state.filterOpen })
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
    if (this.props.filters.drinks[drinkName].checked) return
    this.props.changeDrink(drinkName)
  }
  handleMetaClick = metaName => event => {
    this.props.togglePriceMeta(this.props.filters.includeDrinkWithMealPrices)
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
              checked={this.props.filters.checkedDrink === drink}
              onChange={this.handleDrinkClick(drink)}
            />
            {drinkObj.label}
          </label>
        </div>
      )
    })
  }
  renderPricesMeta = () => {
    const { includeDrinkWithMealPrices: incMeal } = this.props.filters
    return (
      <div className='VenueFilters__checkbox u-d-b'>
        <label className='VenueFilters__label' disabled={incMeal.disabled}>
          <input
            name='includeDrinkWithMealPrices'
            type='checkbox'
            disabled={incMeal.disabled}
            checked={incMeal.checked && !incMeal.disabled}
            onChange={this.handleMetaClick()}
          />
          <span>Include <strong>"Drink + Meal"</strong> Prices</span>
        </label>
      </div>
    )
  }
  render () {
    const { filters } = this.props
    // if (!filters.ready) return <div>Loading...</div>
    const displayHours = filters.timeStart === filters.timeEnd
      ? numTimeToString(filters.timeStart, true)
      : numTimeToString(filters.timeStart, true) +
          ' - ' +
          numTimeToString(filters.timeEnd, true)
    const displayDays = filters.dayStart === filters.dayEnd
      ? numDayToStr(filters.dayStart, days)
      : numDayToStr(filters.dayStart, days) +
          ' - ' +
          numDayToStr(filters.dayEnd, days)
    const displayPrices = filters.priceStart === filters.priceEnd
      ? '$' + filters.priceStart
      : '$' + filters.priceStart + ' - $' + filters.priceEnd
    return (
      <div
        className={`VenueFilters ${this.state.filterOpen ? 'is-active' : 'not-active'}`}
      >
        <div className='VenueFilters__title-container'>
          <h3
            className='VenueFilters__title'
            onClick={this.handleFiltersToggle}
          >
            Filter the restaurants
          </h3>
          <span
            className='VenueFilters__reset button button--orange-black is-smaller'
            onClick={this.handleFilterReset}
          >
            Reset
          </span>
        </div>
        <AnimateHeight
          duration={333}
          height={this.state.filterOpen ? 'auto' : 0}
        >
          <div className='VenueFilters__inner'>
            <div className='VenueFilters__item'>
              <h4 className='VenueFilters__item-title'>
                Brunch Hours: {displayHours}
              </h4>
              <p className='VenueFilters__description u-hide'>
                Brunch available for some of the selected hours but not necessarily all the selected hours
              </p>
              <div className='VenueFilters__slider-container'>
                {filters.ready &&
                  <Range
                    className='VenueFilters__slider'
                    min={filters.timeMin}
                    max={filters.timeMax}
                    marks={makeTimeMarks(filters.timeMin, filters.timeMax)}
                    onChange={this.handleTimeChange}
                    defaultValue={[filters.timeMin, filters.timeMax]}
                    allowCross={false}
                    pushable
                  />}
              </div>
            </div>
            <div className='VenueFilters__item'>
              <h4 className='VenueFilters__item-title'>
                Brunch Days: {displayDays}
              </h4>
              <p className='VenueFilters__description u-hide'>
                Brunch available at least one of the selected days but not necessarily all the selected days
              </p>
              <div className='VenueFilters__slider-container'>
                <Range
                  className='VenueFilters__slider'
                  min={filters.dayMin}
                  max={filters.dayMax}
                  marks={makeDayMarks(days, 3)}
                  onChange={this.handleDayChange}
                  value={[filters.dayStart, filters.dayEnd]}
                  allowCross={false}
                />
              </div>
            </div>
            <div className='VenueFilters__item'>
              <h4 className='VenueFilters__item-title'>
                Bottomless Brunch Price: {displayPrices}
              </h4>
              {/* <div className='u-mb-0_5'>
                {this.renderPricesMeta()}
              </div> */}
              <div className='VenueFilters__slider-container'>
                <Range
                  className='VenueFilters__slider'
                  min={filters.priceMin}
                  max={filters.priceMax}
                  marks={makePriceMarks(filters.priceMin, filters.priceMax)}
                  onChange={this.handlePriceChange}
                  value={[filters.priceStart, filters.priceEnd]}
                  allowCross={false}
                />
              </div>
            </div>
            <div className='VenueFilters__item'>
              <h4 className='VenueFilters__item-title'>
                Bottomless Drink
              </h4>
              <div className='VenueFilters__horz'>
                {this.renderDrinks()}
              </div>
            </div>
          </div>
        </AnimateHeight>
      </div>
    )
  }
}
const mapStateToProps = ({ filters, venues, mainMap }) => {
  return { filters, venues, mainMap }
}

export default connect(mapStateToProps, {
  ...filterActions,
  filterMainMapVenues
})(VenueFilters)
