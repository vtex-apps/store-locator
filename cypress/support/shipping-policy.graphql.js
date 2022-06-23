import { FAIL_ON_STATUS_CODE } from './common/constants'

const config = Cypress.env()

// Constants
const { vtex } = config.base

function commonGraphlValidation(response) {
  expect(response.status).to.equal(200)
  expect(response.body.data).to.not.equal(null)
}

export function graphql(APP,getQuery, validateResponseFn = null) {
  const { query, queryVariables } = getQuery

  // Define constants
  // const APP_NAME = 'vtex.logistics-carrier-graphql'
  // const APP = `${APP_NAME}@0.x`
  const CUSTOM_URL = `${vtex.baseUrl}/_v/private/admin-graphql-ide/v0/${APP}`

  cy.request({
    method: 'POST',
    url: CUSTOM_URL,
    ...FAIL_ON_STATUS_CODE,
    body: {
      query,
      variables: queryVariables,
    },
  }).as('RESPONSE')

  if (validateResponseFn) {
    cy.get('@RESPONSE').then((response) => {
      commonGraphlValidation(response)
      validateResponseFn(response)
    })
  } else {
    return cy.get('@RESPONSE')
  }
}

export function updateShippingPolicy(data, { status = false, pickup = true }) {
  data.shippingPolicy.isActive = status
  data.shippingPolicy.deliveryChannel = pickup ? 'pickup-in-point' : 'delivery'
  const query =
    'mutation' +
    '( $shippingPolicy: ShippingPolicyInput!)' +
    '{updateShippingPolicy(shippingPolicy:$shippingPolicy){id, name}}'

  return {
    query,
    queryVariables: data,
  }
}


export function getStores(latitude,longitude) {
  const query =
    'query' +
    '( $latitude: Float, $longitude: Float )' +
    '{getStores(latitude:$latitude,longitude:$longitude){items{id name instructions isActive address{postalCode country city state location{latitude longitude}} businessHours{dayOfWeek openingTime closingTime} pickupHolidays{date hourBegin hourEnd}}}}'

  return {
    query,
    queryVariables: { latitude,longitude },
  }
}


