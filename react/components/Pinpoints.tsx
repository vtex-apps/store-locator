/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import {
  GoogleMap,
  Marker,
  withGoogleMap,
  withScriptjs,
  InfoWindow,
} from 'react-google-maps'
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

const Pinpoints = withScriptjs(
  withGoogleMap((props: any) => {
    const [state, setState] = useState({
      markerState: {},
    })

    const handles = useCssHandles(CSS_HANDLES)

    const { navigate } = useRuntime()

    const handleMarkState = (id: string) => {
      setState({
        markerState: {
          [id]: !state.markerState[id],
        },
      })
    }

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

    const [lng, lat] = props.center

    return (
      <GoogleMap defaultZoom={10} center={{ lat, lng }}>
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
                  <div className={`t-mini ${handles.markerInfo}`}>
                    <span className={`b ${handles.markerInfoStoreName}`}>
                      {item.name}
                    </span>
                    <br />
                    <span className={handles.markerInfoAddress}>
                      {item.address.number || ''} {item.address.street}
                      {item.address.city ? `, ${item.address.city}` : ''}
                      {item.address.state ? `, ${item.address.state}` : ''}
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
  })
)

export default Pinpoints
