import { testSetup, updateRetry } from '../support/common/support'
import {
  listallPickupPointsAPI,
  INTIAL_PICKUP_POINTS_ENV,
  updatePickupPointdata,
} from '../support/api_testcase'
import { restAPITestCase } from '../support/outputvalidation.js'
import storelocatorSelectors from '../support/selectors.js'
import { clickLoadAllStores } from '../support/common.js'

const { pickupPoint3Payload } = restAPITestCase

describe('Inactive Pickup Points should not be visible in storefront', () => {
  testSetup()

  listallPickupPointsAPI()

  updatePickupPointdata(pickupPoint3Payload)

  it(
    `Verify the inactive pickup point "${pickupPoint3Payload.name}" is not visible in stores page`,
    updateRetry(3),
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
})
