import {
  testSetup,
  updateRetry,
  preserveCookie,
} from '../../support/common/support'
import {
  addPickUpPoint,
  verifyAllPickUpPoint,
} from '../../support/storelocator.common'
import {
  graphql,
  updateShippingPolicy,
} from '../../support/shipping-policy.graphql'
import data from '../../support/shipping-policy.json'

const shippingPolicyId = 'sha1920ede3r'

describe('Testing PickUpPoint in storeLocator', () => {
  // Load test setup
  testSetup(true)

  it('Adding PickUp Point in Store-Locator', updateRetry(3), () => {
    addPickUpPoint()
  })

  it('Verifying all stores by clicking more items', updateRetry(3), () => {
    verifyAllPickUpPoint()
  })

  it('Update shipping policy status', () => {
    graphql(
      updateShippingPolicy(data, { status: true, pickup: true }),
      (response) => {
        expect(response.status).to.equal(200)
        expect(response.body.data.updateShippingPolicy.id).to.equal(
          shippingPolicyId
        )
      }
    )
  })

  preserveCookie()
})
