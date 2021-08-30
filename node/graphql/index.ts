/* eslint-disable @typescript-eslint/no-explicit-any */
import { method } from '@vtex/api'
import slugify from 'slugify'

import { getStoreBindings } from '../utils/Binding'

const Slugify = (str: string) => {
  return slugify(str, { lower: true, remove: /[*+~.()'"!:@]/g })
}

export const resolvers = {
  Routes: {
    getSitemap: [
      method({
        GET: async (ctx: Context) => {
          const {
            clients: { tenant },
          } = ctx

          try {
            const stores: any = await resolvers.Query.getStores(
              null,
              {
                keyword: null,
                latitude: null,
                longitude: null,
              },
              ctx
            )

            const [storeBindings] = await getStoreBindings(tenant)

            const { canonicalBaseAddress } = storeBindings
            const baseUrl =
              canonicalBaseAddress.indexOf('myvtex') === -1
                ? canonicalBaseAddress
                : ctx.vtex.host

            const stripTrailingSlash = (str: string) => {
              return str.endsWith('/') ? str.slice(0, -1) : str
            }

            const lastMod = new Date().toISOString()
            const storesMap = `
              <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
                ${stores?.items
                  .filter((item: any) => {
                    return !!item.isActive
                  })
                  .map((item: any) => {
                    return `<url>
                  <loc>https://${stripTrailingSlash(baseUrl)}/store/${Slugify(
                      `${item.name} ${item.address.state} ${item.address.postalCode}`
                    )}/${String(item.id).replace('1_', '')}</loc>
                  <lastmod>${lastMod}</lastmod>
                  <changefreq>daily</changefreq>
                  <priority>0.8</priority>
               </url>`
                  })
                  .join('')}
              </urlset>`

            ctx.set('Content-Type', 'text/xml')
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
        clients: { hub, sitemap },
        vtex: { logger },
      } = ctx

      try {
        sitemap.hasSitemap().then((has: any) => {
          if (has === false) {
            sitemap.saveIndex()
          }
        })
      } catch (err) {
        logger.log(err)
      }

      let result = await hub.getStores(param)

      if (!result?.data.length && !param.keyword) {
        result = await hub.getStores({})
      }

      const {
        data,
        data: { paging },
      } = result

      const pickuppoints = data.items ? data : { items: data }

      if (paging?.pages > 1) {
        let i = 2
        const results = [] as any

        while (i <= paging.pages) {
          results.push(hub.getStores({ ...param, page: i }))
          i++
        }

        const remainingData = await Promise.all(results)

        remainingData.forEach((newResult: any) => {
          pickuppoints.items.push(...newResult.data.items)
        })
      }

      return {
        items: pickuppoints.items
          .map((item: any) => {
            return {
              ...item,
              address: {
                ...item.address,
                country: item.address.acronym,
              },
            }
          })
          .filter((item: any) => {
            return !!item.isActive
          }),
      }
    },
  },
}
