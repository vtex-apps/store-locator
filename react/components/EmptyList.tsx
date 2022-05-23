import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = [
  'noResults',
  'noResultsIcon',
  'noResultsTitle',
  'noResultsMessage',
] as const

const EmptyList = () => {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div className={handles.noResults}>
      <div className={handles.noResultsIcon}></div>
      <h3 className={handles.noResultsTitle}>
        <FormattedMessage id="store/none-stores" />
      </h3>
      <span className={handles.noResultsMessage}>
        <FormattedMessage id="store/none-stores-message" />
      </span>
    </div>
  )
}

export default EmptyList
