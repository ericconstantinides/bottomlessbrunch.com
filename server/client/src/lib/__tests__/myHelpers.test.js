import * as myHelpers from '../myHelpers'
import { days } from '../../lib/enumerables'

describe('myHelpers', () => {
  const dbDrinks = [
    {
      drink: ['Mimosa', 'Bloody Mary'],
      includes: 'Drink Only',
      price: 20
    },
    {
      drink: ['Bloody Mary'],
      includes: 'Drink Only',
      price: 25,
      remarks: 'with Absolute Vodka'
    },
    {
      drink: ['Mimosa'],
      includes: 'Drink + Full Course Meal',
      price: 28
    }
  ]
  const cleansedDrinks = [
    {
      drink: 'Mimosa',
      includes: 'Drink Only',
      price: 20
    },
    {
      drink: 'Bloody Mary',
      includes: 'Drink Only',
      price: 20
    },
    {
      drink: 'Bloody Mary',
      includes: 'Drink Only',
      price: 25,
      remarks: 'with Absolute Vodka'
    },
    {
      drink: 'Mimosa',
      includes: 'Drink + Full Course Meal',
      price: 28
    }
  ]
  const sortedDrinks = [
    {
      title: 'Bottomless Drinks',
      items: [
        {
          drink: 'Mimosa',
          includes: 'Drink Only',
          price: 20
        },
        {
          drink: 'Bloody Mary',
          includes: 'Drink Only',
          price: 20
        },
        {
          drink: 'Bloody Mary',
          includes: 'Drink Only',
          price: 25,
          remarks: 'with Absolute Vodka'
        }
      ]
    },
    {
      title: 'Bottomless Drinks + Prix Fixe',
      items: [
        {
          drink: 'Mimosa',
          includes: 'Drink + Full Course Meal',
          price: 28
        }
      ]
    }
  ]
  const asteriskedDrinks = {
    items: [
      {
        drink: 'Mimosa',
        includes: 'Drink Only',
        price: 20
      },
      {
        drink: 'Bloody Mary',
        includes: 'Drink Only',
        price: 20
      },
      {
        drink: 'Bloody Mary',
        includes: 'Drink Only',
        price: 25,
        remarks: 'with Absolute Vodka'
      },
      {
        drink: 'Mimosa',
        includes: 'Drink + Full Course Meal',
        price: 28,
        asterisk: '*'
      }
    ],
    asterisks: [
      {
        asterisk: '*',
        title: 'Drink + Full Course Meal'
      }
    ]
  }

  it('should extrapolate drinks', () => {
    expect(myHelpers.extrapolateDrinks(dbDrinks)).toEqual(cleansedDrinks)
  })

  it('should Extrapolate Includes', () => {
    expect(myHelpers.extrapolateIncludes(cleansedDrinks)).toEqual(sortedDrinks)
  })

  it('should create asterisked includes', () => {
    expect(myHelpers.extrapolateAsterisks(cleansedDrinks)).toEqual(
      asteriskedDrinks
    )
  })

  it('should convert string time to an floatString', () => {
    expect(myHelpers.stringTimeToNumber('10:00AM')).toEqual(10)
    expect(myHelpers.stringTimeToNumber('8:30PM')).toEqual(20.5)
    expect(myHelpers.stringTimeToNumber('12:00AM')).toEqual(0)
    expect(myHelpers.stringTimeToNumber('12:30AM')).toEqual(0.5)
    expect(myHelpers.stringTimeToNumber('12:00PM')).toEqual(12)
    expect(myHelpers.stringTimeToNumber('12:30PM')).toEqual(12.5)
  })
  it('should convert number time to a string', () => {
    expect(myHelpers.numTimeToString(10)).toEqual('10:00AM')
    expect(myHelpers.numTimeToString(20.5)).toEqual('8:30PM')
    expect(myHelpers.numTimeToString(0)).toEqual('12:00AM')
    expect(myHelpers.numTimeToString(0.5)).toEqual('12:30AM')
    expect(myHelpers.numTimeToString(12)).toEqual('12:00PM')
    expect(myHelpers.numTimeToString(12.5)).toEqual('12:30PM')
  })
  it('should convert a day into an int string', () => {
    expect(myHelpers.stringDayToNum('Monday', days)).toEqual(0)
    expect(myHelpers.stringDayToNum('tues', days)).toEqual(1)
    expect(myHelpers.stringDayToNum('saturday', days)).toEqual(5)
    expect(myHelpers.stringDayToNum('we', days)).toEqual(2)
  })
  it('should convert a number day into a string', () => {
    expect(myHelpers.numDayToStr(0, days)).toEqual('Monday')
    expect(myHelpers.numDayToStr(1, days, 3)).toEqual('Tue')
    expect(myHelpers.numDayToStr(5, days)).toEqual('Saturday')
    expect(myHelpers.numDayToStr(2, days, 2)).toEqual('We')
  })

  it('should extrapolate times', () => {
    const start = [
      {
        category: 'Bottomless Brunch',
        days: ['Friday'],
        startTime: '11:00AM',
        endTime: '2:00PM',
        _id: '59ef1a671ae6c21f0aea65d2'
      },
      {
        category: 'Bottomless Brunch',
        days: ['Saturday', 'Sunday'],
        startTime: '10:30AM',
        endTime: '4:00PM',
        _id: '59ef1ac81ae6c21f0aea65d5'
      }
    ]
    const end = [
      {
        category: 'Bottomless Brunch',
        day: 4,
        startTime: 11,
        endTime: 14
      },
      {
        category: 'Bottomless Brunch',
        day: 5,
        startTime: 10.5,
        endTime: 16
      },
      {
        category: 'Bottomless Brunch',
        day: 6,
        startTime: 10.5,
        endTime: 16
      }
    ]
    expect(myHelpers.extrapolateTimes(start, days)).toEqual(end)
  })
})
