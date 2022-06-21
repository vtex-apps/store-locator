import { testSetup, updateRetry } from '../support/common/support'
import { updatePickupPointdata } from '../support/store-locator.apis'
import { testCase1 } from '../support/store-locator.outputvalidation.js'
import storelocatorSelectors from '../support/storelocator.selectors'

const { data3 } = testCase1

describe('Inactive Pickup Points should not be visible in storefront', () => {
  testSetup()
  updatePickupPointdata(data3)

  it(
    `Verify the inactive pickup point ${data3.name} is not visible in stores page`,
    updateRetry(1),
    () => {
      cy.visitStore()
      cy.get(storelocatorSelectors.StorePickUpPointList).should('be.visible')
      cy.get(storelocatorSelectors.LoadStores).should('be.visible').click()
      cy.get(storelocatorSelectors.MoreItems, { timeout: 8000 }).should(
        'have.length',
        5
      )
      cy.get(storelocatorSelectors.StorePickUpPointList, {
        timeout: 8000,
      }).should('not.contain', `${data3.name}`)
    }
  )
})
