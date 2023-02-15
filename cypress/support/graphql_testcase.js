export function updateShippingPolicy(data, { status = false, pickup = true }) {
  data.shippingPolicy.isActive = status
  data.shippingPolicy.deliveryChannel = pickup ? 'pickup-in-point' : 'delivery'
  cy.qe("Update shipping Policy via graphql.The graphQl mutation we use in UI,mutation{( $shippingPolicy: ShippingPolicyInput!){updateShippingPolicy(shippingPolicy:$shippingPolicy){id, name}}}")
  const query =
    'mutation' +
    '( $shippingPolicy: ShippingPolicyInput!)' +
    '{updateShippingPolicy(shippingPolicy:$shippingPolicy){id, name}}'

  return {
    query,
    queryVariables: data,
  }
}

export function getStores(latitude, longitude) {
  const query =
    'query' +
    '( $latitude: Float, $longitude: Float )' +
    '{getStores(latitude:$latitude,longitude:$longitude){items{id name instructions isActive address{postalCode country city state location{latitude longitude}} businessHours{dayOfWeek openingTime closingTime} pickupHolidays{date hourBegin hourEnd}}}}'

  return {
    query,
    queryVariables: { latitude, longitude },
  }
}
