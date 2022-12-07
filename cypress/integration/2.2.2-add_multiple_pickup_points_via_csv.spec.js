import { testSetup, updateRetry } from '../support/common/support'
import { graphql } from '../support/common/graphql_utils'
import { getStores } from '../support/graphql_testcase'
import { storeLocator } from '../support/app_list'

const prefix = 'Verify Upload XLS File'

describe('Adding Multiple pickup point', () => {
  // Load test setup
  testSetup()

  // If we upload this file cypress/fixtures/pickups.xls then it will create two pickup points
  // pickup example 1 & pickup example 2
  it(`${prefix} - Visit admin endpoint and upload file`, updateRetry(2), () => {
    cy.uploadXLS()
  })

  it('verify getStores with latitude and longitude', updateRetry(5), () => {
    graphql(storeLocator, getStores(-22.94, -43.18), (response) => {
      cy.addDelayBetweenRetries(10000)
      expect(response.status).to.equal(200)
      const pickupPoints = response.body.data.getStores.items.map((p) =>
        p.name.includes('pickup example')
      )

      expect(pickupPoints.length).to.equal(2)
    })
  })

  it('verify getStores without latitude and longitude', updateRetry(5), () => {
    graphql(storeLocator, getStores(), (response) => {
      cy.addDelayBetweenRetries(4000)
      expect(response.status).to.equal(200)
      expect(response.body.data.getStores.items.length).to.not.equal(0)
    })
  })
})
