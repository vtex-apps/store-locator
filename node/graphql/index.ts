/* eslint-disable @typescript-eslint/no-explicit-any */
import { method } from '@vtex/api'
import slugify from 'slugify'

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
              {
                keyword: null,
                latitude: null,
                longitude: null,
              },
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

      const { data } = result

      const pickuppoints = data.items ? data : { items: data }

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
