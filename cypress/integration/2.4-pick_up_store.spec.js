import { testSetup, updateRetry } from '../support/common/support'
import { testCase1 } from '../support/store-locator.outputvalidation.js'

describe('Test pickup in checkout with one of the pickup points created in 2.1', () => {
  // Load test setup
  testSetup()

  const { productName, postalCode } = testCase1
  const prefix = 'Pickup In Store'

  it(
    `${prefix} - Adding product,remove product and add product again`,
    updateRetry(2),
    () => {
      // Search the product
      cy.searchProduct(productName)
      // Add product to cart
      cy.addProduct(productName)
    }
  )

  it(`In ${prefix} - Updating Shipping Information`, updateRetry(2), () => {
    // Update Shipping Section
    cy.updateShippingInformation({ postalCode, pickup: true, timeout: 8000 })
  })

  it(`In ${prefix} - Order the product using promisory`, updateRetry(2), () => {
    cy.ordertheProduct()
  })
})
