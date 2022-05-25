import { testSetup, updateRetry } from '../../support/common/support'

describe('Testing Single Product and total amounts', () => {
  // Load test setup
  testSetup(false)

  it('Visit admin endpoint and upload file', updateRetry(3), () => {
    cy.uploadXLS()
  })

  it(
    'Verify pickup point is showing in /stores endpoint',
    updateRetry(3),
    () => {
      cy.verifyPickupPointsInStore()
    }
  )

  it('Verify Holidays/Exceptions and Business hours are showing correctly in detail page', () => {
    cy.verifyDetailsInDetailPage()
  })
})
