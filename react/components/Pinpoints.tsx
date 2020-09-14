/* eslint-disable no-console */
import React, { FC } from 'react'
import { injectIntl, WrappedComponentProps } from 'react-intl'
import PropTypes from 'prop-types'

const Pinpoints: FC<WrappedComponentProps & any> = ({ items }) => {
  return (
    items.length && (
      <ul>
        {items.map((item: any, i: number) => {
          return (
            <li key={`key_${i}`}>
              <span>{item.name}</span>
              <br />
              <span>{item.address.street}</span>
            </li>
          )
        })}
      </ul>
    )
  )
}

Pinpoints.propTypes = {
  items: PropTypes.array,
}

export default injectIntl(Pinpoints)
