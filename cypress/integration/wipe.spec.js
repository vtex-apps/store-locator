import {
  graphql,
  updateShippingPolicy,
} from '../support/shipping-policy.graphql.js'
import { deleteAllPickupPoints } from '../support/store-locator.apis.js'
import data from '../support/shipping-policy.json'
import { testSetup } from '../support/common/support.js'

describe('Wipe the pickup points', () => {
  testSetup(false)

  deleteAllPickupPoints()

  // If we leave the shipping policy active then it is forcing us to use pickup points in checkout
  // So, make shipping policy as inactive
  it('Update shipping policy status to inactive', () => {
    graphql(
      updateShippingPolicy(data, { status: false, pickup: false }),
      (response) => {
        expect(response.status).to.equal(200)
      }
    )
  })
})
