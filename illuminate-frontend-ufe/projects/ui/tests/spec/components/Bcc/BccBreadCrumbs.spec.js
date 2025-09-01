describe('BccBreadcrumbs Component', () => {
    let BccBreadcrumbs;
    let breadcrumbsData;
    let React;
    let shallowComponent;
    let breadcrumb1;
    let breadcrumb2;

    beforeEach(() => {
        React = require('react');
        BccBreadcrumbs = require('components/Bcc/BccBreadCrumbs/BccBreadCrumbs').default;
    });

    describe('#render method', () => {
        beforeEach(() => {
            breadcrumbsData = [
                {
                    name: 'buying guides',
                    link: '/beauty/best-beauty-product'
                },
                { name: 'profile' },
                {
                    isSelected: true,
                    name: 'sparkle makeup'
                }
            ];
            shallowComponent = enzyme.shallow(<BccBreadcrumbs breadcrumbs={breadcrumbsData} />);
            breadcrumb1 = shallowComponent.find('Link').get(0);
            breadcrumb2 = shallowComponent.find('Text').get(0);
        });

        it('should render Text component if link not provided', () => {
            expect(breadcrumb2.type.displayName).toBe('Text');
        });

        it('should render Text component with gray color if isSelected is true', () => {
            expect(breadcrumb2.type.displayName).toBe('Text');
            expect(breadcrumb2.props.color).toBe('gray');
        });

        /*
        it('should render Link component if link provided', () => {
            expect(breadcrumb1.type.prototype.class).toBe('Link');
            expect(breadcrumb1.props.href).toBe('/beauty/best-beauty-product');
        });
        */

        it('should render all the correct components and text for breadcrumbs data', () => {
            expect(shallowComponent.find('Link').length).toBe(1);
            expect(shallowComponent.find('Text').length).toBe(1);
            expect(breadcrumb1.props.children).toBe('buying guides');
            expect(breadcrumb2.props.children).toBe('sparkle makeup');
        });

        it('should skip breadcrumb if link is missing and not the last item', () => {
            expect(shallowComponent.find('Text').length).not.toBe(2);
            expect(breadcrumb2.props.children).not.toBe('profile');
        });
    });
});
