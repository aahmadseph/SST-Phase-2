// const React = require('react');
// const { shallow } = require('enzyme');

// describe('OrderShippingGroups component', () => {
//     let shallowComponent;
//     let orderData;
//     let compProps;
//     let multipleShippingGroups;
//     let store;
//     let OSG;

//     beforeEach(() => {
//         orderData = {
//             shippingGroups: {
//                 profileStatus: 4,
//                 profileLocale: 'US',
//                 shippingGroupsEntries: [
//                     {
//                         shippingGroupType: 'HardGoodShippingGroup',
//                         shippingGroup: {
//                             shippingGroupId: 'sg20050002',
//                             trackingUrl: 'http: //wwwapps.ups.com/WebTracking/track?track=yes&trackNums=1ZA24W970331665523',
//                             items: [
//                                 {
//                                     status: 'N/A',
//                                     commerceId: 'ci741000008',
//                                     qty: 4,
//                                     listPrice: '$85.00',
//                                     sku: {
//                                         targetUrl: '/coco-mademoiselle-P12495',
//                                         skuId: '513168',
//                                         displayName: '513168 1.7 oz Eau de Parfum Spray',
//                                         listPrice: '$85.00',
//                                         url: 'http://localhost:8080/v1/catalog/products/P12495?preferedSku=513168',
//                                         type: 'Standard',
//                                         isOutOfStock: false,
//                                         isGoingFast: false,
//                                         valuePrice: '($145 value)',
//                                         variationValue: '1.7 oz Eau de Parfum Spray',
//                                         productName: 'COCO MADEMOISELLE Eau de Parfum',
//                                         brandName: '',
//                                         isLimitedEdition: false,
//                                         isActive: true,
//                                         displayText: ' COCO MADEMOISELLE Eau de Parfum',
//                                         actionFlags: {
//                                             isShowEmailMeWhenBackInStore: false,
//                                             isShowChangeEmailMeWhenBackInStore: false,
//                                             isShowAddToMyList: true,
//                                             isShowAlreadyOnMyList: false,
//                                             isShowOrderFullSize: false,
//                                             isAddToBasket: true
//                                         },
//                                         image: 'http://www.sephora.com/productimages/sku/s513168-main-Lthumb.jpg',
//                                         fullSiteProductUrl: 'http://www.sephora.com/coco-mademoiselle-P12495?skuId=513168'
//                                     },
//                                     product: {
//                                         productId: 'P12495',
//                                         displayName: 'COCO MADEMOISELLE Eau de Parfum',
//                                         variationType: 'Size + Concentration + Formulation',
//                                         url: 'http://localhost:8080/v1/catalog/products/P12495'
//                                     },
//                                     itemTotal: '$340.00'
//                                 },
//                                 {
//                                     status: 'N/A',
//                                     commerceId: 'ci741000010',
//                                     qty: 1,
//                                     listPrice: '100 Points',
//                                     sku: {
//                                         targetUrl: '/bi-100-pt-P124402?skuId=1490614',
//                                         skuId: '1490614',
//                                         displayName: '1490614 Viktor & Rolf Flowerbomb ',
//                                         listPrice: '100 Points',
//                                         url: 'http://localhost:8080/v1/catalog/products/P124402?preferedSku=1490614',
//                                         type: 'Standard',
//                                         isOutOfStock: false,
//                                         isGoingFast: false,
//                                         biType: '100 Points',
//                                         variationValue: 'Viktor & Rolf Flowerbomb ',
//                                         productName: 'BI 100 PT',
//                                         brandName: '',
//                                         isLimitedEdition: false,
//                                         isActive: true,
//                                         displayText: ' Flowerbomb',
//                                         fullSizeSku: {
//                                             targetUrl: '/flowerbomb-P255506?skuId=1233147',
//                                             skuId: '1233147',
//                                             displayName: '1233147 1.7 oz Eau de Parfum Spray',
//                                             url: 'http://localhost:8080/v1/catalog/products/P255506?preferedSku=1233147',
//                                             maxPurchaseQuantity: 10,
//                                             type: 'Standard',
//                                             isOutOfStock: false,
//                                             isGoingFast: false,
//                                             isActive: true,
//                                             fullSiteProductUrl: 'http://www.sephora.com/flowerbomb-P255506?skuId=1233147'
//                                         },
//                                         actionFlags: {
//                                             isShowEmailMeWhenBackInStore: false,
//                                             isShowChangeEmailMeWhenBackInStore: false,
//                                             isShowAddToMyList: false,
//                                             isShowAlreadyOnMyList: false,
//                                             isShowOrderFullSize: true,
//                                             isAddToBasket: false
//                                         },
//                                         image: 'http://www.sephora.com/productimages/sku/s1490614-main-Lthumb.jpg',
//                                         fullSiteProductUrl: 'http://www.sephora.com/bi-100-pt-P124402?skuId=1490614'
//                                     },
//                                     product: {
//                                         productId: 'P124402',
//                                         displayName: 'BI 100 PT',
//                                         variationType: 'None',
//                                         url: 'http://localhost:8080/v1/catalog/products/P124402',
//                                         rating: 5,
//                                         reviews: 80
//                                     },
//                                     itemTotal: '$0.00'
//                                 },
//                                 {
//                                     status: 'N/A',
//                                     commerceId: 'ci741000011',
//                                     qty: 1,
//                                     listPrice: '100 Points',
//                                     sku: {
//                                         targetUrl: '/bi-100-pt-P124402?skuId=1498443',
//                                         skuId: '1498443',
//                                         displayName: '1498443 Sephora Collection Pantone Color of the Year Glitter Eyeliner ',
//                                         listPrice: '100 Points',
//                                         url: 'http://localhost:8080/v1/catalog/products/P124402?preferedSku=1498443',
//                                         type: 'Standard',
//                                         isOutOfStock: false,
//                                         isGoingFast: false,
//                                         biType: '100 Points',
//                                         variationValue: 'Sephora Collection Pantone Color of the Year Glitter Eyeliner ',
//                                         productName: 'BI 100 PT',
//                                         brandName: '',
//                                         isLimitedEdition: false,
//                                         isActive: true,
//                                         displayText: ' Glitter Strobe Eyeliner Set',
//                                         actionFlags: {
//                                             isShowEmailMeWhenBackInStore: false,
//                                             isShowChangeEmailMeWhenBackInStore: false,
//                                             isShowAddToMyList: false,
//                                             isShowAlreadyOnMyList: false,
//                                             isShowOrderFullSize: false,
//                                             isAddToBasket: false
//                                         },
//                                         image: 'http://www.sephora.com/productimages/sku/s1498443-main-Lthumb.jpg',
//                                         fullSiteProductUrl: 'http://www.sephora.com/bi-100-pt-P124402?skuId=1498443'
//                                     },
//                                     product: {
//                                         productId: 'P124402',
//                                         displayName: 'BI 100 PT',
//                                         variationType: 'None',
//                                         url: 'http://localhost:8080/v1/catalog/products/P124402',
//                                         rating: 5,
//                                         reviews: 80
//                                     },
//                                     itemTotal: '$0.00'
//                                 },
//                                 {
//                                     status: 'N/A',
//                                     commerceId: 'ci742000001',
//                                     qty: 2,
//                                     listPrice: '$73.00',
//                                     sku: {
//                                         targetUrl: '/repairwear-laser-focus-wrinkle-uv-damage-corrector-P268300?skuId=1359439',
//                                         skuId: '1359439',
//                                         displayName: '1359439 1.7 oz',
//                                         listPrice: '$73.00',
//                                         url: 'http://localhost:8080/v1/catalog/products/P268300?preferedSku=1359439',
//                                         type: 'Standard',
//                                         isOutOfStock: false,
//                                         isGoingFast: false,
//                                         variationType: 'Size',
//                                         variationValue: '1.7 oz',
//                                         productName: 'Repairwear Laser Focus Wrinkle & UV Damage Corrector',
//                                         brandName: '',
//                                         isLimitedEdition: false,
//                                         isActive: true,
//                                         displayText: ' Repairwear Laser Focus Wrinkle & UV Damage Corrector',
//                                         actionFlags: {
//                                             isShowEmailMeWhenBackInStore: false,
//                                             isShowChangeEmailMeWhenBackInStore: false,
//                                             isShowAddToMyList: true,
//                                             isShowAlreadyOnMyList: false,
//                                             isShowOrderFullSize: false,
//                                             isAddToBasket: true
//                                         },
//                                         image: 'http://www.sephora.com/productimages/sku/s1359439-main-Lthumb.jpg',
//                                         fullSiteProductUrl:
//                                             'http://www.sephora.com/repairwear-laser-focus-wrinkle-uv-damage-corrector-P268300?skuId=1359439'
//                                     },
//                                     product: {
//                                         productId: 'P268300',
//                                         displayName: 'Repairwear Laser Focus Wrinkle & UV Damage Corrector',
//                                         variationType: 'Size',
//                                         url: 'http://localhost:8080/v1/catalog/products/P268300',
//                                         rating: 2,
//                                         reviews: 51
//                                     },
//                                     itemTotal: '$146.00'
//                                 }
//                             ],
//                             giftOptions: {
//                                 isComplete: true
//                             },
//                             isComplete: true,
//                             shippingMethod: {
//                                 shippingMethodId: '300004',
//                                 shippingMethodDescription: '(East Coast: 2-5 business days. West Coast: 5-7 business days. Delivery Monday-Friday)',
//                                 shippingFee: '$0.00',
//                                 shippingMethodType: 'Standard Ground',
//                                 isComplete: true
//                             },
//                             address: {
//                                 addressId: '26050000',
//                                 firstName: 'John',
//                                 lastName: 'Braun',
//                                 address1: '3735 Oak Lane',
//                                 city: 'Ashtabula',
//                                 state: 'OH',
//                                 postalCode: '44004',
//                                 country: 'US',
//                                 phone: '4123123123',
//                                 isDefault: true
//                             },
//                             priceInfo: {
//                                 profileStatus: 4,
//                                 profileLocale: 'US',
//                                 merchandiseSubtotal: '$486.00',
//                                 merchandiseShipping: 'FREE',
//                                 totalShipping: 'FREE',
//                                 creditCardAmount: '$517.59',
//                                 orderTotal: '$517.59',
//                                 tax: '$31.59'
//                             }
//                         }
//                     }
//                 ]
//             },
//             paymentGroups: {
//                 profileStatus: 4,
//                 profileLocale: 'US',
//                 paymentGroupsEntries: [
//                     {
//                         paymentGroup: {
//                             paymentGroupId: 'pg20060002',
//                             amount: '$517.59',
//                             isComplete: false,
//                             creditCardId: 'usercc1340001',
//                             firstName: 'Jane',
//                             lastName: 'Smith',
//                             cardType: 'MasterCard',
//                             cardNumber: 'xxxx-xxxx-xxxx-2420',
//                             expirationMonth: '12',
//                             expirationYear: '2020',
//                             address: {
//                                 firstName: 'Jane',
//                                 lastName: 'Smith',
//                                 address1: '1254 Greenbrook Lane',
//                                 address2: '1254 Greenbrook Lane',
//                                 city: 'Hixson',
//                                 state: 'TN',
//                                 postalCode: '37343',
//                                 country: 'US',
//                                 phone: '4237047043',
//                                 extensionNumber: '123'
//                             },
//                             paymentDisplayInfo: 'MasterCard ending in 2420'
//                         },
//                         paymentGroupType: 'CreditCardPaymentGroup'
//                     }
//                 ]
//             },
//             priceInfo: {
//                 profileStatus: 4,
//                 profileLocale: 'US',
//                 merchandiseSubtotal: '$486.00',
//                 merchandiseShipping: 'FREE',
//                 totalShipping: 'FREE',
//                 creditCardAmount: '$517.59',
//                 orderTotal: '$517.59',
//                 tax: '$31.59'
//             },
//             items: {
//                 profileStatus: 4,
//                 profileLocale: 'US',
//                 profileId: '48367000',
//                 basketLevelMessages: [
//                     {
//                         messageContext: 'basket.flashFreeShipping',
//                         messages: ['Enjoy FREE FLASH SHIPPING on every order'],
//                         type: 'message'
//                     }
//                 ],
//                 orderSalesChannel: 'default',
//                 maxSamplesAllowedPerOrder: 3,
//                 items: [
//                     {
//                         status: 'N/A',
//                         modifiable: true,
//                         commerceId: 'ci741000008',
//                         qty: 4,
//                         listPriceSubtotal: '$340.00',
//                         sku: {
//                             targetUrl: '/coco-mademoiselle-P12495',
//                             skuId: '513168',
//                             productId: 'P12495',
//                             displayName: ' COCO MADEMOISELLE Eau de Parfum',
//                             listPrice: '$85.00',
//                             url: 'http://localhost:8080/v1/catalog/products/P12495?preferedSku=513168',
//                             maxPurchaseQuantity: 10,
//                             type: 'Standard',
//                             isOutOfStock: false,
//                             isGoingFast: false,
//                             valuePrice: '($145 value)',
//                             variationValue: '1.7 oz Eau de Parfum Spray',
//                             isHazmat: false,
//                             isProp65: false,
//                             productName: 'COCO MADEMOISELLE Eau de Parfum',
//                             brandName: '',
//                             isLimitedEdition: false,
//                             primaryProduct: {},
//                             isActive: true,
//                             displayText: ' COCO MADEMOISELLE Eau de Parfum',
//                             actionFlags: {
//                                 isShowEmailMeWhenBackInStore: false,
//                                 isShowChangeEmailMeWhenBackInStore: false,
//                                 isShowAddToMyList: true,
//                                 isShowAlreadyOnMyList: false,
//                                 isShowOrderFullSize: false,
//                                 isAddToBasket: true
//                             },
//                             image: 'http://www.sephora.com/productimages/sku/s513168-main-Lthumb.jpg',
//                             skuImages: {
//                                 image62: 'http://www.sephora.com/productimages/sku/s513168-main-Lthumb.jpg',
//                                 image97: 'http://www.sephora.com/productimages/sku/s513168-main-Sgrid.jpg',
//                                 image135: 'http://www.sephora.com/productimages/sku/s513168-main-grid.jpg',
//                                 image250: 'http://www.sephora.com/productimages/sku/s513168-main-hero.jpg',
//                                 image450: 'http://www.sephora.com/productimages/sku/s513168-main-Lhero.jpg'
//                             },
//                             fullSiteProductUrl: 'http://www.sephora.com/coco-mademoiselle-P12495?skuId=513168',
//                             fullSizeProductUrl: 'http://localhost:8080/v1/catalog/products/P273900?preferedSku=1292564'
//                         }
//                     },
//                     {
//                         status: 'N/A',
//                         modifiable: true,
//                         commerceId: 'ci742000001',
//                         qty: 2,
//                         listPriceSubtotal: '$146.00',
//                         sku: {
//                             targetUrl: '/repairwear-laser-focus-wrinkle-uv-damage-corrector-P268300?skuId=1359439',
//                             skuId: '1359439',
//                             productId: 'P268300',
//                             displayName: ' Repairwear Laser Focus Wrinkle & UV Damage Corrector',
//                             listPrice: '$73.00',
//                             url: 'http://localhost:8080/v1/catalog/products/P268300?preferedSku=1359439',
//                             maxPurchaseQuantity: 10,
//                             type: 'Standard',
//                             isOutOfStock: false,
//                             isGoingFast: false,
//                             variationType: 'Size',
//                             variationValue: '1.7 oz',
//                             isHazmat: false,
//                             isProp65: false,
//                             productName: 'Repairwear Laser Focus Wrinkle & UV Damage Corrector',
//                             brandName: '',
//                             isLimitedEdition: false,
//                             primaryProduct: {
//                                 rating: 2,
//                                 reviews: 51
//                             },
//                             isActive: true,
//                             displayText: ' Repairwear Laser Focus Wrinkle & UV Damage Corrector',
//                             actionFlags: {
//                                 isShowEmailMeWhenBackInStore: false,
//                                 isShowChangeEmailMeWhenBackInStore: false,
//                                 isShowAddToMyList: true,
//                                 isShowAlreadyOnMyList: false,
//                                 isShowOrderFullSize: false,
//                                 isAddToBasket: true
//                             },
//                             image: 'http://www.sephora.com/productimages/sku/s1359439-main-Lthumb.jpg',
//                             skuImages: {
//                                 image62: 'http://www.sephora.com/productimages/sku/s1359439-main-Lthumb.jpg',
//                                 image97: 'http://www.sephora.com/productimages/sku/s1359439-main-Sgrid.jpg',
//                                 image135: 'http://www.sephora.com/productimages/sku/s1359439-main-grid.jpg',
//                                 image250: 'http://www.sephora.com/productimages/sku/s1359439-main-hero.jpg',
//                                 image450: 'http://www.sephora.com/productimages/sku/s1359439-main-Lhero.jpg'
//                             },
//                             fullSiteProductUrl: 'http://www.sephora.com/repairwear-laser-focus-wrinkle-uv-damage-corrector-P268300?skuId=1359439'
//                         }
//                     },
//                     {
//                         status: 'N/A',
//                         modifiable: false,
//                         commerceId: 'ci741000010',
//                         qty: 1,
//                         listPriceSubtotal: '100 Points',
//                         sku: {
//                             targetUrl: '/bi-100-pt-P124402?skuId=1490614',
//                             skuId: '1490614',
//                             productId: 'P124402',
//                             displayName: ' Flowerbomb',
//                             listPrice: '100 Points',
//                             maxPurchaseQuantity: 1,
//                             type: 'Standard',
//                             isOutOfStock: false,
//                             isGoingFast: false,
//                             biType: '100 Points',
//                             variationValue: 'Viktor & Rolf Flowerbomb ',
//                             isHazmat: false,
//                             isProp65: false,
//                             productName: 'Flowerbomb',
//                             brandName: '',
//                             isLimitedEdition: false,
//                             primaryProduct: {
//                                 rating: 5,
//                                 reviews: 80
//                             },
//                             isActive: true,
//                             displayText: ' Flowerbomb',
//                             fullSizeSku: {
//                                 targetUrl: '/flowerbomb-P255506?skuId=1233147',
//                                 skuId: '1233147',
//                                 displayName: '1233147 1.7 oz Eau de Parfum Spray',
//                                 url: 'http://localhost:8080/v1/catalog/products/P255506?preferedSku=1233147',
//                                 maxPurchaseQuantity: 10,
//                                 type: 'Standard',
//                                 isOutOfStock: false,
//                                 isGoingFast: false,
//                                 isActive: true,
//                                 fullSiteProductUrl: 'http://www.sephora.com/flowerbomb-P255506?skuId=1233147'
//                             },
//                             actionFlags: {
//                                 isShowEmailMeWhenBackInStore: false,
//                                 isShowChangeEmailMeWhenBackInStore: false,
//                                 isShowAddToMyList: false,
//                                 isShowAlreadyOnMyList: false,
//                                 isShowOrderFullSize: true,
//                                 isAddToBasket: false
//                             },
//                             image: 'http://www.sephora.com/productimages/sku/s1490614-main-Lthumb.jpg',
//                             skuImages: {
//                                 image62: 'http://www.sephora.com/productimages/sku/s1490614-main-Lthumb.jpg',
//                                 image97: 'http://www.sephora.com/productimages/sku/s1490614-main-Sgrid.jpg',
//                                 image135: 'http://www.sephora.com/productimages/sku/s1490614-main-grid.jpg',
//                                 image250: 'http://www.sephora.com/productimages/sku/s1490614-main-hero.jpg',
//                                 image450: 'http://www.sephora.com/productimages/sku/s1490614-main-Lhero.jpg'
//                             },
//                             fullSiteProductUrl: 'http://www.sephora.com/bi-100-pt-P124402?skuId=1490614',
//                             fullSizeProductUrl: 'http://localhost:8080/v1/catalog/products/P255506?preferedSku=1233147'
//                         }
//                     },
//                     {
//                         status: 'N/A',
//                         modifiable: false,
//                         commerceId: 'ci741000011',
//                         qty: 1,
//                         listPriceSubtotal: '100 Points',
//                         sku: {
//                             targetUrl: '/bi-100-pt-P124402?skuId=1498443',
//                             skuId: '1498443',
//                             productId: 'P124402',
//                             displayName: ' Glitter Strobe Eyeliner Set',
//                             listPrice: '100 Points',
//                             maxPurchaseQuantity: 1,
//                             type: 'Standard',
//                             isOutOfStock: false,
//                             isGoingFast: false,
//                             biType: '100 Points',
//                             variationValue: 'Sephora Collection Pantone Color of the Year Glitter Eyeliner ',
//                             isHazmat: false,
//                             isProp65: false,
//                             productName: 'Glitter Strobe Eyeliner Set',
//                             brandName: '',
//                             isLimitedEdition: false,
//                             primaryProduct: {
//                                 rating: 5,
//                                 reviews: 80
//                             },
//                             isActive: true,
//                             displayText: ' Glitter Strobe Eyeliner Set',
//                             actionFlags: {
//                                 isShowEmailMeWhenBackInStore: false,
//                                 isShowChangeEmailMeWhenBackInStore: false,
//                                 isShowAddToMyList: false,
//                                 isShowAlreadyOnMyList: false,
//                                 isShowOrderFullSize: false,
//                                 isAddToBasket: false
//                             },
//                             image: 'http://www.sephora.com/productimages/sku/s1498443-main-Lthumb.jpg',
//                             skuImages: {
//                                 image62: 'http://www.sephora.com/productimages/sku/s1498443-main-Lthumb.jpg',
//                                 image97: 'http://www.sephora.com/productimages/sku/s1498443-main-Sgrid.jpg',
//                                 image135: 'http://www.sephora.com/productimages/sku/s1498443-main-grid.jpg',
//                                 image250: 'http://www.sephora.com/productimages/sku/s1498443-main-hero.jpg',
//                                 image450: 'http://www.sephora.com/productimages/sku/s1498443-main-Lhero.jpg'
//                             },
//                             fullSiteProductUrl: 'http://www.sephora.com/bi-100-pt-P124402?skuId=1498443'
//                         }
//                     }
//                 ],
//                 orderId: '19970002',
//                 itemCount: 8,
//                 subtotal: '$486.00',
//                 availableBiPoints: 486,
//                 redeemedBiPoints: 200,
//                 discountAmount: '$0.00',
//                 messages: ['Enjoy FREE FLASH SHIPPING on every order'],
//                 isPaypalPaymentEnabled: true,
//                 isApplePayEnabled: true
//             },
//             header: {
//                 profileStatus: 4,
//                 profileLocale: 'US',
//                 orderId: '19970002',
//                 shippingGroups: [
//                     {
//                         shippingGroupId: 'sg20050002',
//                         isComplete: true,
//                         shippingMethod: {
//                             shippingMethodId: '300004',
//                             isComplete: true
//                         }
//                     }
//                 ],
//                 paymentGroups: [
//                     {
//                         paymentGroupId: 'pg20060002',
//                         isComplete: false
//                     }
//                 ],
//                 isComplete: false,
//                 isBuyNowOrder: false,
//                 isPlaySubscriptionOrder: false,
//                 profile: {
//                     profileStatus: 4,
//                     profileLocale: 'US',
//                     isComplete: true,
//                     hasSavedPaypal: false,
//                     profileId: '48367000',
//                     lastName: 'Nair',
//                     firstName: 'Sujeeth',
//                     nickName: 'suj',
//                     securityQuestion: 'Your mother\'s maiden name?',
//                     language: 'EN',
//                     login: 'sujeeth.nair@test.com'
//                 },
//                 isPaypalPaymentEnabled: true,
//                 isDisplayRewardCardLabel: true,
//                 isApplePayEnabled: true,
//                 status: 'In Progress',
//                 statusDisplayName: 'In Progress!'
//             },
//             promotion: {
//                 profileStatus: 4,
//                 profileLocale: 'US',
//                 appliedPromotions: [{}]
//             }
//         };
//         compProps = {
//             status: orderData.header.status,
//             statusDisplayName: orderData.header.statusDisplayName,
//             shipGroups: orderData.shippingGroups.shippingGroupsEntries,
//             email: orderData.header.profile.login,
//             paymentGroups: orderData.paymentGroups.paymentGroupsEntries,
//             buttonState: {},
//             isStandardOnly: true
//         };
//         multipleShippingGroups = [
//             {
//                 shippingGroupType: 'HardGoodShippingGroup',
//                 shippingGroup: {
//                     shippingGroupId: 'sg8660001',
//                     status: 'NO_PENDING_ACTION',
//                     isComplete: false,
//                     trackingNumber: '1ZA24W970331665523',
//                     trackingUrl: 'http: //wwwapps.ups.com/WebTracking/track?track=yes&trackNums=1ZA24W970331665523',
//                     shippmentDate: 'December14,               2012',
//                     shippingMethod: {
//                         shippingMethodId: '300004',
//                         shippingMethodDescription: '(Upto3businessdays.DeliveryMonday-Friday)',
//                         shippingFee: 0,
//                         shippingMethodType: 'Standard3Day',
//                         isComplete: true
//                     },
//                     address: {
//                         addressId: '9190000',
//                         firstName: 'John',
//                         lastName: 'Braun',
//                         address1: '3735OakLane',
//                         city: 'Ashtabula',
//                         state: 'OH',
//                         postalCode: '44004',
//                         country: 'US',
//                         phone: '4123123123',
//                         email: 'hg@hg.com',
//                         isDefault: true
//                     },
//                     priceInfo: {
//                         profileStatus: 4,
//                         profileLocale: 'US',
//                         merchandiseSubtotal: '$486.00',
//                         merchandiseShipping: 'FREE',
//                         totalShipping: 'FREE',
//                         creditCardAmount: '$517.59',
//                         orderTotal: '$517.59',
//                         tax: '$31.59'
//                     }
//                 }
//             },
//             {
//                 shippingGroupType: 'GiftCardShippingGroup',
//                 shippingGroup: {
//                     shippingGroupId: 'sg8650001',
//                     status: 'NO_PENDING_ACTION',
//                     trackingNumber: '1ZA24W970331665523',
//                     trackingUrl: 'http: //wwwapps.ups.com/WebTracking/track?track=yes&trackNums=1ZA24W970331665523',
//                     shippmentDate: 'December14, 2012',
//                     shippingMethod: {
//                         shippingMethodId: '600002',
//                         shippingMethodDescription: 'UPSGround',
//                         shippingFee: 0,
//                         shippingMethodType: 'UPSGround'
//                     },
//                     address: {
//                         addressId: '9200000',
//                         firstName: 'John',
//                         lastName: 'Braun',
//                         address1: '525MarketSt',
//                         city: 'SanFrancisco',
//                         state: 'CA',
//                         postalCode: '94105',
//                         country: 'US',
//                         phone: '4151515151',
//                         email: 'gc@gc.com',
//                         isDefault: false
//                     },
//                     giftMessage: 'GiftMessage',
//                     priceInfo: {
//                         profileStatus: 4,
//                         profileLocale: 'US',
//                         merchandiseSubtotal: '$486.00',
//                         merchandiseShipping: 'FREE',
//                         totalShipping: 'FREE',
//                         creditCardAmount: '$517.59',
//                         orderTotal: '$517.59',
//                         tax: '0.0'
//                     }
//                 }
//             }
//         ];

