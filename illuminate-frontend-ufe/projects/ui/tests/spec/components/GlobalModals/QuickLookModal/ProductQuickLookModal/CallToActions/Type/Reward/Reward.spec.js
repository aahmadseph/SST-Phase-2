const React = require('react');
// eslint-disable-next-line no-undef
const shallow = enzyme.shallow;

describe('Reward component', () => {
    let Reward;
    let props;
    let store;
    let setAndWatchProductUser;
    let setAndWatchProductStub;
    let setAndWatchProductItems;
    let component;

    beforeEach(() => {
        Reward = require('components/GlobalModals/QuickLookModal/ProductQuickLookModal/CallToActions/Type/Reward/Reward').default;

        props = {
            currentProduct: {
                currentSku: {
                    isInBasket: false,
                    isEligible: true
                },
                currentSkuQuantity: 3
            }
        };

        store = require('Store').default;
    });

    describe('componentDidMount', () => {
        it('should call setAndWatch for user', () => {
            setAndWatchProductUser = spyOn(store, 'setAndWatch').and.callFake(() => 'user');
            const wrapper = shallow(<Reward {...props} />);
            component = wrapper.instance();
            component.componentDidMount();
            expect(setAndWatchProductUser).toHaveBeenCalled();
        });

        it('should call setAndWatch for currentProductUserSpecificDetails', () => {
            setAndWatchProductStub = spyOn(store, 'setAndWatch').and.callFake(() => 'product.currentProductUserSpecificDetails');
            const wrapper = shallow(<Reward {...props} />);
            component = wrapper.instance();
            component.componentDidMount();
            expect(setAndWatchProductStub).toHaveBeenCalled();
        });

        it('should call setAndWatch for basket items', () => {
            setAndWatchProductItems = spyOn(store, 'setAndWatch').and.callFake(() => 'basket.items');
            const wrapper = shallow(<Reward {...props} />);
            component = wrapper.instance();
            component.componentDidMount();
            expect(setAndWatchProductItems).toHaveBeenCalled();
        });
    });
});
