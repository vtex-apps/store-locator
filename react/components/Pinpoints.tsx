/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-console */
import React, { useState } from 'react'
import {
  GoogleMap,
  Marker,
  withGoogleMap,
  withScriptjs,
  InfoWindow,
} from 'react-google-maps'
import slugify from 'slugify'
import { useRuntime } from 'vtex.render-runtime'

const Pinpoints = withScriptjs(
  withGoogleMap((props: any) => {
    const [state, setState] = useState({
      markerState: {},
    })

    const { navigate } = useRuntime()

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

    const Slugify = (str: string) => {
      return slugify(str, { lower: true, remove: /[*+~.()'"!:@]/g })
    }

    const goTo = (item: any) => {
      console.log('goTo =>', item)
      navigate({
        page: 'store.storedetail',
        params: {
          slug: Slugify(`${item.name} ${item.id}`),
        },
      })
    }

    console.log('State =>', state)
    const [lng, lat] = props.center

    return (
      <GoogleMap defaultZoom={12} center={{ lat, lng }}>
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
              {state.markerState[item.id] ||
                (lat === latitude && lng === longitude && (
                  <InfoWindow
                    onCloseClick={() => {
                      handleMarkState(item.id)
                    }}
                  >
                    <div className="t-mini">
                      <span className="b">{item.name}</span> <br />
                      <span>
                        {item.address.number || ''}
                        {item.address.street}
                        {item.address.city ? `, ${item.address.city}` : ''}
                        {item.address.state ? `, ${item.address.state}` : ''}
                      </span>
                      <br />
                      <span
                        className="t-mini link c-link underline-hover pointer"
                        onClick={() => {
                          goTo(item)
                        }}
                      >
                        More details
                      </span>
                    </div>
                  </InfoWindow>
                ))}
            </Marker>
          )
        })}
      </GoogleMap>
    )
  })
)

export default Pinpoints