//         store = require('Store').default;

//         spyOn(store, 'getState').and.returnValue({ user: { smsStatus: { isSMSOptInAvailable: true } } });
//     });

//     describe('Banner component', () => {
//         const renderComponent = () => {
//             OSG = require('components/RichProfile/MyAccount/OrderDetail/OrderShippingGroups').default;
//             const wrapper = shallow(<OSG {...compProps} />, { disableLifecycleMethods: true });
//             wrapper.setState({ optInAvailable: true });

//             return wrapper;
//         };

//         it('should render Grid element', () => {
//             //Act
//             const wrapper = renderComponent();

//             // Assert
//             const gridElement = wrapper.find('Grid[display="grid"]');
//             expect(gridElement.exists()).toBe(true);
//         });

//         it('should render Title element', () => {
//             //Act
//             const wrapper = renderComponent();

//             // Assert
//             const textElement = wrapper.find('h4[data-at="status"]');
//             expect(textElement.exists()).toBe(true);
//         });

//         it('should render Subtitle element', () => {
//             //Act
//             const wrapper = renderComponent();

//             // Assert
//             const subtitleElement = wrapper.find('Text[is="div"]');
//             expect(subtitleElement.exists()).toBe(true);
//         });

//         it('should render Link element', () => {
//             //Act
//             const wrapper = renderComponent();

