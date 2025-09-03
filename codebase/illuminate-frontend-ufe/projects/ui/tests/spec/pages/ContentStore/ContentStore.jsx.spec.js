const { shallow } = require('enzyme');
const React = require('react');
const ContentStore = require('pages/ContentStore/ContentStore').default;

describe('ContentStore component', () => {
    it('should render not null', () => {
        // Arrange/Act
        const wrapper = shallow(<ContentStore />);

        // Assert
        expect(wrapper.isEmptyRender()).toBeFalsy();
    });

    it('should render BccBreadcrumbs component when desktop layout', () => {
        // Arrange
        spyOn(Sephora, 'isDesktop').and.returnValue(true);
        const props = { breadcrumbs: [] };

        // Act
        const wrapper = shallow(<ContentStore {...props} />);

        // Assert
        expect(wrapper.find('BccBreadCrumbs').exists()).toBeTruthy();
    });

    it('should render ContentStoreLeftNav component when desktop layout', () => {
        // Arrange
        spyOn(Sephora, 'isDesktop').and.returnValue(true);

        // Act
        const wrapper = shallow(<ContentStore />);

        // Assert
        expect(wrapper.find('ContentStoreLeftNav').exists()).toBeTruthy();
    });

    it('should render ContentStoreBody component', () => {
        // Arrange/Act
        const wrapper = shallow(<ContentStore />);

        // Assert
        expect(wrapper.find('ContentStoreBody').exists()).toBeTruthy();
    });

    it('should render RelatedLinks component', () => {
        // Arrange/Act
        const wrapper = shallow(<ContentStore />);

        // Assert
        expect(wrapper.find('RelatedLinks').exists()).toBeTruthy();
    });

    it('should pass correct props to RelatedLinks component', () => {
        // Arrange
        const props = {
            linkEquityBlock: {
                links: [
                    {
                        anchorText: 'Natural Hair Styling Products',
                        url: '/buy/natural-hair-styling-products'
                    },
                    {
                        anchorText: 'anchorText',
                        url: 'url'
                    }
                ]
            }
        };
        const relatedLinksProps = {
            lemDataSource: true,
            links: props.linkEquityBlock.links
        };

        // Act
        const wrapper = shallow(<ContentStore {...props} />);

        // Assert
        expect(wrapper.find('RelatedLinks').props()).toEqual(relatedLinksProps);
    });

    it('should render contentStore page with data at attribute', () => {
        // Act
        const wrapper = shallow(<ContentStore />);
        const dataAt = wrapper.findWhere(n => n.prop('data-at') === 'content_store_container');

        //Assert
        expect(dataAt.exists()).toEqual(true);
    });
});
