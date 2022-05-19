// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
const storelocatorJson = '.storelocator.json'

// Save wishlists
Cypress.Commands.add('setPickupPointItem', (pickupPointItem, pickupPointValue) => {
  cy.readFile(storelocatorJson).then(items => {
    items[pickupPointItem] = pickupPointValue
    cy.writeFile(storelocatorJson, items)
  })
})

// Get wishlists
Cypress.Commands.add('getPickupPointItem', () => {
  cy.readFile(storelocatorJson).then(items => {
    return items
  })
})