//             // Assert
//             const LinkElement = wrapper.find('Link[display="inline-block"]');
//             expect(LinkElement.exists()).toBe(true);
//         });

//         it('should render Box element', () => {
//             //Act
//             const wrapper = renderComponent();

//             // Assert
//             const BoxElement = wrapper.find('Box[display="block"]');
//             expect(BoxElement.exists()).toBe(true);
//         });

//         it('should render Divider element', () => {
//             //Act
//             const wrapper = renderComponent();

//             // Assert
//             const dividerElement = wrapper.find('Divider');
//             expect(dividerElement.exists()).toBe(true);
//         });
//     });

//     describe('Components Render', () => {
//         let OrderItemListComp;
//         let OrderTotalComp;
//         let AddressComp;

//         beforeEach(() => {
//             OSG = require('components/RichProfile/MyAccount/OrderDetail/OrderShippingGroups').default;
//         });

//         it('should render Order Item List component', () => {
//             // Arrange
//             const shipGroupLength = compProps.shipGroups.length;

//             // Act
//             shallowComponent = shallow(<OSG {...compProps} />, { disableLifecycleMethods: true });

//             // Assert
//             OrderItemListComp = shallowComponent.find('OrderItemList');
//             expect(OrderItemListComp.length).toBe(shipGroupLength);
//         });

