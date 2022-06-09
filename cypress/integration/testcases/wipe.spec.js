import { updateRetry, testSetup } from '../../support/common/support.js'
import { updateShippingPolicyStatus } from '../../support/shipping-policy.api.js'
import { deleteAllPickupPoints } from '../../support/store-locator.apis.js'

describe('Wipe the pickup points', () => {
  testSetup(false)
  it('Delete all the pickup points', updateRetry(5), () => {
    deleteAllPickupPoints()
  })

  it('Update Shipping policy as inactive', updateRetry(4), () => {
    updateShippingPolicyStatus()
  })
})
