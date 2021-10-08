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
  ZOOM: 14,
}

interface StoreMapProps {
  width: string
  height: string
  icon?: string
  iconWidth?: number
  iconHeight?: number
  googleMapsKeys: any
  zoom: number
}

const StoreMap: FC<StoreMapProps> = ({
  width,
  height,
  googleMapsKeys,
  icon,
  iconWidth,
  iconHeight,
  zoom,
}) => {
  const group = useStoreGroup()

  if (!group || !googleMapsKeys?.logistics?.googleMapsKey) {
    return null
  }

  return (
    <div style={{ height, width }}>
      <Map
        apiKey={googleMapsKeys.logistics.googleMapsKey}
        loadingElement={<div style={{ height: `100%` }} />}
        mapElement={<div style={{ height: `100%` }} />}
        icon={icon}
        iconWidth={iconWidth}
        iconHeight={iconHeight}
        center={group.address.geoCoordinates}
        zoom={zoom}
      />
    </div>
  )
}

StoreMap.defaultProps = {
  width: DEFAULT.WIDTH,
  height: DEFAULT.HEIGHT,
  zoom: DEFAULT.ZOOM,
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