//         it('should render Order Total component', () => {
//             // Arrange
//             const shipGroupLength = compProps.shipGroups.length;

//             // Act
//             shallowComponent = shallow(<OSG {...compProps} />, { disableLifecycleMethods: true });

//             // Assert
//             OrderTotalComp = shallowComponent.find('ErrorBoundary(Connect(OrderTotal))');
//             expect(OrderTotalComp.length).toBe(shipGroupLength);
//         });

//         it('should render the Address component', () => {
//             // Arrange
//             const result = compProps.shipGroups.length + compProps.paymentGroups.length;

//             // Act
//             shallowComponent = shallow(<OSG {...compProps} />, { disableLifecycleMethods: true });

//             // Assert
//             AddressComp = shallowComponent.find('Address');
//             // Shipping + Billing
//             expect(AddressComp.length).toBe(result);
//         });

//         it('should render shipping status for non split orders', () => {
//             // Arrange
//             compProps.statusDisplayName = 'In Progress!';

//             // Act
//             shallowComponent = shallow(<OSG {...compProps} />, { disableLifecycleMethods: true });

//             // Assert
//             shallowComponent = shallowComponent.find('OrderStatusDisplayName');
//             expect(shallowComponent.exists()).toEqual(true);
//         });

//         it('should render shipping status for split orders with returned status', () => {
//             // Arrange
//             compProps.status = 'Returned and Paid';

