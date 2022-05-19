import { testSetup, updateRetry } from '../../support/common/support'

describe('Testing Single Product and total amounts', () => {
  // Load test setup
  testSetup(false)

  it('Visit admin endpoint', updateRetry(3), () => {
    cy.visit('/admin/app/pickup-points')
    cy.get('.vtex-button').first().should('be.visible')
    cy.contains('Upload a XLS').click()
    cy.get('input[type=file]').attachFile('pickups.xls')
    cy.get('.vtex-modal__close-icon').should('be.visible').click()
    cy.get('.vtex-alert .ph5').should('be.visible')
  })

  it(
    'Verify pickup point is showing in /stores endpoint',
    updateRetry(3),
    () => {
      cy.visit('/stores')
      cy.getVtexItems().then((vtex) => {
        cy.intercept('POST', `${vtex.baseUrl}/**`, (req) => {
          if (req.body.operationName === 'Session') {
            req.continue()
          }
        }).as('Session')
        cy.get('.vtex-store-locator-0-x-addressStoreName')
          .contains('pickup example 1')
          .click()
        cy.wait('@Session', { timeout: 40000 })
      })
    }
  )

  it('Verify Holidays/Exceptions and Business hours are showing correctly in detail page', () => {
    cy.get('.vtex-store-locator-0-x-addressStoreName').then(($els) => {
      const storeLocatorsNames = [...$els].map((el) => el.innerText)
      const indexOfNsmr = storeLocatorsNames.indexOf('pickup example 2')

      cy.get(
        `.vtex-store-locator-0-x-addressListItem:nth-child(${
          indexOfNsmr + 1
        }) .vtex-store-locator-0-x-addressListLink`
      ).click()
      cy.get('.vtex-store-locator-0-x-hoursContainer').should('be.visible')
    })
  })
})
