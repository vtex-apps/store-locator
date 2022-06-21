import { testSetup, updateRetry } from '../support/common/support'
import { verifyAllPickUpPoint } from '../support/storelocator.common'

describe('Verify PickUpPoint in storeLocator', () => {
  // Load test setup
  testSetup()

  it('Verifying all stores by clicking more items', updateRetry(2), () => {
    verifyAllPickUpPoint()
  })
})