//             // Act
//             shallowComponent = shallow(<OSG {...compProps} />, { disableLifecycleMethods: true });

//             // Assert
//             shallowComponent = shallowComponent.find('OrderStatusDisplayName');
//             expect(shallowComponent.exists()).toEqual(true);
//         });

//         it('should not render shipping status for split orders with active status', () => {
//             // Arrange
//             compProps.splitOrder = true;
//             compProps.status = 'Active';

//             // Act
//             shallowComponent = shallow(<OSG {...compProps} />, { disableLifecycleMethods: true });

//             // Assert
//             shallowComponent = shallowComponent.find('OrderStatusDisplayName');
//             expect(shallowComponent.exists()).toEqual(false);
//         });

//         it('should not render shipping status for split orders with delivered status', () => {
//             // Arrange
//             compProps.splitOrder = true;
//             compProps.status = 'Delivered';

//             // Act
//             shallowComponent = shallow(<OSG {...compProps} />, { disableLifecycleMethods: true });

//             // Assert
//             shallowComponent = shallowComponent.find('OrderStatusDisplayName');
//             expect(shallowComponent.exists()).toEqual(false);
//         });
//     });

//     describe('Components Render Cancel Order Link', () => {
//         let CancelLink;

//         it('should not render it if Self-Cancelation disabled', () => {
//             // Arrange
//             const OrderShippingGroups = require('components/RichProfile/MyAccount/OrderDetail/OrderShippingGroups').default;
//             compProps.renderSelfCancelationLink = undefined;

