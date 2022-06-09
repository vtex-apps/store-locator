import {
  testSetup,
  updateRetry,
  preserveCookie,
} from '../../support/common/support'
import { singleProduct } from '../../support/common/outputvalidation'
import { createPickupPoint } from '../../support/store-locator.apis'
import { testCase1 } from '../../support/store-locator.outputvalidation.js'
import { linkPickupPointToShippingPolicy } from '../../support/storelocator.common'

describe('Testing Checkout with different scenarios', () => {
  // Load test setup
  testSetup()

  const { productName, postalCode } = singleProduct
  const { data3 } = testCase1
  const pickupPointId = 'pickupPointId'
  const prefix = 'Pickup In Store'

  createPickupPoint(data3, pickupPointId)

  linkPickupPointToShippingPolicy(data3.name, true)

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
    cy.updatePickupInStoreShippingInformation(postalCode, data3)
  })

  linkPickupPointToShippingPolicy(data3.name, false)

  preserveCookie()
})
