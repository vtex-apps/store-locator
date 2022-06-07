import storeLocatorSelectors from './storelocator.selectors'

export function addPickUpPoint() {
  cy.visit('/admin/app/pickup-points')
  cy.get(storeLocatorSelectors.AddPickUpButton).click()
  cy.get(storeLocatorSelectors.PickUpPointName)
    .clear()
    .type('saravanan saravanan')
  cy.get(storeLocatorSelectors.PickUpPointId).type('1')
  cy.get('select')
    .select('United States of America')
    .should('have.value', 'USA')
  /* eslint-disable cypress/no-unnecessary-waiting */
  cy.wait(1000)
  /* eslint-disable cypress/no-unnecessary-waiting */
  cy.get(storeLocatorSelectors.PickUpAddress)
    .type('33301 Old Hempstead Rd Magnolia', { delay: 50 })
    .wait(500)
    .type('{downarrow}{enter}')
  cy.get(storeLocatorSelectors.CheckBox).click()
  cy.get(storeLocatorSelectors.WorkStartTime).type('10:00')
  cy.get(storeLocatorSelectors.WorkEndTime).type('19:00')
  cy.get(storeLocatorSelectors.SaveChanges).click()
  cy.get(storeLocatorSelectors.ChangesSaved)
    .should('be.visible')
    .contains('Changes saved')
}

export function verifyPickUpPoint() {
  cy.visit('/stores')
  cy.get(storeLocatorSelectors.ListOfStores).should('be.visible')
  cy.get(storeLocatorSelectors.LoadStores).click()
}

export function verifyAllPickUpPoint() {
  cy.get(storeLocatorSelectors.MoreItems)
    .its('length')
    .then((itemLen) => {
      cy.log(itemLen)
      for (let i = 0; i < itemLen; i++) {
        cy.get(storeLocatorSelectors.MoreItems).eq(i).click()
        cy.get(storeLocatorSelectors.Hours).should('be.visible')
        cy.get(storeLocatorSelectors.BackToPickUpPoint).click()
      }
    })
}
