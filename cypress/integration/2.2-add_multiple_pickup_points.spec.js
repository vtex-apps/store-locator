import { testSetup, updateRetry } from '../support/common/support'
import { addPickUpPoint } from '../support/storelocator.common'
import { pickupTestCase } from '../support/store-locator.outputvalidation.js'

const prefix = 'Verify Upload XLS File'

describe('Adding Multiple pickup point', () => {
  // Load test setup
  testSetup()

  // If we upload this file cypress/fixtures/pickups.xls then it will create two pickup points
  // pickup example 1 & pickup example 2

  it(`${prefix} - Visit admin endpoint and upload file`, updateRetry(2), () => {
    cy.uploadXLS()
  })

  it('Adding PickUp Point', updateRetry(2), () => {
    addPickUpPoint(pickupTestCase.pickupPointName)
  })
})
