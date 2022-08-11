import 'cypress-file-upload'
import selectors from './common/selectors'
import storelocatorSelectors, { getAddressLink } from './selectors.js'

const storelocatorJson = '.storelocator.json'
const fileName = 'pickups.xls'

// Save pickupPoint
Cypress.Commands.add(
  'setPickupPointItem',
  (pickupPointItem, pickupPointValue) => {
    cy.readFile(storelocatorJson).then((items) => {
      items[pickupPointItem] = pickupPointValue
      cy.writeFile(storelocatorJson, items)
    })
  }
)

// Get pickupPoint
Cypress.Commands.add('getPickupPointItem', () => {
  cy.readFile(storelocatorJson).then((items) => {
    return items
  })
})

Cypress.Commands.add('visitStore', () => {
  cy.intercept('**/rc.vtex.com.br/api/events').as('events')
  cy.visit('/stores')
  cy.wait('@events')

  cy.get(selectors.ProfileLabel, { timeout: 20000 })
    .should('be.visible')
    .should('have.contain', `Hello,`)
})

Cypress.Commands.add('verifyPickupPointsInStore', () => {
  cy.getVtexItems().then((vtex) => {
    cy.intercept('POST', `${vtex.baseUrl}/**`, (req) => {
      if (req.body.operationName === 'Session') {
        req.continue()
      }
    }).as('Session')
    cy.visitStore()
    cy.wait('@Session', { timeout: 40000 })
    cy.get(storelocatorSelectors.LoadStores).should('be.visible').click()
    cy.get(storelocatorSelectors.VtexStoreName).contains('pickup example 1')
    cy.get(storelocatorSelectors.VtexStoreName).contains('pickup example 2')
  })
})

Cypress.Commands.add('uploadXLS', () => {
  cy.visit('/admin/app/pickup-points')
  cy.get(storelocatorSelectors.VtexButton).first().should('be.visible')
  cy.contains('Upload a XLS').click()
  cy.get(storelocatorSelectors.UploadInput).attachFile(fileName)
  cy.get(storelocatorSelectors.CloseIcon).should('be.visible').click()
  cy.get(storelocatorSelectors.VtexAlert, { timeout: 15000 }).should(
    'be.visible'
  )
})

Cypress.Commands.add('verifyDetailsInDetailPage', () => {
  cy.get(storelocatorSelectors.VtexStoreName).then(($els) => {
    const storeLocatorsNames = [...$els].map((el) => el.innerText)
    const indexOfNsmr = storeLocatorsNames.indexOf('pickup example 2')

    cy.get(getAddressLink(indexOfNsmr)).click()
    cy.get(storelocatorSelectors.HoursContainer).should('be.visible')
  })
})

Cypress.Commands.add('ordertheProduct', () => {
  cy.get('body').then(($body) => {
    if ($body.find(storelocatorSelectors.FillInvoiceAddress).length) {
      cy.get(storelocatorSelectors.FillInvoiceAddress)
        .last()
        .should('be.visible')
        .click()
    }

    if ($body.find(selectors.ReceiverName).length) {
      cy.get(selectors.ReceiverName, {
        timeout: 5000,
      }).type('Syed')
      cy.get(selectors.GotoPaymentBtn).click()
    }
  })

  cy.get(selectors.PromissoryPayment, { timeout: 5000 })
    .should('be.visible')
    .click()
  cy.get(selectors.BuyNowBtn, {
    timeout: 10000,
  })
    .should('be.visible')
    .last()
    .click()

  // This page take longer time to load. So, wait for profile icon to visible then get orderid from url
  cy.get(selectors.Search, {
    timeout: 30000,
  })
})
