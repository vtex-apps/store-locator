/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { FC } from 'react'
import { defineMessages, WrappedComponentProps, injectIntl } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['backlinkContainer', 'backlink'] as const
const messages = defineMessages({
  backlink: {
    defaultMessage: 'Back to all stores',
    id: 'store/back-link',
  },
})

interface StoreBackLinkProps {
  label: string
}

const StoreBackLink: FC<StoreBackLinkProps & WrappedComponentProps> = ({
  label,
  intl,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const { navigate } = useRuntime()

  const goBack = () => {
    navigate({
      page: 'store.storelocator',
    })
  }

  return (
    <div className={handles.backlinkContainer}>
      <span
        className={`link c-link underline-hover pointer ${handles.backlink}`}
        onClick={() => {
          goBack()
        }}
      >
        {label ?? intl.formatMessage(messages.backlink)}
      </span>
    </div>
  )
}

export default injectIntl(StoreBackLink)
