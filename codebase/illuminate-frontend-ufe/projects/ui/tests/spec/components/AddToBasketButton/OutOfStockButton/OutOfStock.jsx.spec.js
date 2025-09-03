describe('<OutOfStockButton /> component', () => {
    let React;
    let OutOfStockButton;
    let shallowComponent;
    let sku;

    beforeEach(() => {
        React = require('react');
        OutOfStockButton = require('components/AddToBasketButton/OutOfStockButton/OutOfStockButton').default;
        sku = {
            isSample: false,
            type: 'standard',
            isOutOfStock: true
        };
        shallowComponent = enzyme.shallow(
            <OutOfStockButton
                sku={sku}
                product={{ type: 'standard' }}
            />
        );
    });

    xit('it should render Out Of Stock button if product is out of stock', () => {
        shallowComponent = enzyme.shallow(<OutOfStockButton sku={sku} />);
        expect(shallowComponent.exists('OutOfStockButton')).toBeTruthy();
    });

    it('it should render correct text for isShowAsStoreOnlyTreatment flag is true', () => {
        sku = { isShowAsStoreOnlyTreatment: true };
        shallowComponent = enzyme.shallow(<OutOfStockButton sku={sku} />);
        expect(shallowComponent.prop('children')).toBe('Available in Store Only');
    });

    it('it should render correct text for isComingSoonTreatment flag is true', () => {
        sku = { isComingSoonTreatment: true };
        shallowComponent = enzyme.shallow(<OutOfStockButton sku={sku} />);
        expect(shallowComponent.prop('children')).toBe('Coming Soon');
    });

    it('it should render correct text for isBiReward ', () => {
        sku = { biType: '750 Points' };
        shallowComponent = enzyme.shallow(<OutOfStockButton sku={sku} />);
        expect(shallowComponent.prop('children')).toBe('Sold Out');
    });

    it('it should render correct text for isOutOfStock flag is true', () => {
        shallowComponent = enzyme.shallow(<OutOfStockButton sku={sku} />);
        expect(shallowComponent.prop('children')).toBe('Out of Stock');
    });

    // it('it should render data-at for small view if it is within sticky footer', () => {
    //     shallowComponent = enzyme.shallow(
    //         <OutOfStockButton
    //             sku={sku}
    //             isSticky={true}
    //         />
    //     );
    //     const button = shallowComponent.findWhere(x => x.name() === 'Button' && x.prop('data-at') === 'out_of_stock_sticky_btn');

    //     expect(button.exists()).toBeTruthy();
    // });

    // it('it should render data-at for large view if it is not within sticky footer', () => {
    //     shallowComponent = enzyme.shallow(
    //         <OutOfStockButton
    //             sku={sku}
    //             isSticky={false}
    //         />
    //     );
    //     const button = shallowComponent.findWhere(x => x.name() === 'Button' && x.prop('data-at') === 'out_of_stock_btn');

    //     expect(button.exists()).toBeTruthy();
    // });
});
