export default {
  getPickupPointsAPI: baseUrl => {
    return `${baseUrl}/api/logistics/pvt/configuration/pickuppoints`
  },
  createAPI: baseUrl => {
    return `${baseUrl}/api/logistics/pvt/configuration/pickuppoints`
  },
  updateAPI: (baseUrl) => {
    return `${baseUrl}/api/logistics/pvt/configuration/pickuppoints`
  },
  getPickupPointByIdAPI: (baseUrl,pickupPointid) => {
    return `${baseUrl}/api/logistics/pvt/configuration/pickuppoints/${pickupPointid}`
  },
  deletePickupPointAPI: (baseUrl, pickupPointid) => {
    return `${baseUrl}/api/logistics/pvt/configuration/pickuppoints/${pickupPointid}`
  },
  listedPickupPointsPageAPI:(baseUrl) =>{
    return `${baseUrl}/api/logistics/pvt/configuration/pickuppoints/_search`
  }
}
