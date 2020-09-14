/* eslint-disable no-console */
import React from 'react'
import { injectIntl } from 'react-intl'
import { graphql, compose, useLazyQuery } from 'react-apollo'
import { Spinner, Button } from 'vtex.styleguide'

import ORDER_FORM from './queries/orderForm.gql'
import GET_STORES from './queries/getStores.gql'
import GOOGLE_KEYS from './queries/GetGoogleMapsKey.graphql'
import Listing from './components/Listing'
import Pinpoints from './components/Pinpoints'

let nearBy = false
const StoreList = ({
  orderForm: { called: ofCalled, loading: ofLoading, orderForm: ofData },
  googleMapsKeys: { data: googleKeys },
}) => {
  const [getStores, { data, loading, called }] = useLazyQuery(GET_STORES)

  if (googleKeys) {
    console.log('googleKeys =>', googleKeys)
  }

  if (ofCalled && !ofLoading && !called) {
    console.log('VARIABLES =>', {
      variables: {
        postalCode: ofData?.shippingData?.address?.postalCode || null,
        pageNumber: 1,
        pageSize: 50,
      },
    })
    nearBy = ofData?.shippingData?.address?.postalCode || null

    getStores({
      variables: {
        postalCode: ofData?.shippingData?.address?.postalCode || null,
        pageNumber: 1,
        pageSize: 50,
      },
    })
  }

  if (called) {
    console.log('DATA =>', data, nearBy)

    return (
      <div className="flex flex-row">
        <div className="flex-col w-30">
          {loading && <Spinner />}
          {!loading && !!data && data.getStores.items.length && (
            <Listing items={data.getStores.items} />
          )}
          {!loading && !!data && !data.getStores.items.length && (
            <div>
              <span>None stores nearby.</span>
              <br />
              <Button
                variation="tertiary"
                onClick={() => {
                  getStores({
                    variables: {
                      postalCode: null,
                      pageNumber: 1,
                      pageSize: 50,
                    },
                  })
                }}
              >
                Load all stores
              </Button>
            </div>
          )}
        </div>
        <div className="flex-col w-70">
          {!loading && !!data && data.getStores.items.length && (
            <Pinpoints items={data.getStores.items} />
          )}
        </div>
      </div>
    )
  }

  console.log('orderForm =>', ofData)

  return null
}

export default injectIntl(
  compose(
    graphql(ORDER_FORM, {
      name: 'orderForm',
      options: {
        ssr: false,
      },
    }),
    graphql(GOOGLE_KEYS, {
      name: 'googleMapsKeys',
      options: {
        ssr: false,
      },
    })
  )(StoreList)
)
