import { VTEX_AUTH_HEADER, FAIL_ON_STATUS_CODE } from './common/constants'
import { updateRetry } from './common/support'
import {
  getPickupPoints,
  createPickupPoint,
  updatePickupPoint,
  getPickupPointById,
  deletePickupPoint,
  searchPickupPoint,
} from './apis'

export const INTIAL_PICKUP_POINTS_ENV = 'INTIAL_PICKUP_POINTS_ENV'

const FILTER_PICKUP_POINT_KEY = 'pickup example'

export function filterPickupPoint(response, filterByPickupExample = true) {
  return response.body.filter((b) =>
    filterByPickupExample
      ? b.name.includes(FILTER_PICKUP_POINT_KEY)
      : !b.name.includes(FILTER_PICKUP_POINT_KEY)
  )
}

export function setIntialPickupPoints(response) {
  const pickupointsCount = filterPickupPoint(response, false).length

  cy.setPickupPointItem(INTIAL_PICKUP_POINTS_ENV, pickupointsCount)
}

export function listallPickupPointsAPI() {
  it('List all pickup points via API', updateRetry(2), () => {
    cy.addDelayBetweenRetries(2000)
    cy.getVtexItems().then((vtex) => {
      cy.getAPI(getPickupPoints(vtex.baseUrl)).then((response) => {
        expect(response.status).to.equal(200)
        setIntialPickupPoints(response)
      })
    })
  })
}

export function createPickupPointAPI(pickupPointPayload) {
  it(
    `Create a pickup point "${pickupPointPayload.name}" via API`,
    updateRetry(2),
    () => {
      cy.addDelayBetweenRetries(2000)
      cy.getVtexItems().then((vtex) => {
        cy.request({
          method: 'POST',
          url: createPickupPoint(vtex.baseUrl),
          headers: {
            ...VTEX_AUTH_HEADER(vtex.apiKey, vtex.apiToken),
          },
          body: pickupPointPayload,
          ...FAIL_ON_STATUS_CODE,
        }).then((response) => {
          cy.log(response)
          expect(response.status).to.equal(200)
          expect(response.body).to.have.property('name')
          expect(response.body).to.have.property('id')
          // In storelocators.json -> {pickup_point_name : response.body.id }
          cy.setPickupPointItem(pickupPointPayload.name, response.body.id)
        })
      })
    }
  )
}

export function updatePickupPointAPI(
  currentPickupPointPayload,
  updatedPickupPointPayload
) {
  it(
    `Update a pickup point "${currentPickupPointPayload.name}" payload with "${updatedPickupPointPayload.name}" payload via API`,
    updateRetry(2),
    () => {
      cy.addDelayBetweenRetries(2000)
      cy.getVtexItems().then((vtex) => {
        cy.getPickupPointItem().then((data) => {
          cy.request({
            method: 'POST',
            url: updatePickupPoint(vtex.baseUrl),
            headers: {
              ...VTEX_AUTH_HEADER(vtex.apiKey, vtex.apiToken),
            },
            body: updatedPickupPointPayload,
            qs: { id: data[currentPickupPointPayload.name] },

            ...FAIL_ON_STATUS_CODE,
          }).then((response) => {
            // In storelocators.json -> {pickup_point_name : response.body.id }
            cy.setPickupPointItem(
              updatedPickupPointPayload.name,
              response.body.id
            )
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property(
              'name',
              updatedPickupPointPayload.name
            )
          })
        })
      })
    }
  )
}

export function getPickupPointByIdAPI(pickupPointPayload) {
  it(
    `List the pickup point by "${pickupPointPayload.name}'s" id via API`,
    updateRetry(2),
    () => {
      cy.addDelayBetweenRetries(2000)
      cy.getVtexItems().then((vtex) => {
        cy.getPickupPointItem().then((data) => {
          cy.getAPI(
            getPickupPointById(vtex.baseUrl, data[pickupPointPayload.name])
          ).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('name')
            expect(response.body).to.have.property('id')
          })
        })
      })
    }
  )
}

export function deletePickupPointAPI(pickupPointPayload) {
  it(
    `Delete a pickup point ${pickupPointPayload.name} via API`,
    updateRetry(2),
    () => {
      cy.addDelayBetweenRetries(2000)
      cy.getVtexItems().then((vtex) => {
        cy.getPickupPointItem().then((data) => {
          cy.request({
            method: 'DELETE',
            url: deletePickupPoint(vtex.baseUrl, data[pickupPointPayload.name]),
            headers: {
              ...VTEX_AUTH_HEADER(vtex.apiKey, vtex.apiToken),
            },
            ...FAIL_ON_STATUS_CODE,
          }).then((response) => {
            expect(response.status).to.equal(204)
          })
        })
      })
    }
  )
}

export function deleteAllPickupPoints() {
  it(
    `Filter and delete pickup point which starts with "${FILTER_PICKUP_POINT_KEY}"`,
    updateRetry(5),
    () => {
      cy.getVtexItems().then((vtex) => {
        cy.getAPI(getPickupPoints(vtex.baseUrl)).then((response) => {
          // Pickup points created in E2E tests should start with text "pickup example"
          // If we create other pickup points then it will not be deleted in wipe
          const filterPickUpPoints = filterPickupPoint(response, true)

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
  )
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

export function updatePickupPointdata(pickupPointPayload) {
  it(
    `Update a pickup point "${pickupPointPayload.name}" as inactive`,
    updateRetry(2),
    () => {
      cy.addDelayBetweenRetries(2000)
      cy.getVtexItems().then((vtex) => {
        cy.getPickupPointItem().then((data) => {
          pickupPointPayload.isActive = false

          cy.request({
            method: 'POST',
            url: updatePickupPoint(vtex.baseUrl),
            headers: {
              ...VTEX_AUTH_HEADER(vtex.apiKey, vtex.apiToken),
            },
            body: pickupPointPayload,

            qs: { id: data[pickupPointPayload.name] },

            ...FAIL_ON_STATUS_CODE,
          }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('isActive', false)
          })
        })
      })
    }
  )
}
