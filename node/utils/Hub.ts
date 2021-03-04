/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExternalClient, InstanceOptions, IOContext, Logger } from '@vtex/api'

const BASE_PATH =
  'http://logistics.vtexcommercestable.com.br/api/logistics/pvt/configuration/pickuppoints/'

const routes = {
  getAll: ({ keyword, latitude, longitude }: any, account: string) => {
    let path = `_search?an=${account}&pageSize=100`

    if (keyword) {
      path = `_search?an=${account}&keyword=${keyword}&pageSize=100`
    } else if (latitude && longitude) {
      path = `_searchsellers?an=${account}&lat=${Number(latitude).toFixed(
        2
      )}&lon=${Number(longitude).toFixed(2)}&maxDistance=200`
    }

    return `${BASE_PATH + path}`
  },
}

export default class RequestHub extends ExternalClient {
  public logger: Logger
  constructor(context: IOContext, options?: InstanceOptions) {
    super('', context, {
      ...options,
      headers: {
        Accept: 'application/json',
        'Proxy-Authorization': context.authToken,
        Authorization: context.authToken,
        VtexIdclientAutCookie: context.authToken,
      },
    })
    this.logger = new Logger(context)
  }

  public getStores(data: any) {
    return this.http
      .getRaw(routes.getAll(data, this.context.account))
      .catch((e) => {
        this.logger.error(e)
      })
  }
}
