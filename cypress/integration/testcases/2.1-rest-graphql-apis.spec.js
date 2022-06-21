import { testSetup } from '../../support/common/support'
import {
  createPickupPoint,
  deletePickupPoint,
  getPickupPointById,
  listallPickupPoints,
  listedPickupPointsPage,
  updatePickupPoint,
} from '../../support/store-locator.apis.js'
import { testCase1 } from '../../support/store-locator.outputvalidation.js'

const { data1, data2, data3 } = testCase1
const pickupPointId = 'pickupPointId'

describe('Rest api testcases', () => {
  testSetup()
  listallPickupPoints()
  createPickupPoint(data1, pickupPointId)
  updatePickupPoint(data2)
  getPickupPointById()
  deletePickupPoint()
  listedPickupPointsPage()
  createPickupPoint(data3, pickupPointId)
})
