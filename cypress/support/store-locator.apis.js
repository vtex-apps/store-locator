import { VTEX_AUTH_HEADER, FAIL_ON_STATUS_CODE } from './common/constants'
import { updateRetry } from './common/support'
import {
  getPickupPointsAPI,
  createAPI,
  updateAPI,
  getPickupPointByIdAPI,
  deletePickupPointAPI,
  listedPickupPointsPageAPI,
} from './pickup-point.api'

export function listallPickupPoints() {
  it('list all pickup points', updateRetry(3), () => {
    cy.addDelayBetweenRetries(2000)
    cy.getVtexItems().then((vtex) => {
      cy.getAPI(getPickupPointsAPI(vtex.baseUrl)).then((response) => {
        expect(response.status).to.equal(200)
      })
    })
  })
}

export function createPickupPoint(data, dataEnv) {
  it('create/update a pickup point', updateRetry(3), () => {
    cy.addDelayBetweenRetries(2000)
    cy.getVtexItems().then((vtex) => {
      cy.request({
        method: 'POST',
        url: createAPI(vtex.baseUrl),
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

export function updatePickupPoint(data2) {
  it('update a pickup point', updateRetry(3), () => {
    cy.addDelayBetweenRetries(2000)
    cy.getVtexItems().then((vtex) => {
      cy.getPickupPointItem().then((data) => {
        cy.request({
          method: 'POST',
          url: updateAPI(vtex.baseUrl),
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

export function getPickupPointById() {
  it('list the pickup point by id', updateRetry(3), () => {
    cy.addDelayBetweenRetries(2000)
    cy.getVtexItems().then((vtex) => {
      cy.getPickupPointItem().then((data) => {
        cy.log(data.pickupPointId)
        cy.getAPI(getPickupPointByIdAPI(vtex.baseUrl, data.pickupPointId)).then(
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

export function deletePickupPoint() {
  it('delete a pickup point', updateRetry(3), () => {
    cy.addDelayBetweenRetries(2000)
    cy.getVtexItems().then((vtex) => {
      cy.getPickupPointItem().then((data) => {
        cy.request({
          method: 'DELETE',
          url: deletePickupPointAPI(vtex.baseUrl, data.pickupPointId),
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
    cy.getAPI(getPickupPointsAPI(vtex.baseUrl)).then((response) => {
      cy.log(response.body)
      const filterPickUpPoints = response.body.filter((b) =>
        b.name.includes('StoreLocatorApp')
      )

      if (filterPickUpPoints.length > 0) {
        for (const element of filterPickUpPoints) {
          cy.request({
            method: 'DELETE',
            url: deletePickupPointAPI(vtex.baseUrl, element.pickupPointId),
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

export function listedPickupPointsPage() {
  it('listed pickup points page', updateRetry(3), () => {
    cy.addDelayBetweenRetries(2000)
    cy.getVtexItems().then((vtex) => {
      cy.request({
        method: 'GET',
        url: listedPickupPointsPageAPI(vtex.baseUrl),
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
