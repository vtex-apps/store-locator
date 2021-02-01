import React, { FC, useContext } from 'react'
import { defineMessages, WrappedComponentProps, injectIntl } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import { OptionsContext } from './contexts/OptionsContext'
import { useStoreGroup } from './StoreGroup'

const CSS_HANDLES = [
  'instructionsContainer',
  'instructionsLabel',
  'instructionsText',
  'instructionsLink',
] as const

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
  const hasPhone = useContext(OptionsContext)

  const handles = useCssHandles(CSS_HANDLES)

  if (!group?.instructions) {
    return null
  }

  return (
    <div className={handles.instructionsContainer}>
      <span className={handles.instructionsLabel}>
        {label ?? intl.formatMessage(messages.information)}
      </span>
      {hasPhone ? (
        <a
          className={`${handles.instructionsLink} underline-hover no-underline`}
          href={`tel:${group.instructions}`}
        >
          {group.instructions}
        </a>
      ) : (
        <span className={handles.instructionsText}>{group.instructions}</span>
      )}
    </div>
  )
}

export default injectIntl(StoreInstructions)
