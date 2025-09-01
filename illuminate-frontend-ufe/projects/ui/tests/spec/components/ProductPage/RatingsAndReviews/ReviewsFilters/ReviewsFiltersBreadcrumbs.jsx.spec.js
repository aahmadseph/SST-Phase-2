const React = require('react');
const { shallow } = require('enzyme');
const { createSpy } = jasmine;
const ReviewsFiltersBreadcrumbs = require('components/ProductPage/RatingsAndReviews/ReviewsFilters/ReviewsFiltersBreadcrumbs').default;

describe('<ReviewsFiltersBreadcrumbs />', () => {
    let wrapper;
    let onClearAllFiltersSpy;
    let selectedFilters;

    beforeEach(() => {
        onClearAllFiltersSpy = createSpy();
        selectedFilters = { skinType: ['Normal'] };

        wrapper = shallow(
            <ReviewsFiltersBreadcrumbs
                selectedFilters={selectedFilters}
                onClearAllFilters={onClearAllFiltersSpy}
            />
        );
    });

    describe('render', () => {
        it('should render Clear all link when a filter is applied', () => {
            const clearAllLink = wrapper.findWhere(x => x.name() === 'Link' && x.text() === 'Clear all');

            expect(clearAllLink.exists()).toBeTruthy();
        });
    });

    describe('Clear all CTA', () => {
        it('should call the onClearAllFilters method passed as a parameter', () => {
            const clearAllLink = wrapper.findWhere(x => x.name() === 'Link' && x.text() === 'Clear all');
            clearAllLink.simulate('click');

            expect(onClearAllFiltersSpy).toHaveBeenCalled();
        });

        it('should see if data at attribute is set for Clear all text', () => {
            const clearAllLink = wrapper.findWhere(x => x.name() === 'Link' && x.prop('data-at') === 'clear_all_link');
            expect(clearAllLink.exists()).toBeTruthy();
        });
    });
});
