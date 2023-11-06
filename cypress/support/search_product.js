export function searchProduct(searchKey) {
  cy.qe(
    `Adding intercept to wait for the events API to be completed before visting home page`
  )
  cy.intercept('**/event-api/v1/*/event').as('events')
  cy.visit('/')
  cy.wait('@events')
  cy.qe("Verify the store front page should contain 'Hello'")
  cy.get('body').should('contain', 'Hello')
  cy.qe('Verifying the search bar should be visible in the store front')
  cy.qe(`searching product - ${searchKey} in the store front search bar`)
  // Search product in search bar
  cy.get(selectors.Search)
    .should('be.visible')
    .clear()
    .type(searchKey)
    .type('{enter}')
  // Page should load successfully now searchResult & Filter should be visible
  cy.qe(
    `Verfiying the search result is visible and having the text ${searchKey} in lowercase`
  )
  cy.get(selectors.searchResult)
    .should('be.visible')
    .should('have.text', searchKey.toLowerCase())
  cy.qe(`Verifying the filterHeading should be visible`)
  cy.get(selectors.FilterHeading).should('be.visible')
}
