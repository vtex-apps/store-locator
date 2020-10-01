/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from 'react'
import { injectIntl } from 'react-intl'
import { graphql, compose } from 'react-apollo'

import { useStoreGroup } from './StoreGroup'
import Map from './components/Map'
import GOOGLE_KEYS from './queries/GetGoogleMapsKey.graphql'

const DEFAULT = {
  WIDTH: '100%',
  HEIGHT: '200px',
}

interface StoreMapProps {
  width: string
  height: string
  googleMapsKeys: any
}

const StoreMap: FC<StoreMapProps> = ({ width, height, googleMapsKeys }) => {
  const group = useStoreGroup()

  if (!group || !googleMapsKeys?.logistics?.googleMapsKey) {
    return null
  }

  return (
    <Map
      googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${googleMapsKeys.logistics.googleMapsKey}&v=3.exp&libraries=geometry,drawing,places`}
      loadingElement={<div style={{ height: `100%` }} />}
      containerElement={<div style={{ height, width }} />}
      mapElement={<div style={{ height: `100%` }} />}
      center={group.address.geoCoordinates}
    />
  )
}

StoreMap.defaultProps = {
  width: DEFAULT.WIDTH,
  height: DEFAULT.HEIGHT,
}

export default injectIntl(
  compose(
    graphql(GOOGLE_KEYS, {
      name: 'googleMapsKeys',
      options: {
        ssr: false,
      },
    })
  )(StoreMap)
)
