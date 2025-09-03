describe('CatalogLayout Component', () => {
    let React;
    let component;
    let CatalogLayout;
    const props = {
        content: {
            top: {},
            bottom: {},
            sidebar: {},
            main: {}
        },
        currentPage: 1,
        isBrand: false,
        isSearch: false
    };

    beforeEach(() => {
        React = require('react');
        CatalogLayout = require('components/Catalog/CatalogLayout/CatalogLayout').default;
        component = enzyme.shallow(<CatalogLayout {...props} />);
    });

    describe('render method', () => {
        it('should render Container', () => {
            expect(component.find('Container').length).toBe(1);
        });

        it('should render Grid', () => {
            expect(component.find('Grid').length).toBe(1);
        });
        /* these tests do not work with React.memo, known limitation https://github.com/enzymejs/enzyme/issues/2196
        it('should render div', () => {
            expect(component.find('div').length).toBe(2);
        });

        it('should render main', () => {
            expect(component.find('main').length).toBe(1);
        });
        */

        it('should render BackToTopButton', () => {
            expect(component.find('BackToTopButton').length).toBe(1);
        });
    });
});
