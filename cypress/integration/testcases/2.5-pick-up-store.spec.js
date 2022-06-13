import {
  testSetup,
  updateRetry,
  preserveCookie,
} from '../../support/common/support'
import { singleProduct } from '../../support/common/outputvalidation'
import { createPickupPoint } from '../../support/store-locator.apis'
import { testCase1 } from '../../support/store-locator.outputvalidation.js'
import {
  graphql,
  updateShippingPolicy,
} from '../../support/shipping-policy.graphql'
import data from '../../support/shipping-policy.json'

const shippingPolicyId = 'sha1920ede3r'

describe('Testing Checkout with different scenarios', () => {
  // Load test setup
  testSetup()

  const { productName, postalCode } = singleProduct
  const { data3 } = testCase1
  const pickupPointId = 'pickupPointId'
  const prefix = 'Pickup In Store'

  createPickupPoint(data3, pickupPointId)

  it('Add pickup points in shipping policy', () => {
    data.shippingPolicy.pickupPointsSettings.pickupPointIds.push('456789')
    graphql(updateShippingPolicy(shippingPolicyId, data, true), (response) => {
      expect(response.status).to.equal(200)
    })
  })

  it(
    `${prefix} - Adding product,remove product and add product again`,
    updateRetry(3),
    () => {
      // Search the product
      cy.searchProduct(productName)
      // Add product to cart
      cy.addProduct(productName)
    }
  )

  it(`In ${prefix} Updating product quantity to 2`, updateRetry(3), () => {
    // Update Product quantity to 2
    cy.updateProductQuantity(singleProduct, {
      quantity: '2',
    })
  })

  it(`In ${prefix} - Updating Shipping Information`, updateRetry(3), () => {
    // Update Shipping Section
    cy.updateShippingInformation({ postalCode, pickup: true })
  })

  it(`In ${prefix} - Order the product using promisory`, updateRetry(3), () => {
    cy.placeTheProduct()
  })

  it('Remove pickup points in shipping policy', () => {
    data.shippingPolicy.pickupPointsSettings.pickupPointIds = []
    graphql(updateShippingPolicy(shippingPolicyId, data, true), (response) => {
      expect(response.status).to.equal(200)
    })
  })

  preserveCookie()
})
