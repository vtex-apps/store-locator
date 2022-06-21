import { testSetup, updateRetry } from '../support/common/support'
import { addPickUpPoint } from '../support/storelocator.common'

const prefix = 'Verify Upload XLS File'

describe('Testing Multiple pickup point with XLS file', () => {
  // Load test setup
  testSetup()

  it(`${prefix} - Visit admin endpoint and upload file`, updateRetry(2), () => {
    cy.uploadXLS()
  })

  const pickPointName = 'pickup example 3'

  it('Adding PickUp Point in Store-Locator', updateRetry(2), () => {
    addPickUpPoint(pickPointName)
  })
})
