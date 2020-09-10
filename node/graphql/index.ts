import { Segment } from '@vtex/api'

const getCountry = async (segment: Segment) => {
  const segmentData: any = await segment.getSegment()

  return {
    countryCode: segmentData?.countryCode,
  }
}

export const resolvers = {
  Query: {
    getAllStores: async (_: any, param: any, ctx: any) => {
      const {
        clients: { hub },
      } = ctx

      const { data } = await hub.getAllStores(param.pageNumber, param.pageSize)

      return data ?? []
    },
    getStoresByLocation: async (_: any, param: any, ctx: any) => {
      const {
        clients: { hub, segment },
      } = ctx

      const { countryCode } = await getCountry(segment)

      const { postalCode, pageNumber, pageSize } = param
      const { data } = await hub.getByLocation({
        postalCode,
        countryCode,
        pageNumber,
        pageSize,
      })

      return data ?? []
    },
  },
}
