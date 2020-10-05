import React, { FC } from 'react'
import { defineMessages, WrappedComponentProps, injectIntl } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import { useStoreGroup } from './StoreGroup'

const CSS_HANDLES = ['addressContainer', 'addressLabel'] as const
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

  if (!group) {
    return null
  }

  return (
    <div className={handles.addressContainer}>
      <span className={`b ${handles.addressLabel}`}>
        {label ?? intl.formatMessage(messages.address)}
      </span>
      <br />
      {group.address.number ? `${group.address.number} ` : ''}
      {`${group.address.street}`}
      <br />
      {group.address.city ? `${group.address.city}` : ''}
      {group.address.state ? `, ${group.address.state}` : ''}
      {group.address.postalCode ? `, ${group.address.postalCode}` : ''}
    </div>
  )
}

export default injectIntl(StoreAddress)
