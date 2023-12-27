import type { FC } from 'react'
import React from 'react'
import type { WrappedComponentProps } from 'react-intl'
import { defineMessages, injectIntl } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import { useStoreGroup } from './StoreGroup'

const CSS_HANDLES = [
  'referenceContainer',
  'referenceLabel',
  'referenceText',
] as const

const messages = defineMessages({
  reference: {
    defaultMessage: 'Reference',
    id: 'store/reference-label',
  },
})

interface StoreReferenceProps {
  label: string
}

const StoreReference: FC<StoreReferenceProps & WrappedComponentProps> = ({
  label,
  intl,
}) => {
  const group = useStoreGroup()

  const handles = useCssHandles(CSS_HANDLES)

  if (!group?.address?.reference) {
    return null
  }

  return (
    <div className={handles.referenceContainer}>
      <span className={handles.referenceLabel}>
        {label ?? intl.formatMessage(messages.reference)}
      </span>

      <span className={handles.referenceText}>{group.address.reference}</span>
    </div>
  )
}

export default injectIntl(StoreReference)
