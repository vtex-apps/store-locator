import { FAIL_ON_STATUS_CODE, VTEX_AUTH_HEADER } from './common/constants'
import { updateRetry } from './common/support'

export function updateShippingPolicyStatus(pickuppoint, status = false) {
  it(
    `Update shipping policy as ${status === true ? 'active' : 'inactive'}`,
    updateRetry(3),
    () => {
      cy.addDelayBetweenRetries(2000)

      cy.getVtexItems().then((vtex) => {
        cy.request({
          method: 'PUT',
          url: `https://sandboxusdev.vtexcommercestable.com.br/api/logistics/pvt/shipping-policies/${pickuppoint}`,
          body: {
            isActive: status,
          },
          headers: VTEX_AUTH_HEADER(vtex.apiKey, vtex.apiToken),
          ...FAIL_ON_STATUS_CODE,
        }).then((response) => {
          cy.log(response)
          expect(response.status).to.equal(200)
        })
      })
    }
  )
}
