const React = require('react');
const { shallow } = require('enzyme');
const processEvent = require('analytics/processEvent').default;
const anaConsts = require('analytics/constants').default;
const ReviewsFilters = require('components/ProductPage/RatingsAndReviews/ReviewsFilters/ReviewsFilters').default;

describe('<ReviewsFilters />', () => {
    let wrapper;
    let component;
    let processSpy;

    beforeEach(() => {
        processSpy = spyOn(processEvent, 'process');
        wrapper = shallow(<ReviewsFilters productId={'123'} />, { disableLifecycleMethods: true });
    });

    describe('applyFilters', () => {
        it('should track analytics with the correct data', () => {
            wrapper.setState({
                selectedFilters: {
                    skinConcerns: ['Acne'],
                    skinType: ['Combination']
                }
            });
            component = wrapper.instance();
            component.applyFilters({
                beautyMatches: [true],
                skinConcerns: ['Acne'],
                skinType: ['Combination']
            });

            const filtersApplied = 'skin concerns=Acne|skin type=Combination|beauty matches=true';
            const action = 'reviews:ratings&reviews-filter';
            expect(processSpy).toHaveBeenCalledWith(anaConsts.LINK_TRACKING_EVENT, {
                data: {
                    filterSelections: filtersApplied,
                    selectedFilter: filtersApplied,
                    actionInfo: action,
                    linkName: action,
                    eventStrings: anaConsts.Event.EVENT_71
                }
            });
        });
    });
});
