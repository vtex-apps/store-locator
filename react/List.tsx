/* eslint-disable no-console */
import React, { useState } from 'react'
import { injectIntl } from 'react-intl'
import { graphql, compose, useLazyQuery } from 'react-apollo'
import { Spinner, Button } from 'vtex.styleguide'

import ORDER_FORM from './queries/orderForm.gql'
import GET_STORES from './queries/getStores.gql'
import GOOGLE_KEYS from './queries/GetGoogleMapsKey.graphql'
import Listing from './components/Listing'
import Pinpoints from './components/Pinpoints'

const StoreList = ({
  orderForm: { called: ofCalled, loading: ofLoading, orderForm: ofData },
  googleMapsKeys,
}) => {
  const [getStores, { data, loading, called }] = useLazyQuery(GET_STORES)

  const [state, setState] = useState({
    allLoaded: false,
  })

  console.log('ofData =>', ofData)
  console.log('getStores data =>', data)

  const loadAll = () => {
    console.log('loadAll')

    setState({
      allLoaded: true,
    })
    getStores({
      variables: {
        postalCode: null,
        pageNumber: 1,
        pageSize: 50,
      },
    })
  }

  if (ofCalled && !ofLoading && !called) {
    if (ofData.shippingData?.address?.postalCode) {
      getStores({
        variables: {
          postalCode: ofData.shippingData.address.postalCode,
          pageNumber: 1,
          pageSize: 50,
        },
      })
    } else {
      loadAll()
    }
  }

  if (called) {
    if (!loading && !!data && data.getStores.items.length === 0) {
      loadAll()
    }

    return (
      <div className="flex flex-row">
        <div className="flex-col w-30">
          {loading && <Spinner />}
          {!loading && !!data && data.getStores.items.length > 0 && (
            <div>
              <Listing items={data.getStores.items} />
              {!state.allLoaded && (
                <Button
                  variation="tertiary"
                  onClick={() => {
                    loadAll()
                  }}
                >
                  Load all stores
                </Button>
              )}
            </div>
          )}
          {!loading && !!data && data.getStores.items.length === 0 && (
            <div>
              <span>None stores nearby.</span>
              <br />
              Loading all stores
            </div>
          )}
        </div>
        <div className="flex-col w-70">
          {!loading &&
            !!data &&
            data.getStores.items.length > 0 &&
            googleMapsKeys?.logistics?.googleMapsKey && (
              <Pinpoints
                googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${googleMapsKeys.logistics.googleMapsKey}&v=3.exp&libraries=geometry,drawing,places`}
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `400px` }} />}
                mapElement={<div style={{ height: `100%` }} />}
                items={data.getStores.items}
                location={ofData.shippingData?.address}
              />
            )}
        </div>
      </div>
    )
  }

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
