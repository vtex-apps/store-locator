/* eslint-disable no-console */
import React, { useState } from 'react'
import {
  GoogleMap,
  Marker,
  withGoogleMap,
  withScriptjs,
  InfoWindow,
} from 'react-google-maps'

const Pinpoints = withScriptjs(
  withGoogleMap((props: any) => {
    const [state, setState] = useState({
      markerState: {},
    })

    console.log('Props =>', props)
    const [firstLocation] = props.items
    const {
      latitude: defaultLat,
      longitude: defaultLng,
    } = firstLocation.address.location

    const [lng, lat] = props.location?.geoCoordinates || [
      defaultLng,
      defaultLat,
    ]

    const handleMarkState = (id: string) => {
      setState({
        markerState: {
          ...state.markerState,
          [id]:
            typeof state.markerState[id] === 'undefined'
              ? true
              : !state.markerState[id],
        },
      })
    }

    console.log('State =>', state)

    return (
      <GoogleMap defaultZoom={12} defaultCenter={{ lat, lng }}>
        {props.items.map((item: any, i: number) => {
          const { latitude, longitude } = item.address.location

          return (
            <Marker
              key={`marker_${i}`}
              position={{ lat: latitude, lng: longitude }}
              onClick={() => {
                handleMarkState(item.id)
              }}
            >
              {state.markerState[item.id] && (
                <InfoWindow
                  onCloseClick={() => {
                    handleMarkState(item.id)
                  }}
                >
                  <div>
                    <span>{item.name}</span>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          )
        })}
      </GoogleMap>
    )
  })
)

export default Pinpoints
