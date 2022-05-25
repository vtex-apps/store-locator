import { VTEX_AUTH_HEADER, FAIL_ON_STATUS_CODE } from './common/constants'
import { updateRetry } from './common/support'
import {
  getPickupPointsAPI,
  createAPI,
  updateAPI,
  getPickupPointByIdAPI,
  deletePickupPointAPI,
  listedPickupPointsPageAPI,
} from '../support/product.api'
import StoreLocatorSelectors from './store-locator-selector'
import selectors from './common/selectors'


export function listallPickupPoints() {
  it('list all pickup points', updateRetry(3), () => {
    cy.addDelayBetweenRetries(2000)
    cy.getVtexItems().then((vtex) => {
      cy.getAPI(getPickupPointsAPI(vtex.baseUrl)).then((response) => {
        cy.log(response)
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


export function updatePickupPointdata(data2){
  it('update a pickup point', updateRetry(3), () => {
    cy.addDelayBetweenRetries(2000)
    cy.getVtexItems().then((vtex) => {
      cy.getPickupPointItem().then((data) => {
        data2.isActive = false

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
          expect(response.body).to.have.property('isActive',false)
        })
      })
    })
  })
}

export function addPickupPoint(){
  it('add a pickup point',updateRetry(3),()=>
  {
    cy.visit('/admin/app/pickup-points')
    cy.get(StoreLocatorSelectors.AddPickupPointButton).click()
    cy.get(StoreLocatorSelectors.PickupPointName).clear().type("sumanraj+sumanraj4048")
    cy.get(StoreLocatorSelectors.PickupPointId).type("4048")
    cy.get('select').select('United States of America').should('have.value', 'USA')
    cy.wait(1000)
    cy.get(StoreLocatorSelectors.PickupPointAddress)
    .type('19501 Biscayne BlvdAventura, FL 33180', { delay: 50 })
    .wait(500)
    .type('{downarrow}{enter}')

    cy.get(StoreLocatorSelectors.SelectDay).click()
    cy.get(StoreLocatorSelectors.SelectHour).type("10:00")
    cy.get(StoreLocatorSelectors.SelectMinutes).type("19:00")

    cy.get(StoreLocatorSelectors.SaveButton).click()
    cy.get(selectors.ToastMsgInB2B).should('be.visible')


  })
}
