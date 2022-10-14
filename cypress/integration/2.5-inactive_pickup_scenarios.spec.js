import { testSetup, updateRetry } from '../support/common/support'
import {
  updatePickupPointdata,
  listallPickupPointsAPI,
  INTIAL_PICKUP_POINTS_ENV,
} from '../support/api_testcase'
import { restAPITestCase } from '../support/outputvalidation.js'
import storelocatorSelectors from '../support/selectors.js'
import { graphql, getStores } from '../support/graphql_testcase'
import { storeLocator } from '../support/app_list'
import { clickLoadAllStores } from '../support/common.js'

const { pickupPoint3Payload } = restAPITestCase

describe('Inactive Pickup Points should not be visible in storefront', () => {
  testSetup()

  listallPickupPointsAPI()
  updatePickupPointdata(pickupPoint3Payload)

  it(
    `Verify the inactive pickup point "${pickupPoint3Payload.name}" is not visible in stores page`,
    updateRetry(1),
    () => {
      cy.getPickupPointItem().then((pickupCount) => {
        cy.visitStore()
        cy.get(storelocatorSelectors.StorePickUpPointList, {
          timeout: 8000,
        }).should('be.visible')
        clickLoadAllStores()
        cy.get(storelocatorSelectors.MoreItems, { timeout: 8000 }).should(
          'have.length',
          pickupCount[INTIAL_PICKUP_POINTS_ENV] + 3
        )
        cy.get(storelocatorSelectors.StorePickUpPointList, {
          timeout: 8000,
        }).should('not.contain', `${pickupPoint3Payload.name}`)
      })
    }
  )

  it('verify getStores with latitude and longitude', updateRetry(5), () => {
    graphql(storeLocator, getStores(-22.94, -43.18), (response) => {
      cy.addDelayBetweenRetries(4000)
      expect(response.status).to.equal(200)
      expect(response.body.data.getStores.items.length).to.equal(2)
    })
  })

  it('verify getStores without latitude and longitude', updateRetry(5), () => {
    graphql(storeLocator, getStores(), (response) => {
      cy.addDelayBetweenRetries(4000)
      expect(response.status).to.equal(200)
      expect(response.body.data.getStores.items.length).to.not.equal(0)
    })
  })
})
