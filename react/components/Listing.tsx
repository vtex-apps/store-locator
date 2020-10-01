/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { FC } from 'react'
import { injectIntl, WrappedComponentProps, FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import slugify from 'slugify'
import { useRuntime } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = [
  'addressList',
  'addressListItem',
  'addressListFirstItem',
  'addressStoreName',
  'addressStoreAddress',
  'addressListLink',
] as const

const Slugify = (str: string) => {
  return slugify(str, { lower: true, remove: /[*+~.()'"!:@]/g })
}

const Listing: FC<WrappedComponentProps & any> = ({
  items,
  onChangeCenter,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const { navigate } = useRuntime()

  const handleChangeCenter = (item: any, zoom: number) => {
    const { latitude, longitude } = item.address.location

    onChangeCenter([longitude, latitude], zoom)
  }

  const goTo = (item: any) => {
    const { state: _state, postalCode } = item.address

    navigate({
      page: 'store.storedetail',
      params: {
        slug: `${Slugify(`${item.name} ${_state} ${postalCode}`)}`,
        store_id: String(item.id).replace('1_', ''),
      },
    })
  }

  return (
    items.length && (
      <ul className={`list ph3 mt0 ${handles.addressList}`}>
        {items.map((item: any, i: number) => {
          return (
            <li
              key={`key_${i}`}
              className={`pointer mb0 ph3 pv5 ${
                !i ? handles.addressListFirstItem : ''
              } ${handles.addressListItem} ${
                !i ? 'bt' : ''
              } bb bl br b--light-gray hover-bg-light-gray`}
              onClick={() => {
                handleChangeCenter(item, 12)
              }}
            >
              <span className={`t-mini b ${handles.addressStoreName}`}>
                {item.name}
              </span>
              <br />
              <span className={`t-mini ${handles.addressStoreAddress}`}>
                {item.address.number || ''}
                {item.address.street}
                {item.address.city ? `, ${item.address.city}` : ''}
                {item.address.state ? `, ${item.address.state}` : ''}
                {item.address.postalCode ? ` - ${item.address.postalCode}` : ''}
              </span>
              <br />
              <span
                className={`mt2 link c-link underline-hover pointer ${handles.addressListLink}`}
                onClick={(e) => {
                  e.stopPropagation()
                  goTo(item)
                }}
              >
                <FormattedMessage id="store/more-details" />
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
