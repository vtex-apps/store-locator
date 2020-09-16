/* eslint-disable no-console */
import React from 'react'
import { useLazyQuery } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'
import { Spinner } from 'vtex.styleguide'

import GET_STORE from './queries/getStore.gql'

const StoreHours = () => {
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

  const dayOfWeek = (day: number) => {
    switch (day) {
      case 0:
        return 'Sunday'

      case 1:
        return 'Monday'

      case 2:
        return 'Tuesday'

      case 3:
        return 'Wednesday'

      case 4:
        return 'Thursday'

      case 5:
        return 'Friday'

      case 6:
        return 'Saturday'

      default:
        return ''
    }
  }

  console.log('storeHours', data)

  return (
    <div>
      {loading && <Spinner />}
      {data?.pickupPoint && (
        <p>
          <span className="b">Store Hours:</span>
          <br />
          {data.pickupPoint.businessHours.map((item: any, i: number) => {
            return (
              <div key={`hour_${i}`}>
                <span>
                  {dayOfWeek(item.dayOfWeek)}: {item.openingTime} {` - `}{' '}
                  {item.closingTime}
                </span>
              </div>
            )
          })}
        </p>
      )}
    </div>
  )
}

export default StoreHours
