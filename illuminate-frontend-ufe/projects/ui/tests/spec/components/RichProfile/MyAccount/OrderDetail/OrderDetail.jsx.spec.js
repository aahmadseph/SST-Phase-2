const React = require('react');
const { shallow } = require('enzyme');
const processEvent = require('analytics/processEvent').default;
const anaConsts = require('analytics/constants').default;
const OrderDetail = require('components/RichProfile/MyAccount/OrderDetail/OrderDetail').default;

const state = {
    paymentGroups: {
        paymentGroupsEntries: [
            {
                paymentGroup: {
                    address: {
                        address1: 'Peep po',
                        city: 'Beverly Hills',
                        country: 'US',
                        firstName: 'Óscar02',
                        lastName: 'So',
                        phone: '3242342342',
                        postalCode: '90210',
                        state: 'CA'
                    },
                    amount: '$796.91',
                    cardNumber: 'xxxx-xxxx-xxxx-7681',
                    cardType: 'American Express',
                    creditCardId: 'usercc9020430001',
                    expirationMonth: '12',
                    expirationYear: '2025',
                    firstName: 'Óscar02',
                    lastName: 'So',
                    paymentDisplayInfo: 'American Express ending in 7681',
                    paymentGroupId: 'pg30079946831'
                },
                paymentGroupType: 'CreditCardPaymentGroup'
            }
        ],
        profileLocale: 'US',
        profileStatus: 4
    },
    hasInitialized: true,
    priceInfo: {
        creditCardAmount: '$42.22',
        merchandiseSubtotal: '$39.00',
        orderTotal: '$42.22',
        profileLocale: 'US',
        profileStatus: 4,
        tax: '$3.22'
    },
    shippingGroups: { shipping: false },
    header: {
        creditCardImage: '/contentimages/creditcard/cardicon/2019-04-01-sephora-cc-icon-d-us-ca-slice.jpg',
        hasValidProfileAddresses: false,
        hasValidProfileCreditCards: false,
        isBuyNowOrder: false,
        isDisplayRewardCardLabel: true,
        isGuestCheckoutEnabled: false,
        isGuestOrder: false,
        isPlaySubscriptionOrder: false,
        isReturnLinkEnabled: false,
        isRopisOrder: true,
        isSelfCancellationLinkEnabled: true,
        orderDate: 'October 19, 2020',
        orderId: '20090982631',
        orderLocale: 'US',
        profile: {
            beautyInsiderAccount: {
                biAccountId: '5000000013305384',
                birthDay: '7',
                birthMonth: '10',
                birthYear: '1986'
            },
            firstName: 'FNOuxjMbuJ',
            hasSavedPaypal: false,
            isComplete: true,
            language: 'EN',
            lastName: 'LNfqFubdjc',
            login: '2020.18_fcf4c18f_auto@yopmail.com',
            profileId: '20149363806',
            profileLocale: 'US',
            profileStatus: 4
        },
        profileLocale: 'US',
        profileStatus: 4,
        ropisDigitalOrderId: 'RP-20090982631',
        selfCancellationReasonCodes: {
            otherReasonCode: '50',
            reasonCodes: [
                {
                    description: 'I want to modify my order',
                    reasonCode: '41'
                },
                {
                    description: 'I no longer need this item',
                    reasonCode: '42'
                },
                {
                    description: 'I needed this sooner than expected',
                    reasonCode: '43'
                },
                {
                    description: 'Some of my items are not available',
                    reasonCode: '44'
                },
                {
                    description: 'I ordered by accident',
                    reasonCode: '45'
                },
                {
                    description: 'I wanted samples, promo, or discounts applied',
                    reasonCode: '46'
                },
                {
                    description: 'Other',
                    reasonCode: '50'
                }
            ]
        },
        splitOrder: false,
        status: 'Ready for Pickup',
        statusDisplayName: 'Ready for Pickup'
    },
    pickup: {
        email: '2020.18_fcf4c18f_auto@yopmail.com',
        firstname: 'FNOuxjMbuJ',
        items: [
            {
                commerceId: 'ci903946000341',
                itemTotal: '$39.00',
                listPrice: '$39.00',
                product: {
                    displayName: 'Diamond Bomb All-Over Diamond Veil',
                    productId: 'P85225585',
                    rating: 4.75,
                    reviews: 4,
                    url: 'http://10.187.67.25:80/v1/catalog/products/P85225585',
                    variationType: 'Color',
                    variationTypeDisplayName: 'Color'
                },
                qty: 1,
                sku: {
                    actionFlags: {
                        backInStockReminderStatus: 'notApplicable',
                        isAddToPickupBasket: true,
                        isFullSizeSkuOrderable: false,
                        isReservationNotOffered: false,
                        myListStatus: 'notAdded'
                    },
                    brandId: '6200',
                    brandName: 'FENTY BEAUTY by Rihanna',
                    displayName: '2113033 How Many Carats?!',
                    displayText: 'FENTY BEAUTY by Rihanna Diamond Bomb All-Over Diamond Veil',
                    fullSiteProductUrl: 'https://qa4.sephora.com/product/diamond-bomb-all-over-diamond-veil-P85225585?skuId=2113033',
                    image: '/productimages/sku/s2113033-main-Lthumb.jpg',
                    isActive: true,
                    isGoingFast: false,
                    isLimitedEdition: false,
                    isOutOfStock: false,
                    listPrice: '$39.00',
                    productName: 'Diamond Bomb All-Over Diamond Veil',
                    size: '0.28 oz/ 8 g',
                    skuId: '2113033',
                    skuImages: {
                        image135: '/productimages/sku/s2113033-main-grid.jpg',
                        image162: '/productimages/sku/s2113033-162.jpg',
                        image250: '/productimages/sku/s2113033-main-hero.jpg',
                        image450: '/productimages/sku/s2113033-main-Lhero.jpg',
                        image62: '/productimages/sku/s2113033-main-Lthumb.jpg',
                        image97: '/productimages/sku/s2113033-main-Sgrid.jpg'
                    },
                    targetUrl: '/product/diamond-bomb-all-over-diamond-veil-P85225585',
                    type: 'Standard',
                    typeDisplayName: 'Standard',
                    url: 'http://10.187.67.25:80/v1/catalog/products/P85225585?preferedSku=2113033',
                    variationType: 'Color',
                    variationTypeDisplayName: 'Color',
                    variationValue: 'How Many Carats?!'
                },
                status: 'Reserved'
            }
        ],
        lastName: 'LNfqFubdjc',
        pickupOrderHoldDaysMessage: 'The store will hold your items for 3 days after you place your reservation.',
        pickupOrderNotifyWithinMessage: 'We’ll notify you via email when your order is ready for pickup, usually within 2 hours.',
        pickupOrderStates: [
            {
                state: 'Preparing Your Order',
                status: 'completed'
            },
            {
                state: 'Ready for Pickup at Houston Galleria Mall',
                stateMessages: [
                    {
                        message: 'We’ll hold your order until **7:00PM on Fri, October 23** (3 days)'
                    },
                    {
                        message:
                            'Upon arrival, notify the line coordinator at the door that you’re picking up an order, and you will receive priority store access through the Fast Track line.'
                    }
                ],
                status: 'active'
            },
            {
                state: 'Order Picked Up',
                status: 'pending'
            }
        ],
        pickupWindow: 'Tue, October 20, 2020, 2:29 AM to Fri, October 23, 2020, 7:00PM (3 days)',
        profileLocale: 'US',
        profileStatus: 4,
        pickupMethods: [
            {
                isSelected: false,
                pickupMethodDescription: 'In-Store Pickup',
                pickupMethodId: '0'
            }
        ],
        storeDetails: {
            address: {
                address1: '5015 Westheimer',
                address2: 'Suite 2380',
                city: 'Houston',
                country: 'US',
                crossStreet: 'Westheimer Road & South Post Oak Boulevard',
                fax: '',
                mallName: 'Inside the Houston Galleria Mall',
                phone: '(713) 961-3580',
                postalCode: '77056',
                state: 'TX'
            },
            content: {
                regions: {
                    curbsideInstructionTab: [
                        {
                            componentName: 'Sephora Unified Markdown Component',
                            componentType: 57,
                            contentType: 'PlainText',
                            enableTesting: false,
                            name: 'curbside_pickup_instructions',
                            text: '*Curbside pickup instructions*\n\nSephora Powell Street\n\nLocation-specific information and instructions like where to park, when to contact the store, how to contact the store, and what to do if you want to pick up in store instead.\n\n- List item information about parking\n- List item information about calling store\n- List item information about another thing\n- List item instruction or information\n'
                        }
                    ],
                    curbsideMapImageTab: [
                        {
                            componentName: 'Sephora Unified Image Component',
                            componentType: 53,
                            enableTesting: false,
                            height: '325',
                            imageId: '11830003',
                            imagePath: 'https://via.placeholder.com/578x325/FFF/808080',
                            name: 'curbside_pickup_map',
                            width: '578'
                        }
                    ]
                }
            },
            displayName: 'Houston Galleria Mall',
            distance: 0,
            isRopisable: true,
            isBopisable: true,
            isCurbsideEnabled: true,
            latitude: 29.739,
            longitude: -95.464,
            seoCanonicalUrl: '/happening/stores/houston-galleria-mall',
            storeHours: {
                closedDays:
                    'For the health and safety of our clients and associates, store hours may vary. Call your local store for operating hours.',
                fridayHours: '11:00AM-7:00PM',
                mondayHours: '11:00AM-7:00PM',
                saturdayHours: '11:00AM-7:00PM',
                sundayHours: '12:00PM-6:00PM',
                textColor: 'Black',
                thursdayHours: '11:00AM-7:00PM',
                timeZone: 'CST',
                tuesdayHours: '11:00AM-7:00PM',
                wednesdayHours: '11:00AM-7:00PM'
            },
            storeId: '0066',
            targetUrl: '/happening/stores/houston-galleria-mall'
        }
    },
    items: {
        availableBiPoints: 350,
        currency: 'USD',
        estimatedTax: '$3.22',
        estimatedTotal: '$42.22',
        isApplePayEnabled: false,
        isGuestCheckoutEnabled: false,
        isKlarnaCheckoutEnabled: false,
        isMaxCCRewardsLimitReached: false,
        isPaypalPaymentEnabled: false,
        itemCount: 1,
        items: [
            {
                commerceId: 'ci903946000341',
                listPriceSubtotal: '$39.00',
                modifiable: true,
                qty: 1,
                sku: {
                    actionFlags: {
                        backInStockReminderStatus: 'notApplicable',
                        isAddToPickupBasket: true,
                        isFullSizeSkuOrderable: false,
                        isReservationNotOffered: false,
                        myListStatus: 'notAdded'
                    },
                    brandId: '6200',
                    brandName: 'FENTY BEAUTY by Rihanna',
                    displayName: 'FENTY BEAUTY by Rihanna Diamond Bomb All-Over Diamond Veil',
                    displayText: 'FENTY BEAUTY by Rihanna Diamond Bomb All-Over Diamond Veil',
                    fullSiteProductUrl: 'https://qa4.sephora.com/product/diamond-bomb-all-over-diamond-veil-P85225585?skuId=2113033',
                    image: '/productimages/sku/s2113033-main-Lthumb.jpg',
                    isActive: true,
                    isFinalSale: false,
                    isGoingFast: false,
                    isLimitedEdition: false,
                    isOnlyFewLeft: false,
                    isOutOfStock: false,
                    listPrice: '$39.00',
                    maxPurchaseQuantity: 10,
                    parentCategory: {
                        categoryId: 'cat60020',
                        displayName: 'Highlighter',
                        parentCategory: {
                            categoryId: 'cat130058',
                            displayName: 'Face',
                            parentCategory: {
                                categoryId: 'cat140006',
                                displayName: 'Makeup',
                                targetUrl: '/shop/makeup-cosmetics',
                                url: 'http://10.187.67.25:80/v1/catalog/categories/cat140006'
                            },
                            targetUrl: '/shop/face-makeup',
                            url: 'http://10.187.67.25:80/v1/catalog/categories/cat130058'
                        },
                        targetUrl: '/shop/luminizer-luminous-makeup',
                        url: 'http://10.187.67.25:80/v1/catalog/categories/cat60020/products?sortBy=-1&currentPage=1&content=true'
                    },
                    primaryProduct: {
                        rating: 4.75,
                        reviews: 4
                    },
                    productId: 'P85225585',
                    productName: 'Diamond Bomb All-Over Diamond Veil',
                    size: '0.28 oz/ 8 g',
                    skuId: '2113033',
                    skuImages: {
                        image135: '/productimages/sku/s2113033-main-grid.jpg',
                        image162: '/productimages/sku/s2113033-162.jpg',
                        image250: '/productimages/sku/s2113033-main-hero.jpg',
                        image450: '/productimages/sku/s2113033-main-Lhero.jpg',
                        image62: '/productimages/sku/s2113033-main-Lthumb.jpg',
                        image97: '/productimages/sku/s2113033-main-Sgrid.jpg'
                    },
                    targetUrl: '/product/diamond-bomb-all-over-diamond-veil-P85225585',
                    type: 'Standard',
                    typeDisplayName: 'Standard',
                    url: 'http://10.187.67.25:80/v1/catalog/products/P85225585?preferedSku=2113033',
                    variationType: 'Color',
                    variationTypeDisplayName: 'Color',
                    variationValue: 'How Many Carats?!'
                },
                status: 'In Progress'
            }
        ],
        netBeautyBankPointsAvailable: 350,
        orderId: '20090982631',
        orderSalesChannel: 'api',
        pickupMessage: 'Reserve today, ready tomorrow',
        pickupOrderNotificationMsg: 'Pickup orders are typically ready within 2 hours, and will be held for 3 days after you place your reservation.',
        potentialBeautyBankPoints: 389,
        profileId: '20149363806',
        profileLocale: 'US',
        profileStatus: 4,
        rawSubTotal: '$39.00',
        redeemedBiPoints: 0,
        showPaypalPopUp: false,
        storeDetails: {
            address: {
                address1: '33 Powell Street',
                address2: '',
                city: 'San Francisco',
                country: 'US',
                crossStreet: 'Powell & Market Streets',
                fax: '',
                mallName: '',
                phone: '(415) 362-9360',
                postalCode: '94102',
                state: 'CA'
            },
            displayName: 'Powell Street',
            distance: 0,
            isRopisable: true,
            latitude: 37.785,
            longitude: -122.408,
            seoCanonicalUrl: '/happening/stores/san-francisco-powell-street',
            storeHours: {
                closedDays:
                    'For the health and safety of our clients and associates, store hours may vary. Call your local store for operating hours.',
                fridayHours: '11:00AM-7:00PM',
                mondayHours: '11:00AM-7:00PM',
                saturdayHours: '11:00AM-7:00PM',
                sundayHours: '12:00PM-6:00PM',
                textColor: 'Black',
                thursdayHours: '11:00AM-7:00PM',
                timeZone: 'PST8PDT',
                tuesdayHours: '11:00AM-7:00PM',
                wednesdayHours: '11:00AM-7:00PM'
            },
            storeId: '0058',
            targetUrl: '/happening/stores/san-francisco-powell-street'
        },
        subtotal: '$39.00'
    },
    promotion: {
        appliedPromotions: [],
        profileLocale: 'US',
        profileStatus: 4
    },
    responseStatus: 200,
    isPickedUp: false,
    isCanceledRopisOrder: false,
    isProcessing: false,
    isReadyToPickUp: true,
    showBarcode: true
};

