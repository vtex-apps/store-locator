/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExternalClient, InstanceOptions, IOContext } from '@vtex/api'

const routes = {
  getAll: ({ pageNumber, pageSize, keyword }: any, account: string) =>
    `http://logistics.vtexcommercestable.com.br/api/logistics/pvt/configuration/pickuppoints/_search?an=${account}&page=${
      pageNumber ?? 1
    }&pageSize=${pageSize ?? 50}&keyword=${keyword ?? ''}`,
  getByLocation: (
    { postalCode, countryCode, pageNumber, pageSize }: any,
    account: string
  ) =>
    `http://${account}.vtexcommercestable.com.br/api/checkout/pub/pickup-points?countryCode=${countryCode}&postalCode=${postalCode}&page=${
      pageNumber ?? 1
    }&pageSize=${pageSize ?? 50}`,
}

export default class RequestHub extends ExternalClient {
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
  }

  public getAllStores(data: any) {
    return this.http.getRaw(routes.getAll(data, this.context.account))
  }

  public getByLocation(data: any) {
    return this.http.getRaw(routes.getByLocation(data, this.context.account))
  }
}
