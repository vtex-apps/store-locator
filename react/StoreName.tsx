import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

import { useStoreGroup } from './StoreGroup'

const CSS_HANDLES = ['storeName'] as const

const StoreName = () => {
  const handles = useCssHandles(CSS_HANDLES)
  const group = useStoreGroup()

  if (!group) {
    return null
  }

  return <div className={handles.storeName}>{group.friendlyName}</div>
}

export default StoreName
