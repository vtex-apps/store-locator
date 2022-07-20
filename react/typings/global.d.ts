interface BusinessHours {
  openingTime: string
  dayOfWeek: string
  closingTime: string
}

interface LocationType {
  longitude: number
  latitude: number
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
  geoCoordinates: [number, number]
  postalCode: string
  city: string
  reference: string
  addressName: string
  addressType: string
  location?: LocationType
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

interface StoresFilter {
  province: string
  store: string
}

interface StoreOnStoresFilter {
  name: string
  img: string
}


interface SettingsProps {
  appSettings: Settings
}

interface Settings {
  message: string
}
