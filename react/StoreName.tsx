import React, { FC } from 'react'
import { useCssHandles } from 'vtex.css-handles'

import { useStoreGroup } from './StoreGroup'

const CSS_HANDLES = ['storeName'] as const

interface StoreNameProps {
  text: string
}

const StoreName: FC<StoreNameProps> = ({ text }) => {
  const handles = useCssHandles(CSS_HANDLES)
  const group = useStoreGroup()

  if (!group) {
    return null
  }

  const parseText = (string: string) => {
    return string.replace(/{store-name}/gi, group.friendlyName)
  }

  return (
    <h1 className={handles.storeName}>
      {text ? parseText(text) : group.friendlyName}
    </h1>
  )
}

export default StoreName
