import { testSetup,updateRetry } from '../../support/common/support'
import { getStores, graphql, validateGetStoresresponse } from '../../support/store-locator.settings'
import {
  createPickupPoint,
  deletePickupPoint,
  getPickupPointById,
  listallPickupPoints,
  listedPickupPointsPage,
  updatePickupPoint,
} from '../../support/store-locator.api.js'
import { testCase1 } from '../../support/store-locator.outputvalidation.js'
const { data1 , data2 } = testCase1
const pickupPointId = 'pickupPointId'

describe('Rest api testcases', () => {
  testSetup()
  listallPickupPoints()
  createPickupPoint(data1, pickupPointId)
  updatePickupPoint(data2)
  getPickupPointById()
  deletePickupPoint()
  listedPickupPointsPage()
})
describe('graphql apis',updateRetry(3),()=>
{

  // Load test setup
  testSetup()
  it('Verifying getStores query', updateRetry(2), () => {
    cy.addDelayBetweenRetries(5000)


      graphql(getStores(),response =>{
        validateGetStoresresponse

      })

      })
})
