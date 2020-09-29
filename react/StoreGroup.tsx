import React, { FC, useContext, ReactNode } from 'react'
import { useLazyQuery } from 'react-apollo'
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
}
const StoreGroup: FC<StoreGroupProps> = ({ children }) => {
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
      <StoreGroupProvider group={data?.pickupPoint}>
        {children}
      </StoreGroupProvider>
    </>
  )
}

export const useStoreGroup = () => {
  const group = useContext(StoreGroupContext)

  return group
}

export default StoreGroup
