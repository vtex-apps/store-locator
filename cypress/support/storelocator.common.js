import { updateRetry } from './common/support'
import storeLocatorSelectors, {
  findPickupPoint,
} from './storelocator.selectors'
import { INTIAL_PICKUP_POINTS_ENV } from './store-locator.apis'
import { pickuppointsJsonFile } from './constants'

export function addPickUpPoint(pickPointName) {
  cy.visit('/admin/app/pickup-points')

  cy.get(storeLocatorSelectors.AddPickUpButton).click()
  cy.get(storeLocatorSelectors.PickUpPointName).clear().type(pickPointName)
  cy.get(storeLocatorSelectors.PickUpPointId).should('be.visible').type('1')
  cy.get('select')
    .select('United States of America')
    .should('have.value', 'USA')
  /* eslint-disable cypress/no-unnecessary-waiting */
  cy.wait(1000)
  /* eslint-disable cypress/no-unnecessary-waiting */
  cy.get(storeLocatorSelectors.PickUpAddress)
    .type('1279 Shinn Street Fremont CA,USA', { delay: 50 })
    .wait(500)
    .type('{downarrow}{enter}')
  cy.get(storeLocatorSelectors.CheckBox).click()
  cy.get(storeLocatorSelectors.WorkStartTime).type('10:00')
  cy.get(storeLocatorSelectors.WorkEndTime).type('19:00')
  cy.get(storeLocatorSelectors.SaveChanges).click()
  cy.get(storeLocatorSelectors.ChangesSaved, { timeout: 10000 })
    .should('be.visible')
    .contains('Changes saved')
}

function tConvert(timeString) {
  const hourEnd = timeString.indexOf(':')
  const H = +timeString.substr(0, hourEnd)
  const h = H % 12 || 12
  const ampm = H < 12 ? 'am' : 'pm'

  timeString = h + timeString.substr(hourEnd, 3) + ampm

  return timeString
}

export function verifyAllPickUpPoint() {
  cy.visitStore()
  cy.get(storeLocatorSelectors.ListOfStores).should('be.visible')
  cy.get(storeLocatorSelectors.LoadStores).click()

  cy.getPickupPointItem().then((pickupCount) => {
    cy.get(storeLocatorSelectors.MoreItems).should(
      'have.length',
      pickupCount[INTIAL_PICKUP_POINTS_ENV] + 4
    )
    cy.get(storeLocatorSelectors.MoreItems)
      .its('length')
      .then((itemLen) => {
        for (let i = 0; i < itemLen; i++) {
          cy.get(storeLocatorSelectors.LoadStores).should('be.visible').click()
          cy.get(storeLocatorSelectors.MoreItems)
            .eq(i)
            .should('be.visible')
            .click()
          cy.get(storeLocatorSelectors.AddressContainer, {
            timeout: 20000,
          }).should('be.visible')
          cy.get(storeLocatorSelectors.Hours).should('be.visible')
          cy.get(storeLocatorSelectors.StoreName)
            .invoke('text')
            .then((text) => {
              if (text === 'pickup example 1') {
                cy.get(storeLocatorSelectors.HourRow).then(($els) => {
                  const pickupPoins = [...$els].map((el) => el.innerText)
                  const pickupPointsHours = pickupPoins.map((name) =>
                    name.split(':\n')
                  )

                  cy.readFile(pickuppointsJsonFile).then((pp) => {
                    const filterPickupPoint = pp.filter((p) => p.name === text)
                    const [{ businessHours }] = filterPickupPoint

                    // eslint-disable-next-line array-callback-return
                    businessHours.map((ba) => {
                      if (ba.dayOfWeek === 1) {
                        const dayOfWeek = pickupPointsHours.filter(
                          (day) => day[0] === 'Monday'
                        )

                        const startTime = tConvert(ba.openingTime)
                        const endTime = tConvert(ba.closingTime)

                        expect(dayOfWeek[0][1]).to.be.equal(
                          `0${startTime} - ${endTime}`
                        )
                      } else if (ba.dayOfWeek === 2) {
                        const dayOfWeek = pickupPointsHours.filter(
                          (day) => day[0] === 'Tuesday'
                        )

                        const startTime = tConvert(ba.openingTime)
                        const endTime = tConvert(ba.closingTime)

                        expect(dayOfWeek[0][1]).to.be.equal(
                          `0${startTime} - ${endTime}`
                        )
                      } else if (ba.dayOfWeek === 5) {
                        const dayOfWeek = pickupPointsHours.filter(
                          (day) => day[0] === 'Friday'
                        )

                        const startTime = tConvert(ba.openingTime)
                        const endTime = tConvert(ba.closingTime)

                        expect(dayOfWeek[0][1]).to.be.equal(
                          `0${startTime} - ${endTime}`
                        )
                      }
                    })
                  })
                })
              }
            })
          cy.get(storeLocatorSelectors.BackToPickUpPoint)
            .should('be.visible')
            .click()
        }
      })
  })
}

export function linkPickupPointToShippingPolicy(pickuppoint, link = false) {
  it('Link pickup point', updateRetry(2), () => {
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
  it('Link pickup point', updateRetry(2), () => {
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