xdescribe('My Account Order Details Component', () => {
    let shallowComponent;
    const OrderData = {
        orderData: {
            shippingGroups: { shippingGroupsEntries: [] },
            paymentGroups: { paymentGroupsEntries: [] },
            header: {
                orderDate: 'somedate',
                profile: { login: 'someemail' },
                status: 'In Progress',
                orderId: 'someorderid',
                label: 'order label'
            }
        }
    };

    describe('data-at attributes for barcode', () => {
        let wrapper;
        beforeEach(() => {
            wrapper = shallow(<OrderDetail />);
            wrapper.setState(state);
        });

        it('should show correct data-at for showPickupParcode', () => {
            const component = wrapper.instance();
            const modal = shallow(component.renderBarcodeModal('1234'));
            const showPickupElement = modal.findWhere(n => n.prop('data-at') === 'show_pickup_barcode');

            expect(showPickupElement.exists()).toBe(true);
        });

        it('should show correct data-at for pickupOrderNumber', () => {
            const component = wrapper.instance();
            const modal = shallow(component.renderBarcodeModal('1234'));
            const PickupOrderNumberElement = modal.findWhere(n => n.prop('data-at') === 'pickup_order_number');

            expect(PickupOrderNumberElement.exists()).toBe(true);
        });
    });

    xdescribe('Components', () => {
        let shippingGroupComp;

        beforeEach(() => {
            shallowComponent = shallow(<OrderDetail />);
            shallowComponent.setState(OrderData);
            shippingGroupComp = shallowComponent.find('OrderShippingGroups');
        });

        it('should render the shipping group comp', () => {
            expect(shippingGroupComp.length).toBe(1);
        });
    });

    describe('No Order Data', () => {
        let shippingGroupComp;
        let TextComp;

        beforeEach(() => {
            shallowComponent = shallow(<OrderDetail />);
            shallowComponent.setState({});
            shippingGroupComp = shallowComponent.find('OrderShippingGroups');
            TextComp = shallowComponent.find('Text');
        });

        it('should not render the shipping group comp', () => {
            expect(shippingGroupComp.length).toBe(0);
        });

        it('should not render the Text component inside order data', () => {
            expect(TextComp.length).toBe(1);
        });
    });

    xdescribe('Elements within Order Details Comp', () => {
        let textWrapperlist;
        let handleViewOrderHistoryClickSpy;

        beforeEach(() => {
            shallowComponent = shallow(<OrderDetail orderId='someorderid' />);
            shallowComponent.setState(OrderData);
            handleViewOrderHistoryClickSpy = spyOn(shallowComponent.instance(), 'handleViewOrderHistoryClick');
            textWrapperlist = shallowComponent.find('Text');
        });

        it('should render the order history link', () => {
            expect(shallowComponent.find('[children="View complete order history"]').length).toEqual(1);
        });

        it('should render the order number', () => {
            expect(textWrapperlist.find('[children="Order number: someorderid"]').length).toEqual(1);
        });

        it('should render the order date', () => {
            const orderDate = shallowComponent
                .findWhere(n => n.prop('data-at') === 'order_date')
                .children()
                .text();
            expect(orderDate).toEqual('somedate');
        });

        it('should render data-at attribute set to "ropis_original_reservation_message"', () => {
            const dataAt = shallowComponent.findWhere(n => n.prop('data-at') === 'ropis_original_reservation_message');
            expect(dataAt.length).toEqual(1);
        });

        it('should render data-at attribute set to "error_icon"', () => {
            const dataAt = shallowComponent.findWhere(n => n.prop('data-at') === 'error_icon');
            expect(dataAt.length).toEqual(1);
        });

        it('should render the order detail', () => {
            expect(textWrapperlist.find('[children="Order Detail"]').length).toEqual(1);
        });

        it('should call view order history click function', () => {
            shallowComponent.find('[children="View complete order history"]').simulate('click');
            expect(handleViewOrderHistoryClickSpy).toHaveBeenCalled();
        });

        it('should render the order label with correct text if it exists', () => {
            const orderLabel = shallowComponent
                .findWhere(n => n.prop('data-at') === 'instagram_order')
                .children()
                .text();
            expect(orderLabel).toEqual('order label');
        });
    });

    describe('Curbside Pickup Instructions', () => {
        let wrapper;
        let curbsideState;

        beforeEach(() => {
            curbsideState = {
                ...state,
                pickup: {
                    ...state.pickup,
                    storeDetails: { ...state.pickup.storeDetails }
                }
            };
        });

        it('should render when BOPIS is enabled and store isBopisable and isCurbsideEnabled', () => {
            Sephora.configurationSettings.isBOPISEnabled = true;
            wrapper = shallow(<OrderDetail />).setState(curbsideState);

            const curbsideInstructions = wrapper.findWhere(n => n.key() === 'curbsideInstructionsText' || n.key() === 'curbsideInstructionsImg');

            expect(curbsideInstructions.length).toEqual(2);
        });

        it('should not render when BOPIS is disabled', () => {
            Sephora.configurationSettings.isBOPISEnabled = false;
            wrapper = shallow(<OrderDetail />).setState(curbsideState);

            const curbsideInstructions = wrapper.findWhere(n => n.key() === 'curbsideInstructionsText' || n.key() === 'curbsideInstructionsImg');

            expect(curbsideInstructions.length).toEqual(0);
        });

        it('should not render when there is no information from BCC', () => {
            Sephora.configurationSettings.isBOPISEnabled = true;
            curbsideState.pickup.storeDetails.isBopisable = true;
            curbsideState.pickup.storeDetails.isCurbsideEnabled = true;
            curbsideState.pickup.storeDetails.content = {};
            wrapper = shallow(<OrderDetail />).setState(curbsideState);

            const curbsideInstructions = wrapper.findWhere(n => n.key() === 'curbsideInstructionsText' || n.key() === 'curbsideInstructionsImg');

            expect(curbsideInstructions.length).toEqual(0);
        });

        it('should not render when BOPIS is enabled and store isBopisable is set to false', () => {
            Sephora.configurationSettings.isBOPISEnabled = true;
            curbsideState.pickup.storeDetails.isBopisable = false;
            curbsideState.pickup.storeDetails.isCurbsideEnabled = true;
            wrapper = shallow(<OrderDetail />).setState(curbsideState);

            const curbsideInstructions = wrapper.findWhere(n => n.key() === 'curbsideInstructionsText' || n.key() === 'curbsideInstructionsImg');

            expect(curbsideInstructions.length).toEqual(0);
        });

        it('should not render when BOPIS is enabled and store isCurbsideEnabled is set to false', () => {
            Sephora.configurationSettings.isBOPISEnabled = true;
            curbsideState.pickup.storeDetails.isBopisable = true;
            curbsideState.pickup.storeDetails.isCurbsideEnabled = false;
            wrapper = shallow(<OrderDetail />).setState(curbsideState);

            const curbsideInstructions = wrapper.findWhere(n => n.key() === 'curbsideInstructionsText' || n.key() === 'curbsideInstructionsImg');

            expect(curbsideInstructions.length).toEqual(0);
        });

        it('should render when BOPIS is enabled and store isBopisable and isCurbsideEnabled are set to false', () => {
            Sephora.configurationSettings.isBOPISEnabled = true;
            curbsideState.pickup.storeDetails.isBopisable = false;
            curbsideState.pickup.storeDetails.isCurbsideEnabled = false;
            wrapper = shallow(<OrderDetail />).setState(curbsideState);

            const curbsideInstructions = wrapper.findWhere(n => n.key() === 'curbsideInstructionsText' || n.key() === 'curbsideInstructionsImg');

            expect(curbsideInstructions.length).toEqual(0);
        });
    });

    describe('Trigger analytics', () => {
        let wrapper;
        let curbsideState;
        let processSpy;

        beforeEach(() => {
            processSpy = spyOn(processEvent, 'process');
            curbsideState = {
                ...state,
                pickup: {
                    ...state.pickup,
                    storeDetails: { ...state.pickup.storeDetails }
                }
            };
            wrapper = shallow(<OrderDetail />);
            wrapper.setState(curbsideState);
        });

        it('Should trigger Analytics when showbarcode is hit', () => {
            Sephora.configurationSettings.isBOPISEnabled = true;
            const data = {
                linkData: 'curbside:show pickup barcode',
                pageName: 'user profile:my-account:n/a:*order-detail'
            };

            const showBarcode = wrapper.findWhere(n => n.name() === 'Button' && n.props().children === 'Show Pickup Barcode');
            showBarcode.at(0).simulate('click');

            expect(processSpy).toHaveBeenCalledWith(anaConsts.ASYNC_PAGE_LOAD, { data });
        });
    });
});
