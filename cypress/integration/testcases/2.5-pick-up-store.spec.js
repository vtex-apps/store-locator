import {
  testSetup,
  updateRetry,
  preserveCookie,
} from '../../support/common/support'
import { singleProduct } from '../../support/common/outputvalidation'
import { createPickupPoint } from '../../support/store-locator.apis'
import { testCase1 } from '../../support/store-locator.outputvalidation.js'

describe('Testing Checkout with different scenarios', () => {
  // Load test setup
  testSetup()

  const { productName } = singleProduct
  const { data3 } = testCase1
  const pickupPointId = 'pickupPointId'
  const prefix = 'Pickup In Store'

  createPickupPoint(data3, pickupPointId)

  it(`${prefix} - Adding product,remove product and add product again`, () => {
    // Search the product
    cy.searchProduct(productName)
    // Add product to cart
    cy.addProduct(productName)
  })

  it(`In ${prefix} Updating product quantity to 2`, updateRetry(3), () => {
    // Update Product quantity to 2
    cy.updateProductQuantity(singleProduct, {
      quantity: '2',
    })
  })

  it(`In ${prefix} - Updating Shipping Information`, updateRetry(3), () => {
    // Update Shipping Section
    cy.updateShippingInformation(singleProduct)
  })

  preserveCookie()
})
