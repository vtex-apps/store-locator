/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useContext, ReactNode } from 'react'
import { useLazyQuery } from 'react-apollo'
import { Helmet } from 'react-helmet'
import { useRuntime } from 'vtex.render-runtime'

import GET_STORE from './queries/getStore.gql'

interface BusinessHours {
  openingTime: string
  dayOfWeek: string
  closingTime: string
}
interface Address {
  addressId: string
  cacheId: string
  id: string
  userId: string
  receiverName: string
  complement: string
  neighborhood: string
  country: string
  state: string
  number: string
  street: string
  geoCoordinates: [number]
  postalCode: string
  city: string
  reference: string
  addressName: string
  addressType: string
}
interface SpecificationGroup {
  businessHours: [BusinessHours]
  isActive: boolean
  distance: number
  friendlyName: string
  id: string
  instructions: string
  seller: string
  address: Address
}

const StoreGroupContext = React.createContext<SpecificationGroup | undefined>(
  undefined
)

interface StoreGroupProviderProps {
  group: SpecificationGroup
  title: string
}
const StoreGroupProvider: FC<StoreGroupProviderProps> = ({
  group,
  children,
}) => {
  return (
    <StoreGroupContext.Provider value={group}>
      {children}
    </StoreGroupContext.Provider>
  )
}

interface StoreGroupProps {
  children: ReactNode
  title: string
  imageSelector: string
  phoneSelector: string
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

const getPhone = (phoneSelector: string) => {
  if (!phoneSelector) {
    return ''
  }

  const phones: string[] = []
  const elements: NodeListOf<HTMLElement> = document.querySelectorAll(
    phoneSelector
  )

  if (elements.length) {
    for (let i = 0; i < elements.length; i++) {
      const { innerText } = elements[i]

      if (innerText) {
        phones.push(innerText.replace(/[^\d+]/gi, ''))
      }
    }
  }

  return phones.length ? phones[0] : phones
}

const buildDataType = (
  data: any,
  title: string,
  imageSelector: string,
  phoneSelector: string
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
    name: title ?? data.friendlyName,
    image: getImages(imageSelector),
    telephone: getPhone(phoneSelector),
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

const titleParser = (title: string, storeName: string) => {
  return title.replace(/{storeName}/gi, storeName)
}

const StoreGroup: FC<StoreGroupProps> = ({
  children,
  title,
  imageSelector,
  phoneSelector,
}) => {
  const { history } = useRuntime()
  const [getStore, { data, called }] = useLazyQuery(GET_STORE)

  if (history && !called) {
    const id = history.location.state.navigationRoute.params.store_id

    getStore({
      variables: {
        id,
      },
    })
  }

  return (
    <>
      {data?.pickupPoint && (
        <Helmet>
          <title>{`${titleParser(
            title,
            data.pickupPoint.friendlyName
          )}`}</title>
          {!!imageSelector && (
            <script type="application/ld+json">
              {JSON.stringify(
                buildDataType(
                  data.pickupPoint,
                  titleParser(title, data.pickupPoint.friendlyName),
                  imageSelector,
                  phoneSelector
                )
              )}
            </script>
          )}
        </Helmet>
      )}
      <StoreGroupProvider group={data?.pickupPoint} title={title}>
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
  imageSelector: '',
  phoneSelector: '',
}

export default StoreGroup
