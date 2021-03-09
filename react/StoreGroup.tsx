/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useContext, ReactNode, useState, useEffect } from 'react'
import { useLazyQuery } from 'react-apollo'
import { useRuntime, Helmet } from 'vtex.render-runtime'

import { OptionsContext } from './contexts/OptionsContext'
import GET_STORE from './queries/getStore.gql'

const DAYS = [0, 1, 2, 3, 4, 5, 6]

const StoreGroupContext = React.createContext<SpecificationGroup | undefined>(
  undefined
)

interface StoreGroupProviderProps {
  group: SpecificationGroup
  hasPhone: boolean
}
const StoreGroupProvider: FC<StoreGroupProviderProps> = ({
  group,
  children,
  hasPhone,
}) => {
  return (
    <OptionsContext.Provider value={hasPhone}>
      <StoreGroupContext.Provider value={group}>
        {children}
      </StoreGroupContext.Provider>
    </OptionsContext.Provider>
  )
}

interface StoreGroupProps {
  children: ReactNode
  title: string
  description: string
  imageSelector: string
  phoneSelector: string
  instructionsAsPhone?: boolean
}

const getImages = (imageSelector: string) => {
  const images: string[] = []
  const elements: NodeListOf<HTMLImageElement> = document.querySelectorAll(
    imageSelector
  )

  if (elements.length) {
    for (let i = 0; i < elements.length; i++) {
      const { src } = elements[i]

      if (src) {
        images.push(src)
      }
    }
  }

  return images
}

const textParser = (text: string, group: SpecificationGroup) => {
  const {
    friendlyName,
    address: { city, state },
  } = group

  return text
    .replace(/{storeName}/gi, friendlyName)
    .replace(/{storeCity}/gi, city ?? '')
    .replace(/{storeState}/gi, state ?? '')
}

const buildDataType = (
  data: any,
  title: string,
  description: string,
  imageSelector: string,
  hasPhone: boolean
) => {
  const [longitude, latitude] = data.address.geoCoordinates
  const weekDays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]

  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    '@id': data.id,
    name: title,
    description,
    image: getImages(imageSelector),
    telephone: hasPhone ? data.instructions : '',
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${data.address.number} ${data.address.street}`,
      addressLocality: data.address.city,
      addressRegion: data.address.state,
      postalCode: data.address.postalCode,
      addressCountry: data.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude,
      longitude,
    },
    url: window.location.href,
    openingHoursSpecification: data.businessHours.map((curr: any) => {
      const [opensHour, opensMinute] = curr.openingTime.split(':')
      const [closesHour, closesMinute] = curr.closingTime.split(':')

      return {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [weekDays[curr.dayOfWeek]],
        opens: `${opensHour}:${opensMinute}`,
        closes: `${closesHour}:${closesMinute}`,
      }
    }),
  }
}

const StoreGroup: FC<StoreGroupProps> = ({
  children,
  title,
  description,
  imageSelector,
  phoneSelector,
  instructionsAsPhone,
}) => {
  const { history } = useRuntime()
  const [pickupPoint, setPickupPoint] = useState<any>(null)
  const [parsedTitle, setParsedTitle] = useState<string>('')
  const [parsedDescription, setParsedDescription] = useState<string>('')
  const [getStore, { data, called }] = useLazyQuery(GET_STORE)

  if (history && !called) {
    const id = history.location.state.navigationRoute.params.store_id

    getStore({
      variables: {
        id,
      },
    })
  }

  if (pickupPoint?.id !== data?.pickupPoint.id) {
    const businessHours = DAYS.map((day) => {
      const openHours = data.pickupPoint.businessHours.find(
        (hours) => hours.dayOfWeek === day
      )

      if (!openHours) {
        return {
          closingTime: null,
          dayOfWeek: day,
          openingTime: null,
        }
      }

      return openHours
    })

    setPickupPoint({ ...data.pickupPoint, businessHours })
  }

  useEffect(() => {
    if (!pickupPoint) {
      return
    }

    const pageTitle = title
      ? textParser(title, pickupPoint)
      : pickupPoint.friendlyName

    const pageDescription = description
      ? textParser(description, pickupPoint)
      : ''

    setParsedTitle(pageTitle)
    setParsedDescription(pageDescription)
  }, [pickupPoint, title, description])

  return (
    <>
      {pickupPoint && (
        <Helmet>
          <title>{parsedTitle}</title>
          <meta name="description" content={parsedDescription} />
          {!!imageSelector && (
            <script type="application/ld+json">
              {JSON.stringify(
                buildDataType(
                  data.pickupPoint,
                  parsedTitle,
                  parsedDescription,
                  imageSelector,
                  instructionsAsPhone ?? phoneSelector?.length > 0
                )
              )}
            </script>
          )}
        </Helmet>
      )}
      <StoreGroupProvider
        group={pickupPoint}
        hasPhone={instructionsAsPhone ?? phoneSelector.length > 0}
      >
        {children}
      </StoreGroupProvider>
    </>
  )
}

export const useStoreGroup = () => {
  const group = useContext(StoreGroupContext)

  return group
}

StoreGroup.defaultProps = {
  title: '{storeName}',
  description: '',
  imageSelector: '',
  phoneSelector: '',
  instructionsAsPhone: false,
}

export default StoreGroup
