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
import { Button } from 'vtex.styleguide'
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
          ...state.markerState,
          [id]:
            typeof state.markerState[id] === 'undefined'
              ? true
              : !state.markerState[id],
        },
      })
    }

    const goTo = (item: any) => {
      navigate({
        page: 'store.storedetail',
        params: {
          slug: Slugify(`${item.name} ${item.id}`),
        },
      })
    }

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
                    <div className={handles.markerInfo}>
                      <span className={handles.markerInfoStoreName}>
                        {item.name}
                      </span>
                      <span className={handles.markerInfoAddress}>
                        {item.address.number || ''} {item.address.street}
                        {item.address.city ? `, ${item.address.city}` : ''}
                        {item.address.state ? `, ${item.address.state}` : ''}
                      </span>
                      <Button
                        className={handles.markerInfoLink}
                        onClick={() => {
                          goTo(item)
                        }}
                      >
                        <FormattedMessage id="store/more-details" />
                      </Button>
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
