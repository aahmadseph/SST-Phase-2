xdescribe('<AllStoreServices /> component', () => {
    let React;
    let AllStoreServices;
    let shallowComponent;

    beforeEach(() => {
        React = require('react');
        AllStoreServices = require('components/RichProfile/StoreServices/AllStoreServices').default;
        shallowComponent = enzyme.shallow(<AllStoreServices />);
    });

    describe('Main section', () => {
        it('should render main', () => {
            expect(shallowComponent.exists('main')).toBeTruthy();
        });

        it('should render ListPageHeader', () => {
            expect(shallowComponent.exists('ListPageHeader')).toBeTruthy();
        });

        it('should show button text correctly', () => {
            const listPageHeader = shallowComponent.find('ListPageHeader').get(0);
            expect(listPageHeader.props.children).toEqual('In-store Services');
        });
    });

    describe('Empty State', () => {
        beforeEach(() => {
            shallowComponent.state = { isEmptyService: true };
        });

        it('should render LegacyContainer', () => {
            expect(shallowComponent.exists('LegacyContainer')).toBeTruthy();
        });

        it('should render Box', () => {
            expect(shallowComponent.exists('Box')).toBeTruthy();
        });

        it('should render EmptyService', () => {
            expect(shallowComponent.exists('EmptyService')).toBeTruthy();
        });
    });

    describe('Anonymous State', () => {
        beforeEach(() => {
            shallowComponent.state = { isAnonymous: true };
        });

        it('should render LegacyContainer', () => {
            expect(shallowComponent.exists('LegacyContainer')).toBeTruthy();
        });

        it('should render Box', () => {
            expect(shallowComponent.exists('Box')).toBeTruthy();
        });

        it('should render EmptyService', () => {
            expect(shallowComponent.exists('EmptyService')).toBeTruthy();
        });

        it('should render Image', () => {
            expect(shallowComponent.exists('Image')).toBeTruthy();
        });

        it('should render Text', () => {
            expect(shallowComponent.exists('Text')).toBeTruthy();
        });

        it('should render Button', () => {
            expect(shallowComponent.exists('Button')).toBeTruthy();
        });
    });

    describe('At Least Recognized State', () => {
        beforeEach(() => {
            shallowComponent.state = {
                isAtLeastRecognized: true,
                isAnonymous: false,
                isEmptyService: false,
                shouldShowMore: true,
                services: [{ service: {} }, { service: {} }]
            };
        });

        it('should render Divider', () => {
            expect(shallowComponent.exists('Divider')).toBeTruthy();
        });

        it('should render LegacyContainer', () => {
            expect(shallowComponent.exists('LegacyContainer')).toBeTruthy();
        });

        it('should render Service', () => {
            expect(shallowComponent.exists('Service')).toBeTruthy();
        });

        it('should SHOW show more link', () => {
            expect(shallowComponent.find('Button').length).toEqual(1);
        });
    });
});
