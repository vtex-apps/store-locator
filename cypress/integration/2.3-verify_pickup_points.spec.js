import { testSetup, updateRetry } from '../support/common/support'
import { verifyAllPickUpPoint } from '../support/storelocator.common'

describe('Verify all pickup points is displayed', () => {
  // Load test setup
  testSetup()

  it('Verify all pickup points is shown in stores', updateRetry(2), () => {
    verifyAllPickUpPoint()
  })
})
