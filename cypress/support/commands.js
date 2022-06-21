import 'cypress-file-upload'
import { addressList } from './common/constants'
import selectors from './common/selectors'
import storelocatorSelectors, {
  getAddressLink,
  getPickupPoint,
} from './storelocator.selectors'

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
    cy.get(storelocatorSelectors.VtexStoreLocatorAddress).contains(
      'pickup example 1'
    )
    cy.get(storelocatorSelectors.VtexStoreLocatorAddress).contains(
      'pickup example 2'
    )
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

function startShipping() {
  cy.get('body').then(($body) => {
    if ($body.find(selectors.ShippingCalculateLink).length) {
      // Contact information needs to be filled
      cy.get(selectors.ShippingCalculateLink).should('be.visible').click()
    } else if ($body.find(selectors.DeliveryAddress).length) {
      // Contact Information already filled
      cy.get(selectors.DeliveryAddress).then(($el) => {
        if (Cypress.dom.isVisible($el)) {
          cy.get(selectors.DeliveryAddress).should('be.visible').click()
        }
      })
    }
  })
}

function fillAddressLine1(deliveryScreenAddress) {
  cy.get('body').then(($shippingBlock) => {
    if ($shippingBlock.find(selectors.ShipStreet).length) {
      cy.get(selectors.ShipStreet).type(deliveryScreenAddress)
      cy.get(selectors.GotoPaymentBtn).should('be.visible').click()
    }
  })
}

function fillContactInfo() {
  cy.wait('@v8')
  cy.get(selectors.QuantityBadge).should('be.visible')
  cy.get(selectors.SummaryCart).should('be.visible')
  cy.get(selectors.FirstName).clear().type('Syed', {
    delay: 50,
  })
  cy.get(selectors.LastName).clear().type('Mujeeb', {
    delay: 50,
  })
  cy.get(selectors.Phone).clear().type('(304) 123 4556', {
    delay: 50,
  })
  cy.get(selectors.ProceedtoShipping).should('be.visible').click()
  cy.get(selectors.ProceedtoShipping, { timeout: 1000 }).should(
    'not.be.visible'
  )
  cy.get('body').then(($shippingBlock) => {
    if ($shippingBlock.find(selectors.ReceiverName).length) {
      cy.get(selectors.ReceiverName, { timeout: 5000 }).type('Syed', {
        delay: 50,
      })
      cy.get(selectors.GotoPaymentBtn).should('be.visible').click()
    }
  })
}

Cypress.Commands.add(
  'updatePickupInStoreShippingInformation',
  (postalCode, pickuppoint) => {
    const { deliveryScreenAddress } = addressList[postalCode]

    startShipping()
    cy.intercept('https://rc.vtex.com/v8').as('v8')
    cy.fillAddress(postalCode).then(() => {
      cy.get(selectors.PickupInStore, { timeout: 5000 })
        .should('be.visible')
        .click()
      cy.get(selectors.FirstName).then(($el) => {
        if (Cypress.dom.isVisible($el)) {
          fillContactInfo()
        }
      })

      fillAddressLine1(deliveryScreenAddress)
      cy.get('body').then(async ($body) => {
        if ($body.find(storelocatorSelectors.FindPickupLink).length) {
          cy.get(storelocatorSelectors.FindPickupLink).click()
          cy.get(storelocatorSelectors.PickUpModelSearch).should('be.visible')
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.get(storelocatorSelectors.PickUpModelSearch)
            .click()
            .type(pickuppoint.address.street, { delay: 100 })
            .wait(500)
            .type('{downarrow}{enter}')
        } else {
          cy.get(storelocatorSelectors.PickupInStoresAddressLink)
            .should('be.visible')
            .click()
        }
      })

      cy.get(storelocatorSelectors.PickupInStoresShowList).click()
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000)
      cy.get(getPickupPoint(pickuppoint.id)).click()
      cy.get(selectors.ConfirmPickup).should('be.visible').click()
      cy.get(selectors.ProceedtoPaymentBtn).should('be.visible').click()
    })
  }
)

Cypress.Commands.add('ordertheProduct', () => {
  cy.get('body').then(($body) => {
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
