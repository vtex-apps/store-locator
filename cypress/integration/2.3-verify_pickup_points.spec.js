import { testSetup, updateRetry } from '../support/common/support'
import { verifyAllPickUpPoint } from '../support/storelocator.common'
import { listallPickupPointsAPI } from '../support/store-locator.apis.js'

describe('Verify all pickup points is displayed', () => {
  // Load test setup
  testSetup()

  listallPickupPointsAPI()
  it('Verify all pickup points is shown in stores', updateRetry(2), () => {
    verifyAllPickUpPoint()
  })
})
