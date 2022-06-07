import {
  testSetup,
  updateRetry,
  preserveCookie,
} from '../../support/common/support'
import {
  addPickUpPoint,
  verifyPickUpPoint,
  verifyAllPickUpPoint,
} from '../../support/storelocator.common'

describe('Testing PickUpPoint in storeLocator', () => {
  // Load test setup
  testSetup(true)

  it('Adding PickUp Point in Store-Locator', updateRetry(3), () => {
    addPickUpPoint()
  })

  it('Verifying pickup point in store-locator', updateRetry(3), () => {
    verifyPickUpPoint()
  })

  it('Verifying all stores by clicking more items', updateRetry(3), () => {
    verifyAllPickUpPoint()
  })

  preserveCookie()
})
