import React, { FC } from 'react'
import PropTypes from 'prop-types'
import { useCssHandles } from 'vtex.css-handles'

import { useStoreGroup } from './StoreGroup'

const CSS_HANDLES = ['storeName'] as const

const StoreName: FC<StoreNameProps> = ({ text, tag }) => {
  const handles = useCssHandles(CSS_HANDLES)
  const group = useStoreGroup()

  if (!group) {
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
    <Wrapper className={handles.storeName}>
      {text ? parseText(text) : group.friendlyName}
    </Wrapper>
  )
}

interface StoreNameProps {
  text?: string
  tag?: string
}

StoreName.defaultProps = {
  tag: 'div',
}

StoreName.propTypes = {
  text: PropTypes.string,
  tag: PropTypes.string,
}

export default StoreName
