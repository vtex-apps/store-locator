import { FAIL_ON_STATUS_CODE } from './common/constants'

const config = Cypress.env()

// Constants
const { vtex } = config.base

function commonGraphlValidation(response) {
  expect(response.status).to.equal(200)
  expect(response.body.data).to.not.equal(null)
}

export function graphql(getQuery, validateResponseFn = null) {
  const { query, queryVariables } = getQuery

  // Define constants
  const APP_NAME = 'vtex.store-locator'
  const APP = `${APP_NAME}@0.x`
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

export function getStores() {
  const query =
    'query' +
    '( $latitude: Float, $longitude: Float )' +
    '{getStores(latitude:$latitude,longitude:$longitude){items{id name instructions isActive address{postalCode country city state location{latitude longitude}} businessHours{dayOfWeek openingTime closingTime} pickupHolidays{date hourBegin hourEnd}}}}'

  return {
    query,
    queryVariables: { latitude: -22.94, longitude: -43.18 },
  }
}

export function validateGetStoresresponse(response) {
  expect(response.body.data).to.not.equal(null)
}
