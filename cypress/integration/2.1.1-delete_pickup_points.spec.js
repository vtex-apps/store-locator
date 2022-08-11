import { deleteAllPickupPoints } from '../support/api_testcase.js'
import { testSetup } from '../support/common/support.js'

describe('Wipe the pickup points', () => {
  testSetup(false)

  deleteAllPickupPoints()
})
