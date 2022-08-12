import { testSetup, updateRetry } from '../support/common/support'
import { addPickUpPoint } from '../support/common.js'
import { pickupTestCase } from '../support/outputvalidation.js'

describe('Adding Multiple pickup point', () => {
  // Load test setup
  testSetup()

  it('Adding PickUp Point', updateRetry(1), () => {
    addPickUpPoint(pickupTestCase.pickupPointName)
  })
})
