const React = require('react');
const { shallow } = require('enzyme');

const props = {
    address: {
        address1: '2 Embarcadero Center ',
        address2: 'Street Level',
        city: 'San Francisco',
        country: 'US',
        crossStreet: '',
        fax: '(415) 982-0151',
        mallName: 'Two Embarcadero Center',
        phone: '(415)982-0150',
        postalCode: '94111',
        state: 'CA'
    },
    displayName: 'Embarcadero',
    distance: 0,
    isBopisable: true,
    isCurbsideEnabled: true,
    isRopisable: false,
    latitude: 37.794,
    longitude: -122.399,
    seoCanonicalUrl: '/happening/stores/san-francisco-embarcadero',
    storeHours: {
        closedDays: 'For the health and safety of our clients and associates, store hours may vary. Call your local store for operating hours.',
        fridayHours: '11:00AM-5:00PM',
        mondayHours: '11:00AM-5:00PM',
        saturdayHours: '12:00PM-5:00PM',
        sundayHours: 'Closed',
        textColor: 'Black',
        thursdayHours: '11:00AM-5:00PM',
        timeZone: 'PST8PDT',
        tuesdayHours: '11:00AM-5:00PM',
        wednesdayHours: '11:00AM-5:00PM'
    },
    storeId: '0382',
    targetUrl: '/happening/stores/san-francisco-embarcadero',
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
                    height: '650',
                    imageId: '11840003',
                    imagePath: 'https://via.placeholder.com/1156x650/fffeef/808080',
                    name: 'image',
                    width: '1156'
                }
            ]
        }
    }
};

describe('FindInStoreAddress component', () => {
    let FindInStoreAddress;
    let curbsideProps;
    let wrapper;

    describe('Curbside Pickup Instructions', () => {
        beforeEach(() => {
            FindInStoreAddress = require('components/GlobalModals/FindInStore/FindInStoreAddress/FindInStoreAddress').default;
            curbsideProps = { ...props };
        });

        it('should render when BOPIS is enabled and store isBopisable and isCurbsideEnabled', () => {
            Sephora.configurationSettings.isBOPISEnabled = true;
            wrapper = shallow(<FindInStoreAddress {...curbsideProps} />, { disableLifecycleMethods: true });

            const curbsideInstructions = wrapper.findWhere(n => n.key() === 'curbsideInstructionsText' || n.key() === 'curbsideInstructionsImg');

            expect(curbsideInstructions.length).toEqual(2);
        });

        it('should not render when BOPIS is disabled', () => {
            Sephora.configurationSettings.isBOPISEnabled = false;
            wrapper = shallow(<FindInStoreAddress {...curbsideProps} />, { disableLifecycleMethods: true });

            const curbsideInstructions = wrapper.findWhere(n => n.key() === 'curbsideInstructionsText' || n.key() === 'curbsideInstructionsImg');

            expect(curbsideInstructions.length).toEqual(0);
        });

        it('should not render when there is no information from BCC', () => {
            Sephora.configurationSettings.isBOPISEnabled = true;
            curbsideProps.isBopisable = true;
            curbsideProps.isCurbsideEnabled = true;
            curbsideProps.content = {};

            wrapper = shallow(<FindInStoreAddress {...curbsideProps} />, { disableLifecycleMethods: true });

            const curbsideInstructions = wrapper.findWhere(n => n.key() === 'curbsideInstructionsText' || n.key() === 'curbsideInstructionsImg');

            expect(curbsideInstructions.length).toEqual(0);
        });

        it('should not render when BOPIS is enabled and store isBopisable is set to false', () => {
            Sephora.configurationSettings.isBOPISEnabled = true;
            curbsideProps.isBopisable = false;
            curbsideProps.isCurbsideEnabled = true;
            wrapper = shallow(<FindInStoreAddress {...curbsideProps} />, { disableLifecycleMethods: true });

            const curbsideInstructions = wrapper.findWhere(n => n.key() === 'curbsideInstructionsText' || n.key() === 'curbsideInstructionsImg');

            expect(curbsideInstructions.length).toEqual(0);
        });

        it('should not render when BOPIS is enabled and store isCurbsideEnabled is set to false', () => {
            Sephora.configurationSettings.isBOPISEnabled = true;
            curbsideProps.isBopisable = true;
            curbsideProps.isCurbsideEnabled = false;
            wrapper = shallow(<FindInStoreAddress {...curbsideProps} />, { disableLifecycleMethods: true });

            const curbsideInstructions = wrapper.findWhere(n => n.key() === 'curbsideInstructionsText' || n.key() === 'curbsideInstructionsImg');

            expect(curbsideInstructions.length).toEqual(0);
        });

        it('should render when BOPIS is enabled and store isBopisable and isCurbsideEnabled are set to false', () => {
            Sephora.configurationSettings.isBOPISEnabled = true;
            curbsideProps.isBopisable = false;
            curbsideProps.isCurbsideEnabled = false;
            wrapper = shallow(<FindInStoreAddress {...curbsideProps} />, { disableLifecycleMethods: true });

            const curbsideInstructions = wrapper.findWhere(n => n.key() === 'curbsideInstructionsText' || n.key() === 'curbsideInstructionsImg');

            expect(curbsideInstructions.length).toEqual(0);
        });
    });
});
