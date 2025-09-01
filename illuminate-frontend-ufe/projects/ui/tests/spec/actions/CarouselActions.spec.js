describe('CarouselActions', () => {
    const CarouselActions = require('actions/CarouselActions').default;

    it('should return a TYPE of HOVERED_CAROUSEL_ITEM', () => {
        const actual = CarouselActions.carouselItemHovered('', 1, false);
        const expected = CarouselActions.TYPES.HOVERED_CAROUSEL_ITEM;
        expect(actual.type).toEqual(expected);
    });

    it('should return a TYPE of MOVED_OVER_CAROUSEL_ITEM', () => {
        const actual = CarouselActions.carouselItemMovedOver('', 1, {});
        const expected = CarouselActions.TYPES.MOVED_OVER_CAROUSEL_ITEM;
        expect(actual.type).toEqual(expected);
    });

    it('should return a TYPE of CLICKED_CAROUSEL_ITEM', () => {
        const actual = CarouselActions.carouselItemClicked('', 1);
        const expected = CarouselActions.TYPES.CLICKED_CAROUSEL_ITEM;
        expect(actual.type).toEqual(expected);
    });
});
