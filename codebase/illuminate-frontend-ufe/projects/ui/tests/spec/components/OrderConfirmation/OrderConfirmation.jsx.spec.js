const { CURBSIDE_PICKUP_ID } = require('utils/CurbsidePickup');
const { getLocaleResourceFile } = require('utils/LanguageLocale').default;
const getText = getLocaleResourceFile('components/OrderConfirmation/locales', 'OrderConfirmation');

xdescribe('<OrderConfirmation /> component', () => {
    let React;
    let OrderConfirmation;
    let shallowComponent;
    let OrderConfirmationStateStub;

    beforeEach(() => {
        React = require('react');
        OrderConfirmation = require('components/OrderConfirmation/OrderConfirmation').default;
        Sephora.analytics = { initialLoadDependencies: [] };
        spyOn(Sephora, 'isDesktop').and.returnValue(true);
        shallowComponent = enzyme.shallow(<OrderConfirmation />);
        OrderConfirmationStateStub = {
            showBeautyInsiderSection: true,
            orderDetails: {
                isInitialized: true,
                header: {
                    profile: {},
                    isGuestOrder: false,
                    isAltPickupPersonEnabled: true
                },
                items: [],
                shippingGroups: {
                    shippingGroupsEntries: [
                        {
                            shippingGroup: {},
                            shippingGroupType: undefined
                        }
                    ]
                },
                pickup: {
                    email: 'test@sephora.com',
                    firstname: 'test',
                    items: [
                        {
                            product: {
                                displayName: 'Brazilian Bum Bum Cream',
                                productId: 'P406080'
                            }
                        }
                    ],
                    lastName: 'qa4',
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
                        isBopisable: true,
                        isCurbsideEnabled: true,
                        storeHours: {
                            closedDays:
                                'For the health and safety of our clients and associates, store hours may vary. Call your local store for operating hours.',
                            fridayHours: '11:00AM-7:00PM',
                            mondayHours: '11:00AM-7:00PM',
                            saturdayHours: '11:00AM-7:00PM'
                        },
                        storeId: '0058'
                    },
                    altPickupPersonDetails: {
                        firstName: 'a',
                        lasteName: 'a',
                        email: 'a@a.com'
                    }
                }
            },
            biInfo: {
                earnedPoints: 0,
                redeemedPoints: 0
            }
        };
    });

    describe('when the shippingGroupType is not ElectronicShippingGroup', () => {
        beforeEach(() => {
            shallowComponent.setState({ ...OrderConfirmationStateStub });
        });

        it('should display the "Ship to" label when the shippingGroupType is not ElectronicShippingGroup', () => {
            const Text = shallowComponent.findWhere(n => n.name() === 'Text' && n.contains('Ship To'));
            expect(Text.length).toEqual(1);
        });

        it('should display the "Estimated Delivery Date" label when the shippingGroupType is not ElectronicShippingGroup', () => {
            const Text = shallowComponent.findWhere(n => n.name() === 'Text' && n.contains('Estimated Delivery'));
            expect(Text.length).toEqual(1);
        });
    });

    describe('when the order is not from Guest Checkout', () => {
        beforeEach(() => {
            shallowComponent.setState({ ...OrderConfirmationStateStub });
            shallowComponent.setState({
                biFormTestType: 'default',
                orderDetails: { header: { isGuestOrder: false } }
            });
        });
        it('should not display a GuestCheckoutSection component', () => {
            const GuestCheckoutSection = shallowComponent.findWhere(n => n.name() === 'GuestCheckoutSection');
            expect(GuestCheckoutSection.length).toEqual(0);
        });
    });

    describe('when the shippingGroupType is ElectronicShippingGroup', () => {
        beforeEach(() => {
            OrderConfirmationStateStub.orderDetails.shippingGroups.shippingGroupsEntries[0].shippingGroupType = 'ElectronicShippingGroup';
            shallowComponent.setState({ ...OrderConfirmationStateStub });
        });

        it('should not the display the "Ship To" label', () => {
            const Text = shallowComponent.findWhere(n => n.name() === 'Text' && n.contains('Ship To'));
            expect(Text.length).toEqual(0);
        });
    });

    describe('when the earned/used points is available', () => {
        it('should show the BeautyInsiderSection if earned or used points is positive', () => {
            OrderConfirmationStateStub = {
                ...OrderConfirmationStateStub,
                biInfo: {
                    earnedPoints: 10,
                    redeemedPoints: 0
                }
            };
            shallowComponent.setState({ ...OrderConfirmationStateStub });
            expect(shallowComponent.find('BeautyInsiderSection').length).toBe(1);
        });

        it('should hide the BeautyInsiderSection if both earned/used points are negative', () => {
            OrderConfirmationStateStub = {
                ...OrderConfirmationStateStub,
                biInfo: {
                    earnedPoints: 0,
                    redeemedPoints: 0
                }
            };
            shallowComponent.setState({ ...OrderConfirmationStateStub });
            expect(shallowComponent.find('BeautyInsiderSection').length).toBe(0);
        });
    });

    describe('OrderConfirmation for Ropis Orders', () => {
        beforeEach(() => {
            OrderConfirmationStateStub.orderDetails.header.isRopisOrder = true;
            shallowComponent.setState({ ...OrderConfirmationStateStub });
        });

        describe('Test data-at attributes', () => {
            it('should render data-at attribute set to "pickup_location_title"', () => {
                expect(shallowComponent.find('[data-at="pickup_location_title"]').length).toBe(1);
            });

            it('should render data-at attribute set to "store_name"', () => {
                expect(shallowComponent.find('[data-at="store_name"]').length).toBe(1);
            });

            xit('should render data-at attribute set to "store_location"', () => {
                expect(shallowComponent.find('[data-at="store_location"]').length).toBe(1);
            });

            xit('should render data-at attribute set to "store_hours"', () => {
                expect(shallowComponent.find('[data-at="store_hours"]').length).toBe(1);
            });

            it('should render data-at attribute set to "contact_information_title"', () => {
                expect(shallowComponent.find('[data-at="contact_information_title"]').length).toBe(1);
            });

            it('should render data-at attribute set to "contact_information"', () => {
                expect(shallowComponent.find('[data-at="contact_information"]').length).toBe(1);
            });
        });

        describe('Order Summary section layout', () => {
            it('should render RopisBasketOrderSummary component', () => {
                expect(shallowComponent.find('RopisBasketOrderSummary').length).toBe(1);
            });
            it('should render OrderSummary component with isRopis prop as true', () => {
                const OrderSummary = shallowComponent.findWhere(n => n.name() === 'OrderSummary' && n.prop('isRopis') === true);
                expect(OrderSummary.length).toBe(1);
            });
        });
    });

    describe('OrderConfirmation For Bopis Orders', () => {
        beforeEach(() => {
            OrderConfirmationStateStub.orderDetails.header.isBopisOrder = true;
            shallowComponent.setState({ ...OrderConfirmationStateStub });
        });

        describe('Pickup person section', () => {
            it('should render correct title', () => {
                const title = shallowComponent.findWhere(
                    n => n.prop('data-at') === 'contact_information_title' && n.prop('children') === 'Pickup Person'
                );
                expect(title.length).toBe(1);
            });
        });
        describe('Alt Pickup person section', () => {
            it('should render AlternatePickup component if present in order details', () => {
                const AlternatePickup = shallowComponent.findWhere(n => n.name() === 'AlternatePickup' && n.prop('isOrderConfirmation') === true);
                expect(AlternatePickup.length).toBe(1);
            });
        });
        describe('Order Summary section layout', () => {
            it('should not render RopisBasketOrderSummary component', () => {
                expect(shallowComponent.find('RopisBasketOrderSummary').length).toBe(0);
            });
            it('should render OrderSummary component with isBopis prop as true', () => {
                const OrderSummary = shallowComponent.findWhere(n => n.name() === 'OrderSummary' && n.prop('isBopis') === true);
                expect(OrderSummary.length).toBe(1);
            });
        });
    });

    describe('Curbside Pickup Indicator', () => {
        let newState;
        let orderDetails;

        beforeEach(() => {
            orderDetails = OrderConfirmationStateStub.orderDetails;
            newState = {
                orderDetails: {
                    ...orderDetails,
                    header: {
                        ...orderDetails.header,
                        isBopisOrder: true
                    }
                }
            };
        });

        it('should render when BOPIS is enabled and store isBopisable and isCurbsideEnabled', () => {
            Sephora.configurationSettings.isBOPISEnabled = true;
            shallowComponent.setState(newState);

            const curbsideIndicator = shallowComponent.find('CurbsidePickupIndicator');

            expect(curbsideIndicator.length).toEqual(1);
        });

        it('should not render when BOPIS is disabled', () => {
            Sephora.configurationSettings.isBOPISEnabled = false;
            shallowComponent.setState(newState);

            const curbsideIndicator = shallowComponent.find('CurbsidePickupIndicator');

            expect(curbsideIndicator.length).toEqual(0);
        });

        it('should not render when BOPIS is enabled and store isBopisable is set to false', () => {
            Sephora.configurationSettings.isBOPISEnabled = true;
            newState.orderDetails.pickup.storeDetails.isBopisable = false;
            shallowComponent.setState(newState);

            const curbsideIndicator = shallowComponent.find('CurbsidePickupIndicator');

            expect(curbsideIndicator.length).toEqual(0);
        });

        it('should not render when BOPIS is enabled and store isCurbsideEnabled is set to false', () => {
            Sephora.configurationSettings.isBOPISEnabled = true;
            newState.orderDetails.pickup.storeDetails.isCurbsideEnabled = false;
            shallowComponent.setState(newState);

            const curbsideIndicator = shallowComponent.find('CurbsidePickupIndicator');

            expect(curbsideIndicator.length).toEqual(0);
        });

        it('should render when BOPIS is enabled and store isBopisable and isCurbsideEnabled are set to false', () => {
            Sephora.configurationSettings.isBOPISEnabled = true;
            newState.orderDetails.pickup.storeDetails.isBopisable = false;
            newState.orderDetails.pickup.storeDetails.isCurbsideEnabled = false;
            shallowComponent.setState(newState);

            const curbsideIndicator = shallowComponent.find('CurbsidePickupIndicator');

            expect(curbsideIndicator.length).toEqual(0);
        });

        it('should render data-at attribute set to "curbside_indicator_label"', () => {
            Sephora.configurationSettings.isBOPISEnabled = true;
            shallowComponent.setState(newState);

            const dataAt = shallowComponent.find('CurbsidePickupIndicator[dataAt="curbside_indicator_label"]');

            expect(dataAt.length).toEqual(1);
        });
    });

    describe('Curbside Pickup Instructions', () => {
        let curbsideOrderDetails;
        let orderDetails;

        beforeEach(() => {
            orderDetails = OrderConfirmationStateStub.orderDetails;
            curbsideOrderDetails = {
                orderDetails: {
                    ...orderDetails,
                    header: {
                        ...orderDetails.header,
                        isBopisOrder: true
                    },
                    pickup: {
                        ...orderDetails.pickup,
                        storeDetails: {
                            ...orderDetails.pickup.storeDetails,
                            content: {
                                regions: {
                                    curbsideInstructionTab: [
                                        {
                                            componentName: 'Sephora Unified Markdown Component',
                                            componentType: 57,
                                            contentType: 'PlainText',
                                            enableTesting: false,
                                            name: 'curbside',
                                            text: '*Curbside pickup instructions*'
                                        }
                                    ],
                                    curbsideMapImageTab: [
                                        {
                                            componentName: 'Sephora Unified Image Component',
                                            componentType: 53,
                                            enableTesting: false,
                                            imageId: '11840003',
                                            imagePath: 'https://via.placeholder.com/1156x650/fffeef/808080',
                                            name: 'image',
                                            width: '1280'
                                        }
                                    ]
                                }
                            }
                        }
                    }
                }
            };
        });

        it('should render when BOPIS is enabled and store isBopisable and isCurbsideEnabled', () => {
            Sephora.configurationSettings.isBOPISEnabled = true;
            shallowComponent.setState(curbsideOrderDetails);

            const curbsideInstructions = shallowComponent.findWhere(n => n.key() === CURBSIDE_PICKUP_ID);

            expect(curbsideInstructions.length).toEqual(1);
        });

        it('should not render when BOPIS is disabled', () => {
            Sephora.configurationSettings.isBOPISEnabled = false;
            shallowComponent.setState(curbsideOrderDetails);

            const curbsideInstructions = shallowComponent.findWhere(n => n.key() === CURBSIDE_PICKUP_ID);

            expect(curbsideInstructions.length).toEqual(0);
        });

        it('should not render when there is no information from BCC', () => {
            Sephora.configurationSettings.isBOPISEnabled = true;
            curbsideOrderDetails.orderDetails.pickup.storeDetails.content.regions = {};
            shallowComponent.setState(curbsideOrderDetails);

            const curbsideInstructions = shallowComponent.findWhere(n => n.key() === CURBSIDE_PICKUP_ID);

            expect(curbsideInstructions.length).toEqual(0);
        });

        it('should not render when BOPIS is enabled and store isBopisable is set to false', () => {
            Sephora.configurationSettings.isBOPISEnabled = true;
            curbsideOrderDetails.orderDetails.pickup.storeDetails.isCurbsideEnabled = true;
            curbsideOrderDetails.orderDetails.pickup.storeDetails.isBopisable = false;
            shallowComponent.setState(curbsideOrderDetails);

            const curbsideInstructions = shallowComponent.findWhere(n => n.key() === CURBSIDE_PICKUP_ID);

            expect(curbsideInstructions.length).toEqual(0);
        });

        it('should not render when BOPIS is enabled and store isCurbsideEnabled is set to false', () => {
            Sephora.configurationSettings.isBOPISEnabled = true;
            curbsideOrderDetails.orderDetails.pickup.storeDetails.isCurbsideEnabled = false;
            curbsideOrderDetails.orderDetails.pickup.storeDetails.isBopisable = true;
            shallowComponent.setState(curbsideOrderDetails);

            const curbsideInstructions = shallowComponent.findWhere(n => n.key() === CURBSIDE_PICKUP_ID);

            expect(curbsideInstructions.length).toEqual(0);
        });

        it('should render when BOPIS is enabled and store isBopisable and isCurbsideEnabled are set to false', () => {
            Sephora.configurationSettings.isBOPISEnabled = true;
            curbsideOrderDetails.orderDetails.pickup.storeDetails.isCurbsideEnabled = false;
            curbsideOrderDetails.orderDetails.pickup.storeDetails.isBopisable = false;
            shallowComponent.setState(curbsideOrderDetails);

            const curbsideInstructions = shallowComponent.findWhere(n => n.key() === CURBSIDE_PICKUP_ID);

            expect(curbsideInstructions.length).toEqual(0);
        });
    });

    describe('When shippingGroup address is of type HAL', () => {
        let PickupPerson;

        beforeEach(() => {
            OrderConfirmationStateStub.orderDetails.header.isHalAvailable = true;
            OrderConfirmationStateStub.orderDetails.shippingGroups.shippingGroupsEntries[0] = {
                shippingGroupType: 'HardGoodShippingGroup',
                shippingGroup: {
                    address: {
                        addressId: '9190000',
                        firstName: 'John',
                        lastName: 'Braun',
                        address1: '3735OakLane',
                        city: 'Ashtabula',
                        state: 'OH',
                        country: 'US',
                        phone: '4123123123',
                        email: 'hg@hg.com',
                        addressType: 'HAL',
                        isDefault: false
                    }
                }
            };
            shallowComponent.setState({ ...OrderConfirmationStateStub });
            PickupPerson = shallowComponent.find('PickupPerson');
        });

        it('should display a "Shipping to FedEx Location" label', () => {
            const Text = shallowComponent.findWhere(n => n.name() === 'Text' && n.contains(getText('shipToFeDexLocation')));
            expect(Text.length).toEqual(1);
        });

        it('should render a PickupPerson component', () => {
            expect(PickupPerson.length).toBe(1);
        });

        it('PickupPerson should receive props firstName, lastName with the correct values', () => {
            const { firstName, lastName } = OrderConfirmationStateStub.orderDetails.shippingGroups.shippingGroupsEntries[0].shippingGroup.address;

            expect(PickupPerson.props().firstName).toBe(firstName);
            expect(PickupPerson.props().lastName).toBe(lastName);
        });
    });
});
