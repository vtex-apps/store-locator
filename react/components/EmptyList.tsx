import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = [
  'noResults',
  'noResultsIcon',
  'noResultsTitle',
  'noResultsMessage',
  'noResultsResetMessage'
] as const

interface IProps{
  resetLink: () => void
}

const EmptyList = ( {resetLink}: IProps) => {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div className={handles.noResults}>
      <div className={handles.noResultsIcon} />
      <h3 className={handles.noResultsTitle}>
        <FormattedMessage id="store/none-stores" />
      </h3>
      <span className={handles.noResultsMessage}>
        <FormattedMessage id="store/none-stores-message" />
      </span>
      <a className={`${handles.noResultsResetMessage} mt2 underline-hover no-underline`} href={`#`} onClick={() => resetLink()}>
        <FormattedMessage id="store/reset-stores-message" />
      </a>
    </div>
  )
}

export default EmptyList