//             // Act
//             shallowComponent = shallow(<OrderShippingGroups {...compProps} />, { disableLifecycleMethods: true });

//             // Assert
//             CancelLink = shallowComponent.find('#cancelOrderLink');
//             expect(CancelLink.length).toBe(0);
//         });

//         it('should render it if Self-Cancelation enabled', () => {
//             // Arrange
//             const OrderShippingGroups = require('components/RichProfile/MyAccount/OrderDetail/OrderShippingGroups').default;
//             compProps.renderSelfCancelationLink = () => <div id={'cancelOrderLink'} />;

//             // Act
//             shallowComponent = shallow(<OrderShippingGroups {...compProps} />, { disableLifecycleMethods: true });

//             // Assert
//             CancelLink = shallowComponent.find('#cancelOrderLink');
//             expect(CancelLink.length).toBe(1);
//         });
//     });

//     describe('Components Render with more than one shipping group', () => {
//         let shipGroupLength;

//         beforeEach(() => {
//             shipGroupLength = multipleShippingGroups.length;
//             compProps.shipGroups = multipleShippingGroups;
//             const OrderShippingGroups = require('components/RichProfile/MyAccount/OrderDetail/OrderShippingGroups').default;
//             shallowComponent = shallow(<OrderShippingGroups {...compProps} />);
//         });

