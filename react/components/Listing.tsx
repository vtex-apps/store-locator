/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-console */
import React, { FC } from 'react'
import { injectIntl, WrappedComponentProps } from 'react-intl'
import PropTypes from 'prop-types'

const Listing: FC<WrappedComponentProps & any> = ({
  items,
  onChangeCenter,
}) => {
  const handleChangeCenter = (item: any) => {
    const { latitude, longitude } = item.address.location

    onChangeCenter([longitude, latitude])
  }

  return (
    items.length && (
      <ul className="list ph3 mt0" style={{ maxHeight: '500px' }}>
        {items.map((item: any, i: number) => {
          return (
            <li
              key={`key_${i}`}
              className={`pointer mb0 ph3 pv5 ${
                !i ? 'bt' : ''
              } bb bl br b--light-gray hover-bg-light-gray`}
              onClick={() => {
                handleChangeCenter(item)
              }}
            >
              <span className="t-mini b">{item.name}</span>
              <br />
              <span className="t-mini">
                {item.address.number || ''}
                {item.address.street}
                {item.address.city ? `, ${item.address.city}` : ''}
                {item.address.state ? `, ${item.address.state}` : ''}
              </span>
            </li>
          )
        })}
      </ul>
    )
  )
}

Listing.propTypes = {
  items: PropTypes.array,
  onChangeCenter: PropTypes.func,
}

export default injectIntl(Listing)
