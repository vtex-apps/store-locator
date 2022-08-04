/* eslint-disable vtex/prefer-early-return */
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
                ? String(canonicalBaseAddress)
                : String(ctx.vtex.host)

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
    getStores: async (_: any, param: any, ctx: Context) => {
      const {
        clients: { hub, sitemap, vbase },
        vtex: { logger },
      } = ctx

      const APP_NAME = 'store-locator'
      const SCHEMA_NAME = 'sitemap'

      const saveInVbase = async () => {
        try {
          const res: any = await sitemap.saveIndex()

          if (res?.data?.saveIndex) {
            await vbase.saveJSON(APP_NAME, SCHEMA_NAME, {
              alreadyHasSitemap: true,
            })

            return true
          }

          return false
        } catch (err) {
          logger.error({ error: err, message: 'getStores-saveInBase-error' })

          return false
        }
      }

      sitemap.hasSitemap().then((has: any) => {
        if (has === false) {
          vbase
            .getJSON(APP_NAME, SCHEMA_NAME, true)
            .then((getResponse: any) => {
              const { alreadyHasSitemap = false } = getResponse ?? {}

              !alreadyHasSitemap && saveInVbase()
            })
            .catch((err: any) =>
              logger.error({ error: err, message: 'getStores-getJSON-error' })
            )
        }
      })

      let result = await hub.getStores(param)

      if (!result?.data.length && !param.keyword) {
        result = await hub.getStores({})
      }

      const {
        data,
        data: { paging = { pages: 0 } },
      } = result ?? { data: { items: [], paging: { pages: 0 } } }

      const pickuppoints = data.items ? data : { items: data }

      const results = [] as any

      // API will return errors starting at ?page=100
      const limitPagesTo99 = paging.pages > 99 ? 99 : paging.pages

      for (let i = 2; i <= limitPagesTo99; i++) {
        results.push(hub.getStores({ ...param, page: i }))
      }

      const remainingData = await Promise.all(results)

      remainingData.forEach((newResult: any) => {
        pickuppoints.items.push(...newResult.data.items)
      })

      // include for usage statistics
      logger.info({ message: 'getStores', items: pickuppoints?.items?.length })

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
