/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FunctionComponent } from 'react'
import React, { useState, useEffect } from 'react'
import type { WrappedComponentProps } from 'react-intl'
import { injectIntl, FormattedMessage } from 'react-intl'
import { useQuery, useLazyQuery } from 'react-apollo'
import { Spinner } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'

import ORDER_FORM from './queries/orderForm.gql'
import GET_STORES from './queries/getStores.gql'
import GOOGLE_KEYS from './queries/GetGoogleMapsKey.graphql'
import Listing from './components/Listing'
import Pinpoints from './components/Pinpoints'

const CSS_HANDLES = [
  'container',
  'storesListCol',
  'storesList',
  'storesMapCol',
  'noResults',
  'listingMapContainer',
  'loadAll',
] as const

interface Props {
  filterByTag?: string
  icon?: string
  iconWidth?: number
  iconHeight?: number
  zoom?: number
  lat?: number
  long?: number
  sortBy?: string
}

const StoreList: FunctionComponent<WrappedComponentProps & Props> = ({
  filterByTag,
  icon,
  iconWidth,
  iconHeight,
  zoom,
  lat,
  long,
  sortBy = 'distance',
}) => {
  const { data: ofData, loading: ofLoading } = useQuery(ORDER_FORM, {
    ssr: false,
  })

  const { data: googleMapsKeys } = useQuery(GOOGLE_KEYS, { ssr: false })

  const [getStores, { data, loading }] = useLazyQuery(GET_STORES, {
    fetchPolicy: 'cache-first',
  })

  const [state, setState] = useState({
    allLoaded: false,
    center: null,
    zoom: zoom ?? 10,
  })

  const handles = useCssHandles(CSS_HANDLES)

  const handleLoadAll = () => {
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

  const handleCenter = (center: any) => {
    setState({
      ...state,
      center,
    })
  }

  useEffect(() => {
    if (!ofData?.orderForm) return

    let longitude: number | undefined
    let latitude: number | undefined

    if (
      ofData?.orderForm?.shippingData?.address?.postalCode &&
      ofData?.orderForm?.shippingData?.address?.postalCode?.indexOf('*') === -1
    ) {
      const [ofLongitude, ofLatitude] =
        ofData?.orderForm?.shippingData.address.geoCoordinates

      longitude = ofLongitude
      latitude = ofLatitude
    }

    if (!longitude || !latitude) {
      setState((prev) => ({
        ...prev,
        allLoaded: true,
      }))
    }

    getStores({
      variables: {
        latitude,
        longitude,
        filterByTag,
      },
    })
  }, [filterByTag, getStores, ofData])

  useEffect(() => {
    if (state.center || !data?.getStores?.items?.length) return

    const [firstResult] = data.getStores.items

    const { latitude, longitude } = firstResult.address.location

    const center = ofData?.orderForm?.shippingData?.address?.geoCoordinates ?? [
      longitude || long,
      latitude || lat,
    ]

    setState({
      ...state,
      center,
    })
  }, [data, lat, long, ofData, state])

  const stores =
    data?.getStores?.items.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) {
        return -1
      }

      if (a[sortBy] > b[sortBy]) {
        return 1
      }

      return 0
    }) ?? []

  return (
    <div
      className={`flex flex-row ${handles.container}`}
      style={{
        maxHeight: 750,
      }}
    >
      <div className={`flex-col w-30 ${handles.storesListCol}`}>
        {(loading || ofLoading) && <Spinner />}
        {!loading && !!data && stores.length > 0 && (
          <div className={`overflow-auto h-100 ${handles.storesList}`}>
            <Listing items={stores} onChangeCenter={handleCenter} />
            {!state.allLoaded && (
              <span
                className={`mt2 link c-link underline-hover pointer ${handles.loadAll}`}
                role="button"
                tabIndex={0}
                onClick={() => {
                  handleLoadAll()
                }}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter' && e.key !== ' ') return
                  e.preventDefault()
                  handleLoadAll()
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
          state.center &&
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

export default injectIntl(StoreList)
