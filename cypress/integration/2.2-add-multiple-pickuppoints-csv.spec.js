import { testSetup, updateRetry } from '../support/common/support'

const prefix = 'Verify Upload XLS File'

describe('Testing Multiple pickup point with XLS file', () => {
  // Load test setup
  testSetup()

  it(`${prefix} - Visit admin endpoint and upload file`, updateRetry(2), () => {
    cy.uploadXLS()
  })

  it(
    `${prefix} - Verify pickup point is showing in /stores endpoint`,
    updateRetry(2),
    () => {
      cy.verifyPickupPointsInStore()
    }
  )

  it(`${prefix} - Verify Holidays/Exceptions and Business hours are showing correctly in detail page`, () => {
    cy.verifyDetailsInDetailPage()
  })
})