//         it('should render Order Item List component', () => {
//             const OrderItemListComp = shallowComponent.find('OrderItemList');
//             expect(OrderItemListComp.length).toBe(shipGroupLength);
//         });

//         it('should render Order Total component', () => {
//             const OrderTotalComp = shallowComponent.find('ErrorBoundary(Connect(OrderTotal))');
//             expect(OrderTotalComp.length).toBe(shipGroupLength);
//         });

//         it('should render the Address component', () => {
//             const paymentGroupsLength = compProps.paymentGroups.length;
//             // Shipping + Billing
//             const AddressComp = shallowComponent.find('Address');
//             expect(AddressComp.length).toBe(shipGroupLength + paymentGroupsLength);
//         });
//     });

//     describe('Do not render address if it is not available', () => {
//         it('should not render the Address component', () => {
//             // Arrange
//             const OrderShippingGroups = require('components/RichProfile/MyAccount/OrderDetail/OrderShippingGroups').default;
//             const compPropsCopy = { ...compProps };
//             delete compPropsCopy.shipGroups[0].shippingGroup.address;

//             // Act
//             shallowComponent = shallow(<OrderShippingGroups {...compPropsCopy} />);

//             // Assert
//             const AddressComp = shallowComponent.find('Address');
//             const paymentGroupsLength = compProps.paymentGroups.length;
//             // Only render billing adresses
//             expect(AddressComp.length).toBe(paymentGroupsLength);
//         });
//     });

