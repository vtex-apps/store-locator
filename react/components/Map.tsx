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

    return (
      <GoogleMap defaultZoom={14} center={{ lat, lng }}>
        <Marker position={{ lat, lng }} />
      </GoogleMap>
    )
  })
)

export default Map
