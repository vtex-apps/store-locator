import { testSetup, updateRetry } from '../support/common/support'
import {
  createPickupPointAPI,
  deletePickupPointAPI,
  getPickupPointByIdAPI,
  listallPickupPointsAPI,
  searchPickupPointAPI,
  updatePickupPointAPI,
} from '../support/store-locator.apis.js'
import { restAPITestCase } from '../support/store-locator.outputvalidation.js'
import data from '../support/shipping-policy.json'
import {
  graphql,
  updateShippingPolicy,
  getStores,
} from '../support/shipping-policy.graphql'
import { storeLocator, logisticsCarrier } from '../support/app_list'

/*
How to get shippingPolicy Id?
1. Go to /admin endpoint
2. Search for shipping strategy and from search results click to open
3. Edit any of the available shipping strategies
4. Now in url, you will get admin/shipping-strategy/shipping-policy/?id=sha1920ede3r
*/

const shippingPolicyId = 'sha1920ede3r'
const storeId = '45678'

const {
  pickupPoint1Payload,
  pickupPoint2Payload,
  pickupPoint3Payload,
} = restAPITestCase

describe('Rest & Graphql API testcases', () => {
  testSetup()

  listallPickupPointsAPI()
  createPickupPointAPI(pickupPoint1Payload)
  updatePickupPointAPI(pickupPoint1Payload, pickupPoint2Payload)
  getPickupPointByIdAPI(pickupPoint2Payload)
  deletePickupPointAPI(pickupPoint2Payload)
  searchPickupPointAPI()
  createPickupPointAPI(pickupPoint3Payload)
  // Shipping policy should be updated to active
  // Then only we can use pickup in 2.4 testcase
  it(
    'Update shipping policy status to active and enable pickup points',
    updateRetry(5),
    () => {
      cy.addDelayBetweenRetries(1000)
      graphql(
        logisticsCarrier,
        updateShippingPolicy(data, {
          status: true,
          pickup: true,
        }),
        (response) => {
          expect(response.status).to.equal(200)
          expect(response.body.data.updateShippingPolicy.id).to.equal(
            shippingPolicyId
          )
        }
      )
    }
  )

  it('verify getStores with latitude and longitude', updateRetry(3), () => {
    graphql(storeLocator, getStores(-22.94, -43.18), (response) => {
      expect(response.status).to.equal(200)
      expect(response.body.data.getStores.items.length).to.equal(1)
      expect(response.body.data.getStores.items[0].id).to.equal(storeId)
    })
  })
  it('verify getStores with latitude and longitude', updateRetry(3), () => {
    graphql(storeLocator, getStores(), (response) => {
      expect(response.status).to.equal(200)
      expect(response.body.data.getStores.items.length).to.equal(3)
      expect(response.body.data.getStores.items[2].id).to.equal(storeId)
    })
  })
})
