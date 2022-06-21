import { testSetup, updateRetry } from '../../support/common/support'
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
  testSetup()

  const pickPointName = 'pickup example 3'

  it('Adding PickUp Point in Store-Locator', updateRetry(2), () => {
    addPickUpPoint(pickPointName)
  })

  it('Verifying all stores by clicking more items', updateRetry(2), () => {
    verifyAllPickUpPoint(pickPointName)
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
})
