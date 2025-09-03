/* eslint-disable camelcase */
const { mount } = require('enzyme');
const React = require('react');
const RelatedLinks = require('components/RelatedLinks/RelatedLinks').default;

describe('RelatedLinks component', () => {
    it('should render nothing when links are not provided', () => {
        // Arrange/Act
        const wrapper = mount(<RelatedLinks />);

        // Assert
        expect(wrapper.isEmptyRender()).toBeTruthy();
    });

    // it('should render all provided links', () => {
    //     // Arrange
    //     const props = {
    //         links: [
    //             {
    //                 related_page_name: 'related_page_name',
    //                 related_page_url: 'related_page_url'
    //             },
    //             {
    //                 related_page_name: 'related_page_name2',
    //                 related_page_url: 'related_page_url2'
    //             }
    //         ]
    //     };

    //     // Act
    //     const wrapper = mount(<RelatedLinks {...props} />);

    //     // Assert
    //     expect(wrapper.find('Flex > Link').length).toEqual(props.links.length);
    // });

    // it('should render converted LEM links', () => {
    //     // Arrange
    //     const props = {
    //         lemDataSource: true,
    //         links: [
    //             {
    //                 anchorText: 'Natural Hair Styling Products',
    //                 url: '/buy/natural-hair-styling-products'
    //             },
    //             {
    //                 anchorText: 'anchorText',
    //                 url: 'url'
    //             }
    //         ]
    //     };
    //     const wrapper = mount(<RelatedLinks {...props} />);
    //     const control = wrapper.instance();
    //     const convertLemLinks = spyOn(control, 'convertLemLinks');

    //     // Act
    //     control.forceUpdate();

    //     // Assert
    //     expect(convertLemLinks).toHaveBeenCalled();
    // });

    it('should not convert not LEM links', () => {
        // Arrange
        const props = {
            lemDataSource: false,
            links: [
                {
                    related_page_name: 'related_page_name',
                    related_page_url: 'related_page_url'
                }
            ]
        };
        const wrapper = mount(<RelatedLinks {...props} />);
        const control = wrapper.instance();
        const convertLemLinks = spyOn(control, 'convertLemLinks');

        // Act
        control.forceUpdate();

        // Assert
        expect(convertLemLinks).not.toHaveBeenCalled();
    });

    it('should not render provided links within flex container for mobile layout', () => {
        // Arrange
        spyOn(Sephora, 'isMobile').and.returnValue(true);
        const props = {
            links: [
                {
                    related_page_name: 'related_page_name',
                    related_page_url: 'related_page_url'
                },
                {
                    related_page_name: 'related_page_name2',
                    related_page_url: 'related_page_url2'
                }
            ]
        };

        // Act
        const wrapper = mount(<RelatedLinks {...props} />);

        // Assert
        expect(wrapper.find('Flex > Link').exists()).toBeFalsy();
    });
});
