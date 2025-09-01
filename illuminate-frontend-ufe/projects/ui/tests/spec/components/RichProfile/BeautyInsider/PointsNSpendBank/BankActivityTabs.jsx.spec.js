describe('<BankActivityTabs /> component', () => {
    let React;
    let BankActivityTabs;
    let shallowComponent;

    beforeEach(() => {
        const { Box } = require('components/ui');
        React = require('react');
        BankActivityTabs = require('components/RichProfile/BeautyInsider/PointsNSpendBank/BankActivityTabs').default;
        shallowComponent = enzyme.shallow(
            <BankActivityTabs>
                <Box />
                <Box />
            </BankActivityTabs>
        );
    });

    it('should renders tabs sent', () => {
        expect(shallowComponent.find('Box').length).toEqual(2);
    });
});
