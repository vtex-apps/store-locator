/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-console */
import React from 'react'
import { useRuntime } from 'vtex.render-runtime'

const StoreBackLink = () => {
  const { navigate, history } = useRuntime()

  console.log('history =>', history)

  const goBack = () => {
    navigate({
      page: 'store.storelocator',
    })
  }

  return (
    <div>
      <span
        className="link c-link underline-hover pointer"
        onClick={() => {
          goBack()
        }}
      >
        Back to all locations
      </span>
    </div>
  )
}

export default StoreBackLink
