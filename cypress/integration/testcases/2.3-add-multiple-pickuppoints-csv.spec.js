import { testSetup, updateRetry } from '../../support/common/support'

describe('Testing Single Product and total amounts', () => {
  // Load test setup
  testSetup(false)

  it('Visit admin endpoint', updateRetry(3), () => {
    cy.visit('/admin/app/pickup-points')
    cy.get('.vtex-button').first().should('be.visible')
    cy.contains('Upload a XLS').click()
    cy.contains('choose a file').click()
    cy.get('input[type=file]').attachFile('cypress/fixtures/pickups.xls')
  })
})
