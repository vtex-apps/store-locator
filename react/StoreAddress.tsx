import React, { FC } from 'react'
import { defineMessages, WrappedComponentProps, injectIntl } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import { useStoreGroup } from './StoreGroup'

const CSS_HANDLES = [
  'addressContainer',
  'addressLink',
  'addressLabel',
  'addressStoreAddressGroupA',
  'addressStoreAddressNumber',
  'addressStoreAddressStreet',
] as const

const messages = defineMessages({
  address: {
    defaultMessage: 'Store address',
    id: 'store/address-label',
  },
})

interface StoreAddressProps {
  label: string
}

const StoreAddress: FC<StoreAddressProps & WrappedComponentProps> = ({
  label,
  intl,
}) => {
  const handles = useCssHandles(CSS_HANDLES)

  const group = useStoreGroup()

  function isValidJSON(str: string): boolean {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
}

  if (!group) {
    return null
  }
  const validJSON = isValidJSON(group.instructions)
  const instructionsParsed = validJSON ? JSON.parse(group.instructions) : null
  const storePhoneNumber = instructionsParsed ? instructionsParsed.phoneNumber : null

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
        </span>
        <br />
        {group.address.city ? `${group.address.city}` : ''}
        {group.address.state ? `, ${group.address.state}` : ''}
        {group.address.postalCode ? `, ${group.address.postalCode}` : ''}
        <br />
        <br />
        <span
            className={handles.addressStoreAddressStreet}
          >{storePhoneNumber && <a className={`${handles.addressLink} underline-hover no-underline`} href={`tel:${storePhoneNumber}`}>{storePhoneNumber}</a>}
          </span>
      </a>
    </div>
  )
}

export default injectIntl(StoreAddress)
