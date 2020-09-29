import React, { FC } from 'react'
import { defineMessages, WrappedComponentProps, injectIntl } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import { useStoreGroup } from './StoreGroup'

const CSS_HANDLES = ['instructionsContainer', 'instructionsLabel'] as const
const messages = defineMessages({
  information: {
    defaultMessage: 'Information',
    id: 'store/information-label',
  },
})

interface StoreInstructionsProps {
  label: string
}

const StoreInstructions: FC<StoreInstructionsProps & WrappedComponentProps> = ({
  label,
  intl,
}) => {
  const group = useStoreGroup()
  const handles = useCssHandles(CSS_HANDLES)

  if (!group?.instructions) {
    return null
  }

  return (
    <div className={handles.instructionsContainer}>
      <span className={handles.instructionsLabel}>
        {label ?? intl.formatMessage(messages.information)}
      </span>
      {group.instructions}
    </div>
  )
}

export default injectIntl(StoreInstructions)
