/* eslint-disable no-console */
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

      return data
        ? {
            items: data.items.map((item: any) => {
              return {
                id: item.id || item.pickupPoint.id,
                name: item.name || item.pickupPoint.friendlyName,
                instructions:
                  item.instructions || item.pickupPoint.additionalInfo,
                distance: item.distance,
                isActive:
                  typeof item.isActive === 'boolean' ? item.isActive : true,
                address: {
                  postalCode:
                    item.address?.postalCode ||
                    item.pickupPoint.address.postalCode,
                  country:
                    item.address?.country.acronym ||
                    item.pickupPoint.address.country,
                  city: item.address?.city || item.pickupPoint.address.city,
                  state: item.address?.state || item.pickupPoint.address.state,
                  neighborhood:
                    item.address?.neighborhood ||
                    item.pickupPoint.address.neighborhood,
                  street:
                    item.address?.street || item.pickupPoint.address.street,
                  complement:
                    item.address?.complement ||
                    item.pickupPoint.address.complement,
                  reference:
                    item.address?.reference ??
                    item.pickupPoint.address.reference,
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
    },
  },
}
