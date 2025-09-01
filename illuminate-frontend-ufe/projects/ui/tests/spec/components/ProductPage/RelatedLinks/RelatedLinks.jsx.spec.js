/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
const React = require('react');
const { shallow } = require('enzyme');
const RelatedLinks = require('components/ProductPage/RelatedLinks').default;

describe('<RelatedLinks />', () => {
    describe('should not render', () => {
        it('if links not provided', () => {
            const component = shallow(<RelatedLinks />);
            expect(component.isEmptyRender()).toBeTruthy();
        });

        it('if empty links provided', () => {
            const component = shallow(<RelatedLinks links={[]} />);
            expect(component.isEmptyRender()).toBeTruthy();
        });
    });

    describe('should render', () => {
        let relatedLinks;

        beforeEach(() => {
            relatedLinks = [
                {
                    related_page_url: 'url1',
                    related_page_name: 'name1'
                },
                {
                    related_page_url: 'url2',
                    related_page_name: 'name2'
                }
            ];
        });

        it('two Links', () => {
            const component = shallow(<RelatedLinks links={relatedLinks} />);
            expect(component.find('Link').length).toEqual(2);
        });

        it('with correct data-at attribute', () => {
            // Arrange
            const component = shallow(<RelatedLinks links={relatedLinks} />, { disableLifecycleMethods: true });
            const textElement = component.find('[data-at="related_pages"]');

            // Assert
            expect(textElement.exists()).toBe(true);
        });

        it('if links is not empty', () => {
            const component = shallow(<RelatedLinks links={[{}]} />);
            expect(component.isEmptyRender()).toBeFalsy();
        });
    });
});
