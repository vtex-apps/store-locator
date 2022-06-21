import { VTEX_AUTH_HEADER, FAIL_ON_STATUS_CODE } from './common/constants'
import selectors from './common/selectors'
import { updateRetry } from './common/support'
import {
  getPickupPoints,
  createPickupPoint,
  updatePickupPoint,
  getPickupPointById,
  deletePickupPoint,
  searchPickupPoint,
} from './pickup-point.api'
import storelocatorSelectors from './storelocator.selectors'

export function listallPickupPointsAPI() {
  it('List all pickup points via API', updateRetry(2), () => {
    cy.addDelayBetweenRetries(2000)
    cy.getVtexItems().then((vtex) => {
      cy.getAPI(getPickupPoints(vtex.baseUrl)).then((response) => {
        expect(response.status).to.equal(200)
      })
    })
  })
}

export function createPickupPointAPI(data, dataEnv) {
  it('Create a pickup point via API', updateRetry(2), () => {
    cy.addDelayBetweenRetries(2000)
    cy.getVtexItems().then((vtex) => {
      cy.request({
        method: 'POST',
        url: createPickupPoint(vtex.baseUrl),
        headers: {
          ...VTEX_AUTH_HEADER(vtex.apiKey, vtex.apiToken),
        },
        body: data,
        ...FAIL_ON_STATUS_CODE,
      }).then((response) => {
        cy.log(response)
        expect(response.status).to.equal(200)
        expect(response.body).to.have.property('name')
        expect(response.body).to.have.property('id')
        cy.setPickupPointItem(dataEnv, response.body.id)
      })
    })
  })
}

export function updatePickupPointAPI(data2) {
  it('Update a pickup point via API', updateRetry(2), () => {
    cy.addDelayBetweenRetries(2000)
    cy.getVtexItems().then((vtex) => {
      cy.getPickupPointItem().then((data) => {
        cy.request({
          method: 'POST',
          url: updatePickupPoint(vtex.baseUrl),
          headers: {
            ...VTEX_AUTH_HEADER(vtex.apiKey, vtex.apiToken),
          },
          body: data2,

          qs: { id: data.pickupPointId },

          ...FAIL_ON_STATUS_CODE,
        }).then((response) => {
          expect(response.status).to.equal(200)
          expect(response.body).to.have.property('name', data2.name)
        })
      })
    })
  })
}

export function getPickupPointByIdAPI() {
  it('List the pickup point by id via API', updateRetry(2), () => {
    cy.addDelayBetweenRetries(2000)
    cy.getVtexItems().then((vtex) => {
      cy.getPickupPointItem().then((data) => {
        cy.log(data.pickupPointId)
        cy.getAPI(getPickupPointById(vtex.baseUrl, data.pickupPointId)).then(
          (response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('name')
            expect(response.body).to.have.property('id')
          }
        )
      })
    })
  })
}

export function deletePickupPointAPI() {
  it('Delete a pickup point via API', updateRetry(2), () => {
    cy.addDelayBetweenRetries(2000)
    cy.getVtexItems().then((vtex) => {
      cy.getPickupPointItem().then((data) => {
        cy.request({
          method: 'DELETE',
          url: deletePickupPoint(vtex.baseUrl, data.pickupPointId),
          headers: {
            ...VTEX_AUTH_HEADER(vtex.apiKey, vtex.apiToken),
          },
          ...FAIL_ON_STATUS_CODE,
        }).then((response) => {
          expect(response.status).to.equal(204)
        })
      })
    })
  })
}

export function deleteAllPickupPoints() {
  cy.getVtexItems().then((vtex) => {
    cy.getAPI(getPickupPoints(vtex.baseUrl)).then((response) => {
      const filterPickUpPoints = response.body.filter((b) =>
        b.name.includes('pickup example')
      )

      if (filterPickUpPoints.length > 0) {
        for (const element of filterPickUpPoints) {
          cy.request({
            method: 'DELETE',
            url: deletePickupPoint(vtex.baseUrl, element.id),
            headers: {
              ...VTEX_AUTH_HEADER(vtex.apiKey, vtex.apiToken),
            },
            ...FAIL_ON_STATUS_CODE,
          }).then((deleteResponse) => {
            expect(deleteResponse.status).to.equal(204)
          })
        }
      }
    })
  })
}

export function searchPickupPointAPI() {
  it('Search pickup points via API', updateRetry(2), () => {
    cy.addDelayBetweenRetries(2000)
    cy.getVtexItems().then((vtex) => {
      cy.request({
        method: 'GET',
        url: searchPickupPoint(vtex.baseUrl),
        headers: {
          ...VTEX_AUTH_HEADER(vtex.apiKey, vtex.apiToken),
        },
        qs: {
          page: 1,
          pageSize: 5,
        },
        ...FAIL_ON_STATUS_CODE,
      }).then((response) => {
        expect(response.status).to.equal(200)
        expect(response.body).to.have.property('paging')
      })
    })
  })
}

export function updatePickupPointdata(data2) {
  it(`Update a pickup point ${data2.name} as inactive`, updateRetry(2), () => {
    cy.addDelayBetweenRetries(2000)
    cy.getVtexItems().then((vtex) => {
      cy.getPickupPointItem().then((data) => {
        data2.isActive = false

        cy.request({
          method: 'POST',
          url: searchPickupPoint(vtex.baseUrl),
          headers: {
            ...VTEX_AUTH_HEADER(vtex.apiKey, vtex.apiToken),
          },
          body: data2,

          qs: { id: data.pickupPointId },

          ...FAIL_ON_STATUS_CODE,
        }).then((response) => {
          expect(response.status).to.equal(200)
          expect(response.body).to.have.property('isActive', false)
        })
      })
    })
  })
}

export function addPickupPoint() {
  it('Add a pickup point', updateRetry(2), () => {
    cy.visit('/admin/app/pickup-points')
    cy.get(storelocatorSelectors.AddPickupPointButton).click()
    cy.get(storelocatorSelectors.PickupPointName)
      .clear()
      .type('pickup example 5')
    cy.get(storelocatorSelectors.PickupPointId).type('4048')
    cy.get('select')
      .select('United States of America')
      .should('have.value', 'USA')
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000)
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.get(storelocatorSelectors.PickupPointAddress)
      .type('19501 Biscayne BlvdAventura, FL 33180', { delay: 50 })
      .wait(500)
      .type('{downarrow}{enter}')

    cy.get(storelocatorSelectors.SelectDay).click()
    cy.get(storelocatorSelectors.SelectHour).type('10:00')
    cy.get(storelocatorSelectors.SelectMinutes).type('19:00')

    cy.get(storelocatorSelectors.SaveButton).click()
    cy.get(selectors.ToastMsgInB2B).should('be.visible')
  })
}
