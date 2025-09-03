const React = require('react');
const { shallow } = enzyme;

describe('ListsLoves component', () => {
    let ListsLoves;
    let shallowedComponent;

    beforeEach(() => {
        ListsLoves = require('components/RichProfile/Lists/ListsLoves/ListsLoves').default;
    });

    describe('with no products list', () => {
        beforeEach(() => {
            shallowedComponent = shallow(<ListsLoves />);
        });

        it('should display ListsHeader', () => {
            expect(shallowedComponent.find('ListsHeader').length).toBe(1);
        });

        it('should has no link', () => {
            expect(shallowedComponent.find('ListsHeader').prop('link')).toBeNull();
        });

        it('should no display products carrousel', () => {
            expect(shallowedComponent.find('LegacyCarousel').length).toBe(0);
        });

        it('should display a informative text', () => {
            expect(shallowedComponent.find('Text').length).toBe(1);
        });
    });

    describe('with products list', () => {
        const loveList = [
            {
                skuId: '001',
                actionFlags: { backInStockReminderStatus: '' }
            },
            {
                skuId: '002',
                actionFlags: { backInStockReminderStatus: '' }
            }
        ];

        beforeEach(() => {
            shallowedComponent = shallow(<ListsLoves loves={loveList} />);
        });

        it('should has link', () => {
            expect(shallowedComponent.find('ListsHeader').prop('link')).toBe('/shopping-list');
        });

        it('should display products carrousel', () => {
            expect(shallowedComponent.find('LegacyCarousel').length).toBe(1);
        });

        it('should display products in carrousel', () => {
            expect(shallowedComponent.find('ErrorBoundary(Connect(ProductItem))').length).toBe(2);
        });

        it('should not display a informative text', () => {
            expect(shallowedComponent.find('Text').length).toBe(0);
        });
    });
});
