const React = require('react');
const { shallow } = require('enzyme');
const ReviewsImageCarousel = require('components/ProductPage/ReviewsImageCarousel/ReviewsImageCarousel').default;

describe('<ReviewsImageCarousel />', () => {
    let componentProps;

    beforeEach(() => {
        componentProps = {
            reviewsWithImage: [],
            reviewImages: [
                { smallImage: '/productimages/sku/s1805662+sw.jpg' },
                { smallImage: '/productimages/sku/s1805663+sw.jpg' },
                { smallImage: '/productimages/sku/s1805664+sw.jpg' },
                { smallImage: '/productimages/sku/s1805665+sw.jpg' },
                { smallImage: '/productimages/sku/s1805666+sw.jpg' }
            ]
        };
    });

    it('should render Text title with its data-at', () => {
        const component = shallow(<ReviewsImageCarousel {...componentProps} />);
        component.setState({
            reviewImages: [{ smallImage: '/productimages/sku/s1805662+sw.jpg' }]
        });
        const elementName = component.findWhere(n => n.prop('data-at') === `${Sephora.debug.dataAt('image_carousel_title')}`).name();
        expect(elementName).toEqual('Text');
    });

    it('should render LazyLoad Carousel with its data-at', () => {
        const component = shallow(<ReviewsImageCarousel {...componentProps} />);
        component.setState({
            reviewImages: [{ smallImage: '/productimages/sku/s1805662+sw.jpg' }]
        });
        const elementName = component.findWhere(n => n.prop('dataAt') === 'image_carousel').name();
        expect(elementName).toEqual('LazyLoad');
    });

    describe('handleResize', () => {
        it('should change isFlush state to false if containerPaddedMatches', () => {
            // Arrange
            const component = shallow(<ReviewsImageCarousel {...componentProps} />);
            const instance = component.instance();
            instance.state = { isFlush: true };
            const setStateSpy = spyOn(instance, 'setState');
            spyOn(instance, 'containerPaddedMatches').and.returnValue(true);

            // Act
            instance.handleResize();

            // Assert
            expect(setStateSpy).toHaveBeenCalledWith({ isFlush: false });
        });

        it('should change isFlush state to true if not containerPaddedMatches', () => {
            // Arrange
            const component = shallow(<ReviewsImageCarousel {...componentProps} />);
            const instance = component.instance();
            instance.state = { isFlush: false };
            const setStateSpy = spyOn(instance, 'setState');
            spyOn(instance, 'containerPaddedMatches').and.returnValue(false);

            // Act
            instance.handleResize();

            // Assert
            expect(setStateSpy).toHaveBeenCalledWith({ isFlush: true });
        });
    });
});
