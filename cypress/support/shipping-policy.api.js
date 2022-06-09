import { FAIL_ON_STATUS_CODE } from './common/constants'
import { updateRetry } from './common/support'

export function updateShippingPolicyStatus(pickuppoint) {
  it('Update shipping policy', updateRetry(3), () => {
    cy.addDelayBetweenRetries(2000)
    cy.request({
      method: 'PUT',
      url: `https://sandboxusdev.vtexcommercestable.com.br/api/logistics/pvt/shipping-policies/${pickuppoint}`,
      body: {
        isActive: true,
      },
      ...FAIL_ON_STATUS_CODE,
    }).then((response) => {
      cy.log(response)
      expect(response.status).to.equal(200)
    })
  })
}
