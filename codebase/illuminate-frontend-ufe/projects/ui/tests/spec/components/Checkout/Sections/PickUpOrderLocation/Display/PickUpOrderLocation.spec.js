const React = require('react');
const { shallow } = require('enzyme');

const storeDetails = {
    displayName: 'Eaton Centre',
    isBopisable: true,
    isCurbsideEnabled: true
};

const props = {
    storeDetails: { ...storeDetails },
    pickupOrderHoldDaysMessage: 'The store will hold your items for 5 days after you place your order.'
};

describe('PickUpOrderLocation component', () => {
    let wrapper;
    let PickUpOrderLocation;

    beforeEach(() => {
        PickUpOrderLocation = require('components/Checkout/Sections/PickUpOrderLocation/PickUpOrderLocation').default;
        wrapper = shallow(<PickUpOrderLocation {...props} />);
    });
    it('should render store Icon', () => {
        const storeIcon = wrapper.findWhere(x => x.name() === 'Icon' && x.prop('name') === 'store');

        expect(storeIcon.length).toEqual(1);
    });
    it('should render Text with data attribute and store display name', () => {
        const displayNameText = wrapper.findWhere(
            x => x.name() === 'Text' && x.prop('data-at') === 'store_info' && x.prop('children') === 'Eaton Centre'
        );

        expect(displayNameText.length).toEqual(1);
    });
    describe('Curbside Pickup Indicator', () => {
        it('should render when BOPIS is enabled and store isBopisable and isCurbsideEnabled', () => {
            Sephora.configurationSettings.isBOPISEnabled = true;
            wrapper = shallow(<PickUpOrderLocation {...props} />);

            const curbsideIndicator = wrapper.find('CurbsidePickupIndicator');

            expect(curbsideIndicator.length).toEqual(1);
        });

        it('should not render when BOPIS is disabled', () => {
            Sephora.configurationSettings.isBOPISEnabled = false;
            wrapper = shallow(<PickUpOrderLocation {...props} />);

            const curbsideIndicator = wrapper.find('CurbsidePickupIndicator');

            expect(curbsideIndicator.length).toEqual(0);
        });

        it('should not render when BOPIS is enabled and store isBopisable is set to false', () => {
            Sephora.configurationSettings.isBOPISEnabled = true;
            const newProps = {
                ...props,
                storeDetails: {
                    ...storeDetails,
                    isBopisable: false
                }
            };
            wrapper = shallow(<PickUpOrderLocation {...newProps} />);

            const curbsideIndicator = wrapper.find('CurbsidePickupIndicator');

            expect(curbsideIndicator.length).toEqual(0);
        });

        it('should not render when BOPIS is enabled and store isCurbsideEnabled is set to false', () => {
            Sephora.configurationSettings.isBOPISEnabled = true;
            const newProps = {
                ...props,
                storeDetails: {
                    ...storeDetails,
                    isCurbsideEnabled: false
                }
            };
            wrapper = shallow(<PickUpOrderLocation {...newProps} />);

            const curbsideIndicator = wrapper.find('CurbsidePickupIndicator');

            expect(curbsideIndicator.length).toEqual(0);
        });

        it('should render when BOPIS is enabled and store isBopisable and isCurbsideEnabled are set to false', () => {
            Sephora.configurationSettings.isBOPISEnabled = true;
            const newProps = {
                ...props,
                storeDetails: {
                    ...storeDetails,
                    isBopisable: false,
                    isCurbsideEnabled: false
                }
            };
            wrapper = shallow(<PickUpOrderLocation {...newProps} />);

            const curbsideIndicator = wrapper.find('CurbsidePickupIndicator');

            expect(curbsideIndicator.length).toEqual(0);
        });

        it('should render data-at attribute set to "curbside_indicator_label"', () => {
            Sephora.configurationSettings.isBOPISEnabled = true;
            wrapper = shallow(<PickUpOrderLocation {...props} />);

            const dataAt = wrapper.find('CurbsidePickupIndicator[dataAt="curbside_indicator_label"]');

            expect(dataAt.length).toEqual(1);
        });
    });

    it('should render Link for store details with data attribute', () => {
        // Optimized selector to find relevant link faster
        const storeDetailsLink = wrapper.find('Link[data-at="store_details_btn"]');

        expect(storeDetailsLink.length).toEqual(1);
    });

    it('should render pickupOrderHoldDaysMessage if present in props', () => {
        const newProps = {
            ...props,
            pickupOrderHoldDaysMessage: 'hold message'
        };
        wrapper = shallow(<PickUpOrderLocation {...newProps} />);
        const holdMessage = wrapper.findWhere(x => x.name() === 'Box' && x.prop('data-at') === 'pickup_location_section_info_message');

        expect(holdMessage.length).toEqual(1);
    });
});