//     describe('When shippingGroup address is of type HAL', () => {
//         let PickupPerson;
//         let compPropsCopy2;

//         beforeEach(() => {
//             const OrderShippingGroups = require('components/RichProfile/MyAccount/OrderDetail/OrderShippingGroups').default;
//             const halAddress = {
//                 addressType: 'HAL',
//                 isDefault: false
//             };
//             compPropsCopy2 = { ...compProps };
//             compPropsCopy2.shipGroups = [multipleShippingGroups[0]];
//             compPropsCopy2.shipGroups[0].shippingGroup.address = {
//                 ...compProps.shipGroups[0].shippingGroup.address,
//                 ...halAddress
//             };
//             shallowComponent = shallow(<OrderShippingGroups {...compPropsCopy2} />);
//             PickupPerson = shallowComponent.find('PickupPerson');
//         });

//         it('should display a "Shipping to FedEx Location" label', () => {
//             const { getLocaleResourceFile } = require('utils/LanguageLocale').default;
//             const getText = getLocaleResourceFile('components/RichProfile/MyAccount/OrderDetail/locales', 'OrderShippingGroups');
//             const Text = shallowComponent.findWhere(n => n.name() === 'Text' && n.contains(getText('shipToFeDexLocation')));
//             expect(Text.length).toEqual(1);
//         });

//         it('should render a PickupPerson component', () => {
//             expect(PickupPerson.length).toBe(1);
//         });

//         it('PickupPerson should receive firstName, lastName (inside address object), and isOrderDetail with the correct values', () => {
//             const { firstName, lastName } = compPropsCopy2.shipGroups[0].shippingGroup.address;

//             expect(PickupPerson.props().address.firstName).toBe(firstName);
//             expect(PickupPerson.props().address.lastName).toBe(lastName);
//             expect(PickupPerson.props().isOrderDetail).toBeTrue();
//         });
//     });
// });
