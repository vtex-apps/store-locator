import { testSetup, updateRetry } from '../../support/common/support'
import {
  graphql,
  updateShippingPolicy,
} from '../../support/shipping-policy.graphql'
import data from '../../support/shipping-policy.json'

const prefix = 'Verify Download'
const shippingPolicyId = 'sha1920ede3r'

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

  it('Update shipping policy status', () => {
    graphql(updateShippingPolicy(shippingPolicyId, data, true), (response) => {
      expect(response.status).to.equal(200)
    })
  })
})
