const React = require('react');
const { shallow } = require('enzyme');

describe('Lists component', () => {
    const Lists = require('components/RichProfile/Lists/Lists').default;
    const SkuUtils = require('utils/Sku').default;
    let shallowedComponent;

    beforeEach(() => {
        shallowedComponent = shallow(<Lists />);
    });

    describe('items rendered', () => {
        let isBiRewardStub;
        let isSampleStub;

        beforeEach(() => {
            isBiRewardStub = spyOn(SkuUtils, 'isBiReward');
            isSampleStub = spyOn(SkuUtils, 'isSample');
            const component = shallowedComponent.instance();
            spyOn(component, 'isUserReady').and.returnValue(true);
            spyOn(component, 'isUserAtleastRecognized').and.returnValue(true);
        });

        it('should render RewardItem if items are BI rewards', () => {
            isBiRewardStub.and.returnValue(true);
            shallowedComponent.setState({
                pastPurchases: [
                    {
                        commerceId: '001',
                        sku: { actionFlags: {} }
                    }
                ]
            });
            expect(shallowedComponent.find('RewardItem').length).toBe(1);
        });

        it('should render SampleItem if items are samples', () => {
            isSampleStub.and.returnValue(true);
            shallowedComponent.setState({
                pastPurchases: [
                    {
                        commerceId: '001',
                        sku: { actionFlags: {} }
                    },
                    {
                        commerceId: '002',
                        sku: { actionFlags: {} }
                    }
                ]
            });
            expect(shallowedComponent.find('SampleItem').length).toBe(2);
        });

        it('should render ProductItem if items are products', () => {
            isBiRewardStub.and.returnValue(false);
            isSampleStub.and.returnValue(false);
            shallowedComponent.setState({
                pastPurchases: [
                    {
                        commerceId: '001',
                        sku: { actionFlags: {} }
                    },
                    {
                        commerceId: '002',
                        sku: { actionFlags: {} }
                    },
                    {
                        commerceId: '003',
                        sku: { actionFlags: {} }
                    }
                ]
            });
            expect(shallowedComponent.find('ErrorBoundary(Connect(ProductItem))').length).toBe(3);
        });
    });
});
