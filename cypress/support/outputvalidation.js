import { PRODUCTS } from './common/utils.js'

function generatePickupPoint(pickupPointName) {
  return {
    address: {
      country: {
        acronym: 'CAN',
        name: 'CANADA',
      },
      location: {},
      postalCode: '600079',
      city: 'TORONTO',
      state: 'ONTARIO',
      neighborhood: 'BOTAFOGO',
      street: '92 Rue de Strasbourg',
      number: '10025698',
      complement: '3 RD FLOOR',
      reference: 'GREY BUILDING',
    },
    businessHours: [
      {
        dayOfWeek: 1,
        openingTime: '08:00:00',
        closingTime: '20:00:00',
      },
    ],
    id: '45678',
    name: pickupPointName,
    description: 'do it',
    instructions: 'do it properly',
    formatted_address: 'undefined',
    isActive: true,
  }
}

// NOTE: pickup point name should starts with pickup example

export default {
  restAPITestCase: {
    pickupPoint1Payload: {
      address: {
        country: {
          acronym: 'IND',
          name: 'INDIA',
        },
        location: {},
        postalCode: '600077',
        city: 'france',
        state: 'TAMILNADU',
        neighborhood: 'BOTAFOGO',
        street: '92 Rue de Strasbourg',
        number: '10025698',
        complement: '3 RD FLOOR',
        reference: 'GREY BUILDING',
      },
      businessHours: [
        {
          dayOfWeek: 1,
          openingTime: '08:00:00',
          closingTime: '20:00:00',
        },
      ],
      id: '45678',
      name: 'pickup example puma',
      description: 'do it',
      instructions: 'do it properly',
      formatted_address: 'undefined',
      isActive: true,
    },
    pickupPoint2Payload: generatePickupPoint('pickup example walmart'),
    /*
     pickupPoint1 is created in cypress/integration/2.1.2-rest_graphql_apis.spec.js
     & in same testcase it is been replaced with pickupPoint2
    */
    pickupPoint3Payload: generatePickupPoint('pickup example adidas'),
    /*
    pickupPoint3 is created in cypress/integration/2.1.2-rest_graphql_apis.spec.js
    & will make it inactive in cypress/integration/2.5-inactive_pickup_scenarios.spec.js
    */
  },

  pickupTestCase: {
    productName: PRODUCTS.coconut,
    postalCode: '94536',
    // This pickup will be created in cypress/integration/2.2.2-add_multiple_pickup_points.spec.js
    // & it will be used in cypress/integration/2.4-order_product_via_pick_up_store.spec.js
    pickupPointName: 'pickup example reebok',
  },
}
