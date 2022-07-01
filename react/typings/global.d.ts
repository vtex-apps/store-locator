interface BusinessHours {
  openingTime: string
  dayOfWeek: string
  closingTime: string
}
interface HolidayHours {
  date: string
  hourBegin: string
  hourEnd: string
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
}
interface SpecificationGroup {
  businessHours: [BusinessHours]
  pickupHolidays: [HolidayHours]
  isActive: boolean
  distance: number
  friendlyName: string
  id: string
  instructions: string
  seller: string
  address: Address
}
