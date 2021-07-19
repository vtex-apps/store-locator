/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from '@react-google-maps/api'
import slugify from 'slugify'
import { useRuntime } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'

const Slugify = (str: string) => {
  return slugify(str, { lower: true, remove: /[*+~.()'"!:@]/g })
}

const CSS_HANDLES = [
  'markerInfo',
  'markerInfoStoreName',
  'markerInfoAddress',
  'markerInfoLink',
] as const

// let initialLoad = false
const Pinpoints = (props: any) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: props.apiKey,
  })

  const [state, setState] = useState({
    markerState: {},
  })

  const handles = useCssHandles(CSS_HANDLES)

  const { navigate } = useRuntime()

  const handleMarkState = (id: string) => {
    const markerState = !state.markerState[id]
      ? {
          [id]: true,
        }
      : {}

    setState({
      markerState,
    })
  }

  const [lng, lat] = props.center
  const { zoom } = props

  const goTo = (item: any) => {
    const { state: _state, postalCode } = item.address

    navigate({
      page: 'store.storedetail',
      params: {
        slug: `${Slugify(`${item.name} ${_state} ${postalCode}`)}`,
        store_id: String(item.id).replace('1_', ''),
      },
    })
  }

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
      mapContainerClassName={props.className}
    >
      {props.items.map((item: any, i: number) => {
        const { latitude, longitude } = item.address.location

        return (
          <Marker
            key={`marker_${i}`}
            icon={icon}
            position={{ lat: latitude, lng: longitude }}
            onClick={() => {
              handleMarkState(item.id)
            }}
          >
            {state.markerState[item.id] && (
              // ||
              //   (Object.getOwnPropertyNames(state.markerState).length === 0 &&
              //     lat === latitude &&
              //     lng === longitude)
              <InfoWindow
                position={{ lat: latitude, lng: longitude }}
                onCloseClick={() => {
                  handleMarkState(item.id)
                }}
              >
                <div className={`t-mini ${handles.markerInfo}`}>
                  <span className={`b ${handles.markerInfoStoreName}`}>
                    {item.name}
                  </span>
                  <br />
                  <span className={handles.markerInfoAddress}>
                    {item.address.number ? `${item.address.number} ` : ''}
                    {item.address.street}
                    {item.address.city ? `, ${item.address.city}` : ''}
                    {item.address.state ? `, ${item.address.state}` : ''}
                    {item.address.postalCode
                      ? ` - ${item.address.postalCode}`
                      : ''}
                  </span>
                  <br />
                  <span
                    className={`mt2 link c-link underline-hover pointer ${handles.markerInfoLink}`}
                    onClick={(e) => {
                      e.preventDefault()
                      goTo(item)
                    }}
                  >
                    <FormattedMessage id="store/more-details" />
                  </span>
                </div>
              </InfoWindow>
            )}
          </Marker>
        )
      })}
    </GoogleMap>
  )
}

export default Pinpoints
