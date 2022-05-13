/* eslint-disable vtex/prefer-early-return */
/* eslint-disable padding-line-between-statements */
/* eslint-disable no-restricted-imports */
/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import { graphql, useLazyQuery } from 'react-apollo'
import { flowRight as compose } from 'lodash'
import { Spinner } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'

import ORDER_FORM from './queries/orderForm.gql'
import GET_STORES from './queries/getStores.gql'
import GOOGLE_KEYS from './queries/GetGoogleMapsKey.graphql'
import Listing from './components/Listing'
import Pinpoints from './components/Pinpoints'
import Filter from './components/Filter'
import { filterStoresByProvince, getStoresFilter } from './utils'

const CSS_HANDLES = [
  'container',
  'storesListCol',
  'storesList',
  'storesMapCol',
  'noResults',
  'listingMapContainer',
  'loadAll',
] as const

const StoreList = ({
  orderForm: { called: ofCalled, loading: ofLoading, orderForm: ofData },
  googleMapsKeys,
  filterByTag,
  icon,
  iconWidth,
  iconHeight,
  zoom,
  lat,
  long,
  sortBy = 'distance',
}) => {
  const [getStores, { data, loading, called, error }] = useLazyQuery(
    GET_STORES,
    {
      fetchPolicy: 'cache-first',
    }
  )
  const [stores, setStores] = useState<SpecificationGroup[]>([])
  const [storesFiltered, setStoresFiltered] = useState<SpecificationGroup[]>([])
  const [storesFilter, setStoresFilter] = useState<StoresFilter>(
    getStoresFilter()
  )
  console.log(storesFilter)

  const [state, setState] = useState({
    strikes: 0,
    allLoaded: false,
    center: null,
    zoom: 30 || zoom,
  })

  const handles = useCssHandles(CSS_HANDLES)

  const loadAll = () => {
    setState({
      ...state,
      allLoaded: true,
    })
    getStores({
      variables: {
        latitude: lat,
        longitude: long,
        filterByTag: lat && long ? null : filterByTag,
      },
    })
  }

  useEffect(() => {
    state.strikes < 4 && loadAll()
  }, [state.strikes])

  useEffect(() => {
    if (
      ofData?.shippingData?.address?.postalCode &&
      ofData?.shippingData?.address?.postalCode?.indexOf('*') === -1
    ) {
      const [longitude, latitude] = ofData?.shippingData.address.geoCoordinates

      getStores({
        variables: {
          latitude,
          longitude,
          filterByTag,
        },
      })
    } else if (!loading && called && error && !state.allLoaded) {
      state.strikes < 4 &&
        setState((prev) => ({
          ...prev,
          strikes: ++prev.strikes,
        }))
    }
  }, [ofData, ofCalled, ofLoading])

  const handleCenter = (center: any) => {
    setState({
      ...state,
      center,
    })
  }
  useEffect(() => {
    if (!called) return
    if (data?.getStores?.items.length === 0) return

    if (data?.getStores?.items.length === 1) {
      setStores(data?.getStores?.items)
      return
    }

    if (data?.getStores?.items.length > 1) {
      const storesSorted =
        data?.getStores?.items.sort((a, b) => {
          if (a[sortBy] < b[sortBy]) {
            return -1
          }

          if (a[sortBy] > b[sortBy]) {
            return 1
          }

          return 0
        }) ?? []
      setStores(storesSorted)
      if (storesFilter.province === '') {
        setStoresFiltered(storesSorted)
        return
      }
      setStoresFiltered(
        filterStoresByProvince(storesFilter.province, storesSorted)
      )
    }
  }, [data, called])

  useEffect(() => {
    if (storesFilter.province === '') {
      setStoresFiltered(stores)
      return
    }
    setStoresFiltered(filterStoresByProvince(storesFilter.province, stores))
  }, [storesFilter])

  if (called) {
    if (!loading && !!data && data.getStores.items.length === 0) {
      state.strikes < 4 &&
        setState((prev) => ({
          ...prev,
          strikes: ++prev.strikes,
        }))
    }

    if (!state.center && data?.getStores?.items.length) {
      const [firstResult] = data.getStores.items

      const { latitude, longitude } = firstResult.address.location

      const center = ofData?.shippingData?.address?.geoCoordinates ?? [
        longitude || long,
        latitude || lat,
      ]

      handleCenter(center)
    }

    return (
      <div className={`flex flex-row ${handles.container}`}>
        <div className={`flex-col w-30 ${handles.storesListCol}`}>
          {loading && <Spinner />}
          {!loading && !!data && stores.length > 0 && (
            <div className={`overflow-auto h-100 ${handles.storesList}`}>
              <Filter
                storesFilter={storesFilter}
                setStoresFilter={setStoresFilter}
              />
              <Listing items={storesFiltered} onChangeCenter={handleCenter} />
              {state.allLoaded && (
                <span
                  className={`mt2 link c-link underline-hover pointer ${handles.loadAll}`}
                  onClick={() => {
                    loadAll()
                  }}
                >
                  <FormattedMessage id="store/load-all" />
                </span>
              )}
            </div>
          )}
          {!loading && !!data && stores.length === 0 && (
            <div className={handles.noResults}>
              <h3>
                <FormattedMessage id="store/none-stores" />
              </h3>
            </div>
          )}
        </div>
        <div className={`flex-col w-70 ${handles.storesMapCol}`}>
          {!loading &&
            !!data &&
            stores.length > 0 &&
            googleMapsKeys?.logistics?.googleMapsKey && (
              <Pinpoints
                apiKey={googleMapsKeys.logistics.googleMapsKey}
                className={handles.listingMapContainer}
                items={data.getStores.items}
                zoom={state.zoom}
                center={state.center}
                icon={icon}
                iconWidth={iconWidth}
                iconHeight={iconHeight}
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
