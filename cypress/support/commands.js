import 'cypress-file-upload'
import storelocatorSelectors, { getAddressLink } from './storelocator.selectors'

const storelocatorJson = '.storelocator.json'
const fileName = 'pickups.xls'

// Save wishlists
Cypress.Commands.add(
  'setPickupPointItem',
  (pickupPointItem, pickupPointValue) => {
    cy.readFile(storelocatorJson).then((items) => {
      items[pickupPointItem] = pickupPointValue
      cy.writeFile(storelocatorJson, items)
    })
  }
)

// Get wishlists
Cypress.Commands.add('getPickupPointItem', () => {
  cy.readFile(storelocatorJson).then((items) => {
    return items
  })
})

Cypress.Commands.add('verifyPickupPointsInStore', () => {
  cy.visit('/stores')
  cy.getVtexItems().then((vtex) => {
    cy.intercept('POST', `${vtex.baseUrl}/**`, (req) => {
      if (req.body.operationName === 'Session') {
        req.continue()
      }
    }).as('Session')
    cy.get(storelocatorSelectors.VtexStoreLocatorAddress)
      .contains('pickup example 1')
      .click()
    cy.wait('@Session', { timeout: 40000 })
  })
})

Cypress.Commands.add('uploadXLS', () => {
  cy.visit('/admin/app/pickup-points')
  cy.get(storelocatorSelectors.VtexButton).first().should('be.visible')
  cy.contains('Upload a XLS').click()
  cy.get(storelocatorSelectors.UploadInput).attachFile(fileName)
  cy.get(storelocatorSelectors.CloseIcon).should('be.visible').click()
  cy.get(storelocatorSelectors.VtexAlert).should('be.visible')
})

Cypress.Commands.add('verifyDetailsInDetailPage', () => {
  cy.get(storelocatorSelectors.VtexStoreName).then(($els) => {
    const storeLocatorsNames = [...$els].map((el) => el.innerText)
    const indexOfNsmr = storeLocatorsNames.indexOf('pickup example 2')

    cy.get(getAddressLink(indexOfNsmr)).click()
    cy.get(storelocatorSelectors.HoursContainer).should('be.visible')
  })
})
