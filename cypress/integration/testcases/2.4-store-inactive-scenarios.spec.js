import {
  preserveCookie,
  testSetup,
  updateRetry,
} from '../../support/common/support'
import { updatePickupPointdata } from '../../support/store-locator.apis'
import { testCase1 } from '../../support/store-locator.outputvalidation.js'
import storelocatorSelectors from '../../support/storelocator.selectors'

const { data2 } = testCase1

describe('Inactive Pickup Points should not be visible in storefront', () => {
  testSetup(false)
  updatePickupPointdata(data2)

  it(
    'Verify the inactive pickup point is not visible in stores page',
    updateRetry(3),
    () => {
      cy.visit('/stores')
      cy.get(storelocatorSelectors.StorePickUpPointList).should('be.visible')
      cy.get(storelocatorSelectors.StorePickUpPointList).should(
        'not.contain',
        `${data2.name}`
      )
    }
  )
  preserveCookie()
})
