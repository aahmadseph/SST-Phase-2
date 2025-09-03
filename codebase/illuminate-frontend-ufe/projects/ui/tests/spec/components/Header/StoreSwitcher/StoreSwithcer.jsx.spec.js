const React = require('react');
const { shallow } = require('enzyme');

describe('StoreSwitcher', () => {
    let storeDetails;
    let state;
    let wrapper;

    beforeEach(() => {
        storeDetails = {
            address: {
                address1: '220 Yonge Street',
                address2: 'Space #3-131',
                city: 'Toronto',
                country: 'CA',
                crossStreet: '',
                fax: '',
                mallName: '',
                phone: '(416) 595-7227',
                postalCode: 'M5B 2H1',
                state: 'ON'
            },
            displayName: 'Eaton Centre',
            distance: 1,
            isBopisable: true,
            isCurbsideEnabled: true,
            isNoShowFeeApplicable: true,
            isOnlineReservationEnabled: false,
            isRopisable: false,
            isVirtual: false,
            latitude: 43.653,
            longitude: -79.38,
            seoCanonicalUrl: '/happening/stores/toronto-eaton-centre',
            storeHours: {
                closedDays:
                    'For the health and safety of our clients and associates, store hours may vary. Call your local store for operating hours.',
                fridayHours: '11:00AM-7:00PM',
                mondayHours: '11:00AM-7:00PM',
                saturdayHours: '11:00AM-7:00PM',
                sundayHours: '11:00AM-7:00PM',
                textColor: 'Black',
                thursdayHours: '11:00AM-7:00PM',
                timeZone: 'EST5EDT',
                tuesdayHours: '11:00AM-7:00PM',
                wednesdayHours: '11:00AM-7:00PM'
            },
            storeId: '0500',
            targetUrl: '/happening/stores/toronto-eaton-centre'
        };
        state = {
            countryMismatch: false,
            currentLocation: 'Toronto, ON',
            isLoaded: true,
            isOpen: true,
            selectedStore: storeDetails,
            storeList: [{ ...storeDetails }]
        };
        const scriptUtils = require('utils/LoadScripts').default;
        spyOn(scriptUtils, 'loadScripts');
        const StoreSwitcher = require('components/Header/StoreSwitcher/StoreSwitcher').default;
        wrapper = shallow(<StoreSwitcher />)
            .find('StoreSwitcher')
            .shallow();
    });

    describe('render', () => {
        it('should render Modal component', () => {
            expect(wrapper.find('Modal').exists()).toBe(true);
        });

        it('should render ModalHeader component', () => {
            expect(wrapper.find('ModalHeader').exists()).toBe(true);
        });

        it('modal title should say Change Store', () => {
            const modalTitle = wrapper.find('ModalTitle');
            const { children } = modalTitle.props();
            expect(children).toBe('Change Store');
        });

        it('should render ModalBody component', () => {
            expect(wrapper.find('ModalBody').exists()).toBe(true);
        });

        it('should display a Choose This Store button', () => {
            wrapper.setState(state);
            const useStoreButton = wrapper.find('Button[variant="primary"]');
            const cancelText = useStoreButton.children().text();
            const cancel = useStoreButton.length === 1 && cancelText === 'Choose This Store';
            expect(cancel).toBe(true);
        });
    });

    describe('store list', () => {
        it('should render CurbsidePickupIndicator when BOPIS is enabled and store isBopisable and isCurbsideEnabled', () => {
            Sephora.configurationSettings.isBOPISEnabled = true;
            wrapper.setState(state);

            const curbsideIndicator = wrapper.find('CurbsidePickupIndicator');

            expect(curbsideIndicator.length).toEqual(1);
        });

        it('should not render CurbsidePickupIndicator when BOPIS is disabled', () => {
            Sephora.configurationSettings.isBOPISEnabled = false;
            wrapper.setState(state);

            const curbsideIndicator = wrapper.find('CurbsidePickupIndicator');

            expect(curbsideIndicator.length).toEqual(0);
        });

        it('should not render CurbsidePickupIndicator when BOPIS is enabled and store isBopisable is set to false', () => {
            Sephora.configurationSettings.isBOPISEnabled = true;
            const newState = {
                storeList: [
                    {
                        ...storeDetails,
                        isBopisable: false
                    }
                ]
            };
            wrapper.setState(newState);

            const curbsideIndicator = wrapper.find('CurbsidePickupIndicator');

            expect(curbsideIndicator.length).toEqual(0);
        });

        it('should not render CurbsidePickupIndicator when BOPIS is enabled and store isCurbsideEnabled is set to false', () => {
            Sephora.configurationSettings.isBOPISEnabled = true;
            const newState = {
                storeList: [
                    {
                        ...storeDetails,
                        isCurbsideEnabled: false
                    }
                ]
            };
            wrapper.setState(newState);

            const curbsideIndicator = wrapper.find('CurbsidePickupIndicator');

            expect(curbsideIndicator.length).toEqual(0);
        });

        it('should render CurbsidePickupIndicator when BOPIS is enabled and store isBopisable and isCurbsideEnabled are set to false', () => {
            Sephora.configurationSettings.isBOPISEnabled = true;
            const newState = {
                storeList: [
                    {
                        ...storeDetails,
                        isBopisable: false,
                        isCurbsideEnabled: false
                    }
                ]
            };
            wrapper.setState(newState);

            const curbsideIndicator = wrapper.find('CurbsidePickupIndicator');

            expect(curbsideIndicator.length).toEqual(0);
        });
    });

    describe('Upper funnel', () => {
        beforeEach(() => {
            const props = { options: { isUpperFunnel: true } };
            wrapper = wrapper.setProps(props);
        });

        it('modal title should say Pick Up In Store', () => {
            const modalTitle = wrapper.find('ModalTitle');
            const text = modalTitle.children().text();
            expect(text).toBe('Pick Up In Store');
        });

        it('should display a Cancel button', () => {
            wrapper.setState(state);
            const cancelButton = wrapper.find('Button[variant="secondary"]');
            const cancelText = cancelButton.children().text();
            const cancel = cancelButton.length === 1 && cancelText === 'Cancel';
            expect(cancel).toBe(true);
        });
    });
});
