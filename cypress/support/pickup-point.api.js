export default {
  getPickupPoints: (baseUrl) => {
    return `${baseUrl}/api/logistics/pvt/configuration/pickuppoints`
  },
  createPickupPoint: (baseUrl) => {
    return `${baseUrl}/api/logistics/pvt/configuration/pickuppoints`
  },
  updatePickupPoint: (baseUrl) => {
    return `${baseUrl}/api/logistics/pvt/configuration/pickuppoints`
  },
  getPickupPointById: (baseUrl, pickupPointid) => {
    return `${baseUrl}/api/logistics/pvt/configuration/pickuppoints/${pickupPointid}`
  },
  deletePickupPoint: (baseUrl, pickupPointid) => {
    return `${baseUrl}/api/logistics/pvt/configuration/pickuppoints/${pickupPointid}`
  },
  searchPickupPoint: (baseUrl) => {
    return `${baseUrl}/api/logistics/pvt/configuration/pickuppoints/_search`
  },
}
