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
import { graphql, useLazyQuery, useQuery } from 'react-apollo'
import { flowRight as compose } from 'lodash'
import { Spinner } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'

import ORDER_FORM from './queries/orderForm.gql'
import GET_STORES from './queries/getStores.gql'
import GOOGLE_KEYS from './queries/GetGoogleMapsKey.graphql'
import STORES_SETTINGS from './queries/storesSettings.graphql'
import Listing from './components/Listing'
import Pinpoints from './components/Pinpoints'
import Filter from './components/Filter'
import { filterStoresByProvince, getStoresFilter, saveStoresFilter } from './utils'
import EmptyList from './components/EmptyList'

const CSS_HANDLES = [
  'listContainer',
  'listContainerCol',
  'storesListCol',
  'storesList',
  'storesMapCol',
  'noResults',
  'listingMapContainer',
  'loadAll',
  'loadingContainer',
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
  const { data: storesSettings, loading: loadingStoresSettings } = useQuery<
    SettingsProps
  >(STORES_SETTINGS, { ssr: false })
  const [getStores, { data, loading, called, error }] = useLazyQuery(
    GET_STORES,
    {
      fetchPolicy: 'cache-first',
    }
  )
  const [stores, setStores] = useState<SpecificationGroup[]>([])
  const [storesFiltered, setStoresFiltered] = useState<any[]>([])
  const [storesFilter, setStoresFilter] = useState<StoresFilter>(
    getStoresFilter()
  )

  const [state, setState] = useState<{strikes: number, allLoaded:boolean, center: any, zoom: number}>({
    strikes: 0,
    allLoaded: false,
    center: null as unknown as number[],
    zoom: zoom || 8,
  })

  const handles = useCssHandles(CSS_HANDLES)

  const loadAll = () => {
    setState({
      ...state,
      allLoaded: true,
    })
    if (!storesFilter.store) {
      getStores({
        variables: {
          latitude: lat,
          longitude: long,
          filterByTag: lat && long ? null : filterByTag,
        },
      })
    } else {
      getStores({
        variables: {
          latitude: null,
          longitude: null,
          filterByTag: storesFilter.store,
        },
      })
    }
  }

  useEffect(() => {
    state.strikes < 4 && loadAll()
  }, [state.strikes])

  useEffect(() => {
    loadAll()
  }, [storesFilter.store])

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
          filterByTag: storesFilter.store || filterByTag,
        },
      })
    } else if (!loading && called && error && !state.allLoaded) {
      state.strikes < 4 &&
        setState((prev) => ({
          ...prev,
          strikes: ++prev.strikes,
        }))
    }
  }, [ofData, ofCalled, ofLoading, storesFilter.store])
  useEffect(() => {
    getStores({
      variables: {
        filterByTag: storesFilter.store || filterByTag,
      },
    })
  }, [storesFilter.store])

  const handleCenter = (center: any) => {
    setState({
      ...state,
      center,
    })
  }
  useEffect(() => {
    if (!called) return

    if (data?.getStores?.items.length <= 1) {
      setStores(data?.getStores?.items)
      setStoresFiltered(data?.getStores?.items)
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
  }, [storesFilter.province])

  useEffect(() => {
    if (storesFiltered && storesFiltered[0]?.address.location) {
      const { longitude, latitude } = storesFiltered[0].address.location
      setState({ ...state, center: [longitude, latitude], zoom: 9 })
    }
  }, [storesFiltered])

  if (called && !loadingStoresSettings) {
    let storesSettingsParsed: { stores: StoreOnStoresFilter[] } =
      storesSettings && JSON.parse(storesSettings?.appSettings.message)
    storesSettingsParsed = storesSettingsParsed?.stores?.length
      ? storesSettingsParsed
      : { stores: [] }

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
      <div className={`flex flex-row ${handles.listContainer}`}>
        <div className={`flex-col w-100 ${handles.listContainerCol}`}>
          <Filter
            storesFilter={storesFilter}
            setStoresFilter={setStoresFilter}
            storesSettings={storesSettingsParsed.stores}
          />
          {loading && (
            <div className={handles.loadingContainer}>
              <Spinner />
            </div>
          )}
          {!loading && !!data && googleMapsKeys?.logistics?.googleMapsKey && (
            <div className={handles.storesMapCol}>
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
            </div>
          )}
          {!loading && !!data && storesFiltered.length === 0 && <EmptyList resetLink={() => {
            saveStoresFilter('province', '')
            saveStoresFilter('store', '')
            setStoresFilter(getStoresFilter())
          }} />}
          {!loading && !!data && storesFiltered.length > 0 && (
            <div className={handles.storesListCol}>
              <div className={`overflow-auto h-100 ${handles.storesList}`}>
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
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-row ${handles.listContainer}`}>
      <div className="flex-col w-100">
        <div className={handles.loadingContainer}>
          <Spinner />
        </div>
      </div>
    </div>
  )
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