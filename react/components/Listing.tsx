/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { FC } from 'react'
import { injectIntl, WrappedComponentProps } from 'react-intl'
import PropTypes from 'prop-types'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = [
  'addressList',
  'addressListItem',
  'addressListFirstItem',
  'addressStoreName',
  'addressStoreAddress',
] as const

const Listing: FC<WrappedComponentProps & any> = ({
  items,
  onChangeCenter,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const handleChangeCenter = (item: any) => {
    const { latitude, longitude } = item.address.location

    onChangeCenter([longitude, latitude])
  }

  return (
    items.length && (
      <ul className={handles.addressList}>
        {items.map((item: any, i: number) => {
          return (
            <li
              key={`key_${i}`}
              className={`${!i ? handles.addressListFirstItem : ''} ${
                handles.addressListItem
              }`}
              onClick={() => {
                handleChangeCenter(item)
              }}
            >
              <span className={handles.addressStoreName}>{item.name}</span>
              <span className={handles.addressStoreAddress}>
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
