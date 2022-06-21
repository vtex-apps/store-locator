import { testSetup } from '../support/common/support'
import {
  createPickupPointAPI,
  deletePickupPointAPI,
  getPickupPointByIdAPI,
  listallPickupPointsAPI,
  searchPickupPointAPI,
  updatePickupPointAPI,
} from '../support/store-locator.apis.js'
import { testCase1 } from '../support/store-locator.outputvalidation.js'
import data from '../support/shipping-policy.json'
import {
  graphql,
  updateShippingPolicy,
} from '../support/shipping-policy.graphql'

const shippingPolicyId = 'sha1920ede3r'

const { data1, data2, data3 } = testCase1
const pickupPointId = 'pickupPointId'

describe('Rest api testcases', () => {
  testSetup()
  listallPickupPointsAPI()
  createPickupPointAPI(data1, pickupPointId)
  updatePickupPointAPI(data2)
  getPickupPointByIdAPI()
  deletePickupPointAPI()
  searchPickupPointAPI()
  createPickupPointAPI(data3, pickupPointId)

  // Shipping policy should be updated to active
  // Then only we can use pickup in 2.4 testcase
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
