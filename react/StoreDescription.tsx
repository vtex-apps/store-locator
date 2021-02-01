import React, { FC } from 'react'
import PropTypes from 'prop-types'
import { useCssHandles } from 'vtex.css-handles'

import { useStoreGroup } from './StoreGroup'

const CSS_HANDLES = ['storeDescription'] as const

const StoreDescription: FC<StoreNameProps> = ({ text, tag }) => {
  const handles = useCssHandles(CSS_HANDLES)
  const group = useStoreGroup()

  if (!group || !text) {
    return null
  }

  const Wrapper = tag as keyof JSX.IntrinsicElements

  const parseText = (string: string) => {
    const { city, state } = group.address

    return string
      .replace(/{storeName}/gi, group.friendlyName)
      .replace(/{storeCity}/gi, city ?? '')
      .replace(/{storeState}/gi, state ?? '')
  }

  return (
    <Wrapper className={handles.storeDescription}>{parseText(text)}</Wrapper>
  )
}

interface StoreNameProps {
  text?: string
  tag?: string
}

StoreDescription.defaultProps = {
  tag: 'div',
}

StoreDescription.propTypes = {
  text: PropTypes.string,
  tag: PropTypes.string,
}

export default StoreDescription
