import {
  testSetup,
  updateRetry,
  preserveCookie,
} from '../../support/common/support'
import { testCase1 } from '../../support/store-locator.outputvalidation.js'

describe('Testing Checkout with different scenarios', () => {
  // Load test setup
  testSetup()

  const { productName, postalCode } = testCase1
  const prefix = 'Pickup In Store'

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

  it(`In ${prefix} - Updating Shipping Information`, updateRetry(3), () => {
    // Update Shipping Section
    cy.updateShippingInformation({ postalCode, pickup: true })
  })

  it(`In ${prefix} - Order the product using promisory`, updateRetry(3), () => {
    cy.ordertheProduct()
  })

  preserveCookie()
})
