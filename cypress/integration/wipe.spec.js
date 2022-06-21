import {
  graphql,
  updateShippingPolicy,
} from '../support/shipping-policy.graphql.js'
import { deleteAllPickupPoints } from '../support/store-locator.apis.js'
import data from '../support/shipping-policy.json'
import { updateRetry, testSetup } from '../support/common/support.js'

describe('Wipe the pickup points', () => {
  testSetup(false)

  const FILTER_PICKUP_POINT_KEY = 'pickup example'

  it(
    `Filter and delete pickup point which starts with "${FILTER_PICKUP_POINT_KEY}"`,
    updateRetry(5),
    () => {
      deleteAllPickupPoints(FILTER_PICKUP_POINT_KEY)
    }
  )

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
