import type { FC } from 'react'
import React from 'react'
import type { WrappedComponentProps } from 'react-intl'
import { defineMessages, injectIntl } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import { useStoreGroup } from './StoreGroup'

const CSS_HANDLES = [
  'addressContainer',
  'addressLink',
  'addressLabel',
  'addressStoreAddressGroupA',
  'addressStoreAddressNumber',
  'addressStoreAddressStreet',
  'addressStoreAddressNeighborhood',
  'addressStoreAddressCity',
  'addressStoreAddressState',
  'addressStoreAddressPostalCode',
] as const

const messages = defineMessages({
  address: {
    defaultMessage: 'Store address',
    id: 'store/address-label',
  },
})

interface StoreAddressProps {
  label: string
  showNeighborhood?: boolean
}

const StoreAddress: FC<StoreAddressProps & WrappedComponentProps> = ({
  label,
  showNeighborhood = false,
  intl,
}) => {
  const handles = useCssHandles(CSS_HANDLES)

  const group = useStoreGroup()

  if (!group) {
    return null
  }

  const [lng, lat] = group.address.geoCoordinates

  return (
    <div className={handles.addressContainer}>
      <span className={`b ${handles.addressLabel}`}>
        {label ?? intl.formatMessage(messages.address)}
      </span>
      <a
        className={`${handles.addressLink} underline-hover no-underline`}
        target="_blank"
        rel="noreferrer"
        href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
      >
        <br />
        <span className={handles.addressStoreAddressGroupA}>
          <span className={handles.addressStoreAddressNumber}>
            {group.address.number ? `${group.address.number} ` : ''}
          </span>
          <span
            className={handles.addressStoreAddressStreet}
          >{`${group.address.street}`}</span>
          {showNeighborhood && (
            <span
              className={handles.addressStoreAddressNeighborhood}
            >{`${group.address.neighborhood}`}</span>
          )}
        </span>
        <br />
        <span className={handles.addressStoreAddressCity}>
          {group.address.city ? `${group.address.city}` : ''}
        </span>
        <span className={handles.addressStoreAddressState}>
          {group.address.state ? `, ${group.address.state}` : ''}
        </span>
        <span className={handles.addressStoreAddressPostalCode}>
          {group.address.postalCode ? `, ${group.address.postalCode}` : ''}
        </span>
      </a>
    </div>
  )
}

export default injectIntl(StoreAddress)
