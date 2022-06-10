import { testSetup, updateRetry } from '../../support/common/support'
import { updateShippingPolicyStatus } from '../../support/storelocator.common'

const prefix = 'Verify Download'

describe('Testing Single Product and total amounts', () => {
  // Load test setup
  testSetup(false)

  it(`${prefix} - Visit admin endpoint and upload file`, updateRetry(3), () => {
    cy.uploadXLS()
  })

  it(
    `${prefix} - Verify pickup point is showing in /stores endpoint`,
    updateRetry(3),
    () => {
      cy.verifyPickupPointsInStore()
    }
  )

  it(`${prefix} - Verify Holidays/Exceptions and Business hours are showing correctly in detail page`, () => {
    cy.verifyDetailsInDetailPage()
  })

  updateShippingPolicyStatus(true)
})
