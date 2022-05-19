
import { testSetup, updateRetry } from '../../support/common/support'
import { getStores, graphql, validateGetStoresresponse } from '../../support/store-locator.settings'

describe('graphql apis',updateRetry(3),()=>
{

  // Load test setup
  testSetup()
  it('Verifying getStores query', updateRetry(2), () => {
    cy.addDelayBetweenRetries(5000)


      graphql(getStores(),response =>{
        validateGetStoresresponse

      })

      })
})
