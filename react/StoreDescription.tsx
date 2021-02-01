import React, { FC } from 'react'
import PropTypes from 'prop-types'
import { useCssHandles } from 'vtex.css-handles'

import { useStoreGroup } from './StoreGroup'

const CSS_HANDLES = ['descriptionContainer', 'descriptionText'] as const

const StoreDescription: FC<StoreNameProps> = ({ text }) => {
  const handles = useCssHandles(CSS_HANDLES)
  const group = useStoreGroup()

  if (!group || !text) {
    return null
  }

  const parseText = (string: string) => {
    const { city, state } = group.address

    return string
      .replace(/{storeName}/gi, group.friendlyName)
      .replace(/{storeCity}/gi, city ?? '')
      .replace(/{storeState}/gi, state ?? '')
  }

  return (
    <div className={handles.descriptionContainer}>
      <div className={handles.descriptionText}>{parseText(text)}</div>
    </div>
  )
}

interface StoreNameProps {
  text?: string
}

StoreDescription.propTypes = {
  text: PropTypes.string,
}

export default StoreDescription
