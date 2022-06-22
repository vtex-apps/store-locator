import { deleteAllPickupPoints } from '../support/store-locator.apis.js'
import { testSetup } from '../support/common/support.js'

describe('Wipe the pickup points', () => {
  testSetup(false)

  deleteAllPickupPoints()
})
