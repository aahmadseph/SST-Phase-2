const React = require('react');
const { shallow } = require('enzyme');

describe('InfoWindow Component', () => {
    let InfoWindow;
    let wrapper;
    let curbsideStore;

    beforeEach(() => {
        InfoWindow = require('components/GoogleMap/InfoWindow/InfoWindow').default;
        curbsideStore = {
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
            distance: 1,
            email: 'Sephora.Powell@sephora.com',
            isBopisable: true,
            isCurbsideEnabled: true,
            isNoShowFeeApplicable: true,
            isOnlineReservationEnabled: true,
            isRopisable: false,
            isVirtual: false,
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
        };
    });

    describe('Curbside Pickup Indicator', () => {
        let props;

        beforeEach(() => {
            props = { storeData: { ...curbsideStore } };
        });

        it('should render when BOPIS is enabled and store isBopisable and isCurbsideEnabled', () => {
            Sephora.configurationSettings.isBOPISEnabled = true;
            wrapper = shallow(<InfoWindow {...props} />);

            const curbsideIndicator = wrapper.find('CurbsidePickupIndicator');

            expect(curbsideIndicator.length).toEqual(1);
        });

        it('should not render when BOPIS is disabled', () => {
            Sephora.configurationSettings.isBOPISEnabled = false;
            wrapper = shallow(<InfoWindow {...props} />);

            const curbsideIndicator = wrapper.find('CurbsidePickupIndicator');

            expect(curbsideIndicator.length).toEqual(0);
        });

        it('should not render when BOPIS is enabled and store isBopisable is set to false', () => {
            Sephora.configurationSettings.isBOPISEnabled = true;
            props.storeData.isBopisable = false;

            wrapper = shallow(<InfoWindow {...props} />);

            const curbsideIndicator = wrapper.find('CurbsidePickupIndicator');

            expect(curbsideIndicator.length).toEqual(0);
        });

        it('should not render when BOPIS is enabled and store isCurbsideEnabled is set to false', () => {
            Sephora.configurationSettings.isBOPISEnabled = true;
            props.storeData.isCurbsideEnabled = false;

            wrapper = shallow(<InfoWindow {...props} />);

            const curbsideIndicator = wrapper.find('CurbsidePickupIndicator');

            expect(curbsideIndicator.length).toEqual(0);
        });

        it('should render when BOPIS is enabled and store isBopisable and isCurbsideEnabled are set to false', () => {
            Sephora.configurationSettings.isBOPISEnabled = true;
            props.storeData.isBopisable = false;
            props.storeData.isCurbsideEnabled = false;

            wrapper = shallow(<InfoWindow {...props} />);

            const curbsideIndicator = wrapper.find('CurbsidePickupIndicator');

            expect(curbsideIndicator.length).toEqual(0);
        });
    });

    describe('Curbside Pickup Indicator on Experience Details Pages', () => {
        let props;
        let Location;

        beforeEach(() => {
            Location = require('utils/Location').default;
            spyOn(Location, 'isExperienceDetailsPage').and.returnValue(true);
            props = { storeData: { ...curbsideStore } };
        });

        it('should render when store isBopisable and isCurbsideEnabled are set to true', () => {
            wrapper = shallow(<InfoWindow {...props} />);

            const curbsideIndicator = wrapper.find('CurbsidePickupIndicator');

            expect(curbsideIndicator.length).toEqual(1);
        });

        it('should not render when store isCurbsideEnabled  and isBopisable are set to false', () => {
            props.storeData.isCurbsideEnabled = false;
            props.storeData.isBopisable = false;

            wrapper = shallow(<InfoWindow {...props} />);

            const curbsideIndicator = wrapper.find('CurbsidePickupIndicator');

            expect(curbsideIndicator.length).toEqual(0);
        });
    });
});
