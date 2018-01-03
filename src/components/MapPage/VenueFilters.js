import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Range } from 'rc-slider'
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
      activeClass: 'is-active'
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
    const activeClass = this.state.activeClass === 'not-active'
      ? 'is-active'
      : 'not-active'
    this.setState({ activeClass })
  }
  handleTimeChange = hours => {
    const { updateFilter } = this.props
    const { timeMin, timeMax, timeStart, timeEnd} = this.props.filters
    // if (hours[0] === timeEnd && timeEnd < timeMax) {
    //   updateFilter({ timeStart: hours[0], timeEnd: hours[0] + 1 }) 
    // } else if (hours[1] === timeStart && timeStart > timeMin) {
    //   updateFilter({ timeStart: hours[1] - 1, timeEnd: hours[1] })
    // } else {
      updateFilter({ timeStart: hours[0], timeEnd: hours[1] })
    // }
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
      <div className={`VenueFilters ${this.state.activeClass}`}>
        <div>
          <h3
            className='VenueFilters__title'
            onClick={this.handleFiltersToggle}
          >
            Filters
          </h3>
          <span onClick={this.handleFilterReset} className="button button--orange-black is-smaller">Reset Filters</span>
        </div>
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
              />
            }
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
