import { testSetup, updateRetry } from '../support/common/support'
import { verifyAllPickUpPoint } from '../support/common.js'
import { listallPickupPointsAPI } from '../support/api_testcase.js'

describe('Verify all pickup points is displayed', () => {
  // Load test setup
  testSetup()

  listallPickupPointsAPI()
  it('Verify all pickup points is shown in stores', updateRetry(2), () => {
    cy.addDelayBetweenRetries(10000)
    verifyAllPickUpPoint()
  })
})
