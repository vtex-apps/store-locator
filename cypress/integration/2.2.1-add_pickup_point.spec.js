import { testSetup, updateRetry } from '../support/common/support'
import { addPickUpPoint } from '../support/common.js'
import {
  pickupTestCase,
  pickupPoint3Payload,
} from '../support/outputvalidation.js'
import { updatePickupPointdata } from '../support/api_testcase'

describe('Adding Multiple pickup point', () => {
  // Load test setup
  testSetup()

  it('Adding PickUp Point', updateRetry(1), () => {
    addPickUpPoint(pickupTestCase.pickupPointName)
  })

  // Update pickup point as inactive to test 2.5 tests
  updatePickupPointdata(pickupPoint3Payload)
})
