import {
  preserveCookie,
  testSetup,
  updateRetry,
} from '../../support/common/support'
import {
  addPickupPoint,
  updatePickupPointdata,
} from '../../support/store-locator.apis'
import { testCase1 } from '../../support/store-locator.outputvalidation.js'
import storelocatorSelectors from '../../support/storelocator.selectors'

const { data2 } = testCase1

describe('Pickup point status as inacctive and verify', () => {
  testSetup(false)
  updatePickupPointdata(data2)
  addPickupPoint()

  it('verify the pickup point is added in stores page', updateRetry(3), () => {
    cy.visit('/stores')
    cy.get(storelocatorSelectors.StorePickUpPointList)
      .should('be.visible')
      .contains('sumanraj+sumanraj4048')
  })

  it(
    'verify the inactive pickup point is not visible in stores page',
    updateRetry(3),
    () => {
      cy.get(storelocatorSelectors.StorePickUpPointList).should('be.visible')
      cy.get(storelocatorSelectors.StorePickUpPointList).should(
        'not.contain',
        `${data2.name}`
      )
    }
  )
  preserveCookie()
})
