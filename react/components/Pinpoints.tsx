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

  const [lng, lat] = props.center || [18.2761499,-33.9524353]
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
    url:
      props.icon ??
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAANbY1E9YMgAABPBJREFUWIWtl3tMW1Ucxw+0hfEorwIDhdFSKJRnaSnl0ZZXKa9CC4wCo1RhPESWuUQTFd2cuKiJ07hItrnBmFFnXOaymZllWZwic1uMYzGZyZZgMrc/xCnExCjh1Z+/c90qwr0Tj5J8cnO59/zO9/7O9/x+pwQACB8/dzjIrLuB3G6zkfM1xeSdEgN5WZ8lcicrDIkhwYM+Pj4jhJCjxIeMKEKCdzoT4wtfM2SLjxTnkbPVZvI9jqPjaRyhOSiCD+4LuIOBvqwvJ7u06TmxQYHnxL6+SzmR4dCZkgg7MlTQhVddVASIRaLl2KCAC89q1IZxWykn/H8RMOt2kGc06kfwa+cbFHHwTaMVPD1OgMe2ePH0tMC3TVXQqkzAiGTpiQxV/8y98f9JwHzXZrI3X9OJQeGIOQ+gHyfsawXPVicsbW32sozQ/9PnH5QVAC4PvJSbOUDHMwv4wVVPzlSacnHyhaMlBoCBdm6ipQfACRlwwXFLIc2E54Sl0DSNcZgEXG2wkmxZ2LlGTDv0//PkK4HH28GtUoAqVDrxld0iZhLwqj7LJPL1hWtNlQC9reuenBPQ2wI3W2pBIvKFndq0SiYBmsjw5zNl4Vyw1V9/qb4cHkX3ywIDuCu95/OEIToSkkOlQ0wC8O+wE11NjbX6C+mkYrHYC71fkwUc15WaSAONsAoY605V8gqgX75SAL3nE7AjK4UGGmMVcLBBEc/tc9YMuFRyGugQkwBTbNRTyWFSWO52snkAvZOFHtJGRTzHJGC4SKfFgjI/XleOhmr7d7sADfh1g5UWJM/e/Gwjk4CLdWXEGBN1zBQThcvQBp5u57omX+7+M/1V8bG0R5wet5WxFaLpdjvB1Cr9RaLZodwMLuh6ihEtWq/nawBryK+f2UrT7mIcJgEzXC9opm3Ygkaa21eo5d0Rq403WpxHjbd4wKirW8BeMMPaC+hAygKKOGTSN9GGdKbKzC0H/7q3wQSakTYizEDn/UbE3oza673MdW4m29KTd8s2+MN0hwMA2+/fJkd//N7VDMqQYGhPShimon9yOchdl52DScCtVpuX22115M6WOlFKWMjl9iT5mtpAU48HFgj39/vuelNV6K3WWjLVUuOFScAkdsOV3GiupktRRpdisvGvBgV4OPkRsxKIBWm3LqNryllDruH7K2EScKG2ZA1X7BaikYV/4lRu8maBfv0redkQ4e93E7eu/2V8hx7hVsJcB1Zz1VFB3izIqcCtCbgknBcWcd8rpEHQp1Y+OdloJV/ge6thEnDaalzDx8gpq1Ei9ZNM4XJwp59Ldgvd83OnrEUJVxzl5GJ92RqYBBwvL+AFj2mk9KHot2ilg+1uPHCkg1waNEGX6GyVmRcmAaNmPS/vlRrI9gxVdVTABlhEDxRsjAS7/OHBkxVF+CyfFyYBh016XkbNeeSN/JzYQIn4t89tpbARO+KgJs34Pk40hj9K+GAS8KIug5ehe2BRuvG0Rg14/WVfgVZGhQmJZhLwgjZdkD25mSQxRPqpPloGm4KDrr+Np/eDRh05IACTgF61UhAsywQPmx8GSSSQFCo9jz9CCJpRECYBPalKQQbSkkmWLGw/rYrykOCPXMly0qLcJAiTgP2YOiGosezyuF1UQEVczPAxNKDQrqEwCaCuFuKkpYj0qZPcVECHSr7tREUheRe3pxAPEvAHoSjT1B9h9DoAAAAASUVORK5CYII=',
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
