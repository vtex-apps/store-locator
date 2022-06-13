import { updateRetry } from './common/support'
import storeLocatorSelectors, {
  findPickupPoint,
} from './storelocator.selectors'

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

export function linkPickupPointToShippingPolicy(pickuppoint, link = false) {
  it('Link pickup point', updateRetry(3), () => {
    cy.visit('/admin/app/shipping-strategy/shipping-policy/?id=sha1920ede3r')
    cy.get('#name').should('be.visible')
    cy.get('body').then(($body) => {
      if (
        $body.find(storeLocatorSelectors.ShippingPolicyPickupPointStatus)
          .length > 0
      ) {
        cy.log('Pickup point status is already enabled')
      } else {
        cy.get(storeLocatorSelectors.ShippingPolicyPickUpPointToggle).click()
      }
    })
    if (link === true) {
      cy.get(storeLocatorSelectors.ShippingPolicySearch)
        .click()
        .type(pickuppoint, { delay: 80 })
        .wait(1000)
        .type('{downarrow}{enter}')
      cy.get(storeLocatorSelectors.ShippingPolicySaveChanges).click()
    } else {
      cy.get(storeLocatorSelectors.PickupPointsList).then(($els) => {
        const pickuppoints = [...$els].map((el) => el.innerText)

        const indexOfPickupPoint = pickuppoints.indexOf(pickuppoint)

        cy.get(findPickupPoint(indexOfPickupPoint)).click()
      })
    }
  })
}

export function updateShippingPolicyStatus(status) {
  it('Link pickup point', updateRetry(3), () => {
    cy.visit('/admin/app/shipping-strategy/shipping-policy/?id=sha1920ede3r')
    cy.get('#name').should('be.visible')
    cy.get('body').then(($body) => {
      if (
        $body.find(storeLocatorSelectors.ShippingPolicyActiveStatus).length > 0
      ) {
        if (status === true) {
          cy.log('Shipping policy already in active status')
        } else {
          cy.get(storeLocatorSelectors.ShippingPolicyStatusToggle).click()
          cy.get(storeLocatorSelectors.ShippingPolicySaveChanges).click()
        }
      } else if (status === true) {
        cy.get(storeLocatorSelectors.ShippingPolicyStatusToggle).click()
        cy.get(storeLocatorSelectors.ShippingPolicySaveChanges).click()
      } else {
        cy.log('Shipping policy already in inactive status')
      }
    })
  })
}
