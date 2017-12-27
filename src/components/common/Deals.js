import React from 'react'
import { extrapolateDrinks, extrapolateIncludes } from '../../lib/myHelpers'

const Deals = ({ venue }) => {
  const deals = extrapolateIncludes(extrapolateDrinks(venue.funItems))
  const output = deals.map(dealSection => (
    <table key={dealSection.title} className='Deals'>
      <tbody className='Deals__table'>
        <tr className='Deals__tr'>
          <th colSpan='2' className='Deals__th'>
            {dealSection.title}
          </th>
        </tr>
        {dealSection.items.map((deal, i) => (
          <tr key={i} className='Deals__tr'>
            <td className='Deals__td Deals__td--left'>
              ${deal.price}
            </td>
            <td className='Deals__td Deals__td--right'>
              {deal.drink} {deal.remarks &&
              <span>({deal.remarks})</span>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ))
  return output
}

export default Deals
