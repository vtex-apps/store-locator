import { Segment } from '@vtex/api'

const getCountry = async (segment: Segment) => {
  const segmentData: any = await segment.getSegment()

  return {
    countryCode: segmentData?.countryCode,
  }
}

export const resolvers = {
  Query: {
    getStores: async (_: any, param: any, ctx: any) => {
      const {
        clients: { hub, segment },
      } = ctx

      const { countryCode } = await getCountry(segment)

      const { postalCode, pageNumber, pageSize } = param

      const { data } = await hub[postalCode ? 'getByLocation' : 'getAllStores'](
        {
          postalCode,
          countryCode,
          pageNumber,
          pageSize,
        }
      )

      const ret = data
        ? {
            items: data.items.map((item: any) => {
              return {
                id: item.pickupPoint?.id || item.id,
                name: item.pickupPoint?.friendlyName || item.name,
                instructions:
                  item.pickupPoint?.additionalInfo || item.instructions,
                distance: item.distance,
                isActive:
                  typeof item.isActive === 'boolean' ? item.isActive : true,
                address: {
                  postalCode:
                    item.pickupPoint?.address.postalCode ||
                    item.address?.postalCode,
                  country:
                    item.pickupPoint?.address.country ||
                    item.address?.country.acronym,
                  city: item.pickupPoint?.address.city || item.address?.city,
                  state: item.pickupPoint?.address.state || item.address?.state,
                  neighborhood:
                    item.pickupPoint?.address.neighborhood ||
                    item.address?.neighborhood,
                  street:
                    item.pickupPoint?.address.street || item.address?.street,
                  complement:
                    item.pickupPoint?.address.complement ||
                    item.address?.complement,
                  reference:
                    item.pickupPoint?.address.reference ||
                    item.address?.reference,
                  location: item.pickupPoint
                    ? {
                        latitude: item.pickupPoint.address.geoCoordinates[1],
                        longitude: item.pickupPoint.address.geoCoordinates[0],
                      }
                    : item.address.location,
                },
                businessHours:
                  item.pickupPoint?.businessHours.map((hour: any) => {
                    return {
                      dayOfWeek: hour.dayOfWeek || hour.DayOfWeek,
                      openingTime: hour.openingTime || hour.OpeningTime,
                      closingTime: hour.closingTime || hour.ClosingTime,
                    }
                  }) || item.businessHours,
                pickupHolidays: item.pickupHolidays || [],
              }
            }),
            paging: data.paging,
          }
        : []

      return ret
    },
  },
}
