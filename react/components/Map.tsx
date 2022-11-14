/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'

const Map = (props: any) => {
  const { zoom } = props
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: props.apiKey,
  })

  const [lng, lat] = props.center
  let icon: any = {
    url: props.icon ?? null,
  }

  if (props.iconWidth && props.iconHeight) {
    icon = {
      ...icon,
      scaledSize: {
        width: props.iconWidth,
        height: props.iconHeight,
      },
    }
  }

  if (!isLoaded) return null

  return (
    <GoogleMap
      zoom={zoom}
      center={{ lat, lng }}
      mapContainerStyle={{ height: '100%' }}
    >
      <Marker icon={icon} position={{ lat, lng }} />
    </GoogleMap>
  )
}

export default Map
