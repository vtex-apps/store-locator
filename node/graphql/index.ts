/* eslint-disable @typescript-eslint/no-explicit-any */
import { Segment, method } from '@vtex/api'
import slugify from 'slugify'

const getCountry = async (segment: Segment) => {
  const segmentData: any = await segment.getSegment()

  return {
    countryCode: segmentData?.countryCode,
  }
}

const Slugify = (str: string) => {
  return slugify(str, { lower: true, remove: /[*+~.()'"!:@]/g })
}

export const resolvers = {
  Routes: {
    getSitemap: [
      method({
        GET: async (ctx: any) => {
          try {
            const stores: any = await resolvers.Query.getStores(
              null,
              { postalCode: null, pageNumber: 1, pageSize: 99 },
              ctx
            )

            ctx.set('Content-Type', 'text/xml')

            const lastMod = new Date().toISOString()
            const storesMap = `
              <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
                ${stores?.items
                  .filter((item: any) => {
                    return !!item.isActive
                  })
                  .map((item: any) => {
                    return `<url>
                  <loc>https://${ctx.vtex.host}/store/${Slugify(
                      `${item.name} ${item.address.state} ${item.address.postalCode}`
                    )}/${String(item.id).replace('1_', '')}</loc>
                  <lastmod>${lastMod}</lastmod>
                  <changefreq>daily</changefreq>
                  <priority>0.8</priority>
               </url>`
                  })
                  .join('')}
              </urlset>`

            ctx.body = storesMap
            ctx.status = 200
          } catch (e) {
            ctx.body = e
            ctx.status = 500
          }
        },
      }),
    ],
  },
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
                  number:
                    item.pickupPoint?.address.number || item.address?.number,
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
