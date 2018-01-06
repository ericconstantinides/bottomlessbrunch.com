import React from 'react'
import { extrapolateDrinks, extrapolateAsterisks } from '../../lib/myHelpers'

const renderAsterisks = asterisks => (
  asterisks.map((astObj, i) => (
    <div key={i} className='Deals__asterisk-item'>
      <span className='asterisk'>{astObj.asterisk}</span>Price includes {astObj.title}
    </div>
  ))
)

const renderDeals = items => (
  items.map((deal, i) => (
    <tr key={i} className='Deals__tr'>
      <td className='Deals__td Deals__td--left'>
        ${deal.price}
      </td>
      <td className='Deals__td Deals__td--right'>
        {deal.drink}{deal.remarks &&
        <span> ({deal.remarks})</span>}
        {deal.asterisk &&
        <span className='asterisk'>{deal.asterisk}</span>}
      </td>
    </tr>
  ))
)

const Deals = ({ venue }) => {
  const deals = extrapolateAsterisks(extrapolateDrinks(venue.funItems))
  const output = (
    <div>
      <table className='Deals'>
        <tbody className='Deals__table'>
          <tr className='Deals__tr'>
            <th colSpan='2' className='Deals__th'>
              Bottomless Drinks
            </th>
          </tr>
          {renderDeals(deals.items)}
        </tbody>
      </table>
      {deals.asterisks &&
        <div className='Deals__asterisks'>
          {renderAsterisks(deals.asterisks)}
        </div>
      }
    </div>
  )
  return output
}

export default Deals
