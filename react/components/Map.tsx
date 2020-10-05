/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import {
  GoogleMap,
  Marker,
  withGoogleMap,
  withScriptjs,
} from 'react-google-maps'

const Map = withScriptjs(
  withGoogleMap((props: any) => {
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

    return (
      <GoogleMap defaultZoom={14} center={{ lat, lng }}>
        <Marker icon={icon} position={{ lat, lng }} />
      </GoogleMap>
    )
  })
)

export default Map
