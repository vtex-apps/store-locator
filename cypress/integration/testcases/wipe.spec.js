import { updateRetry, testSetup } from '../../support/common/support.js'
import {
  graphql,
  updateShippingPolicy,
} from '../../support/shipping-policy.graphql.js'
import { deleteAllPickupPoints } from '../../support/store-locator.apis.js'
import data from '../../support/shipping-policy.json'

describe('Wipe the pickup points', () => {
  testSetup(false)
  it('Delete all the pickup points', updateRetry(5), () => {
    deleteAllPickupPoints()
  })

  it('Update shipping policy status', () => {
    graphql(
      updateShippingPolicy(data, { status: false, pickup: false }),
      (response) => {
        expect(response.status).to.equal(200)
      }
    )
  })
})
