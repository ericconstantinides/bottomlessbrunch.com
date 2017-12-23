import * as myHelpers from '../myHelpers'
// import { drinkIncludes } from '../../lib/enumerables'

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

  it('should extrapolate drinks', () => {
    expect(myHelpers.extrapolateDrinks(dbDrinks)).toEqual(cleansedDrinks)
  })
  it('should Extrapolate Includes', () => {
    expect(
      myHelpers.extrapolateIncludes(cleansedDrinks)
    ).toEqual(sortedDrinks)
  })
})
