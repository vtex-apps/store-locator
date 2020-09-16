/* eslint-disable no-console */
import React from 'react'
import { useLazyQuery } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'
import { Spinner } from 'vtex.styleguide'

import GET_STORE from './queries/getStore.gql'

const StoreName = () => {
  const { history } = useRuntime()
  const [getStore, { data, loading, called }] = useLazyQuery(GET_STORE)

  if (history && !called) {
    const pathArr = history.location.pathname.split('-')
    const id = pathArr[pathArr.length - 1]

    getStore({
      variables: {
        id,
      },
    })
  }

  return (
    <div>
      {loading && <Spinner />}
      {data?.pickupPoint.friendlyName}
    </div>
  )
}

export default StoreName
