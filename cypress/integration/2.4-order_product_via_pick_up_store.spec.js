import { testSetup, updateRetry } from '../support/common/support'
import { pickupTestCase } from '../support/outputvalidation.js'

describe('Test pickup in checkout with one of the pickup points created in 2.2 testcase', () => {
  // Load test setup
  testSetup()

  const { productName, postalCode } = pickupTestCase
  const prefix = 'Pickup In Store'

  it(`${prefix} - Adding product to cart`, updateRetry(2), () => {
    // Search the product
    cy.searchProduct(productName)
    // Add product to cart
    cy.addProduct(productName)
  })

  it(`In ${prefix} - Updating Shipping Information`, updateRetry(2), () => {
    // Update Shipping Section
    cy.updateShippingInformation({ postalCode, pickup: true, timeout: 12000 })
  })

  it(`In ${prefix} - Order the product using promisory`, updateRetry(2), () => {
    cy.orderProduct()
  })
})
