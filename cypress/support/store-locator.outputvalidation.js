const TESTCASE = {
  testCase1: 'testCase1',
}

export default {
  testCase1: {
    title: 'Enable Anonymous review with no admin approval',
    productId: 880030,
    configuration: {
      allowAnonymousReviews: true,
      requireApproval: false,
      defaultStarsRating: '3',
    },
    data1: {
      address: {
        country: {
          acronym: 'IND',
          name: 'INDIA',
        },
        location: {
          latitude: -22.974477767944336,
          longitude: -43.18672561645508,
        },
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
      name: 'Puma',
      description: 'do it',
      instructions: 'do it properly',
      formatted_address: 'undefined',
      isActive: true,
    },

    data2: {
      address: {
        country: {
          acronym: 'CAN',
          name: 'CANADA',
        },
        location: {
          latitude: -22.974477767944336,
          longitude: -43.18672561645508,
        },
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
      name: 'Walmart',
      description: 'do it',
      instructions: 'do it properly',
      formatted_address: 'undefined',
      isActive: true,
    },
  },
}
