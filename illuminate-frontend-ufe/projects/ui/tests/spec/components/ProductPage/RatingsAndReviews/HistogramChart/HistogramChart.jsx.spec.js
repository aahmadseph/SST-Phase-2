// const React = require('react');
// const { shallow } = require('enzyme');
// const { createSpy } = jasmine;
// const HistogramChart = require('components/ProductPage/RatingsAndReviews/HistogramChart/HistogramChart').default;
// const store = require('Store').default;
// const ProductActions = require('actions/ProductActions').default;
// const Filters = require('utils/Filters').default;
// const RATING = Filters.REVIEW_FILTERS?.rating?.bvName?.toLowerCase();

// describe('<HistogramChart />', () => {
//     let component;
//     beforeEach(() => {
//         component = shallow(
//             <HistogramChart
//                 ratingDistribution={[
//                     {
//                         RatingValue: 1,
//                         Count: 5
//                     },
//                     {
//                         RatingValue: 2,
//                         Count: 4
//                     },
//                     {
//                         RatingValue: 3,
//                         Count: 3
//                     },
//                     {
//                         RatingValue: 4,
//                         Count: 2
//                     },
//                     {
//                         RatingValue: 5,
//                         Count: 1
//                     }
//                 ]}
//                 totalReviewCount={40}
//                 percentage={createSpy().and.returnValue(5)}
//             />
//         );
//     });

//     it('should render ratings bars', () => {
//         expect(component.find('Flex').length).toBe(5);
//     });

//     it('should dispatch the filtering ', () => {
//         spyOn(store, 'dispatch');
//         const selectReviewFiltersStub = spyOn(ProductActions, 'selectReviewFilters');
//         component.find('Flex').at(0).simulate('click');
//         expect(selectReviewFiltersStub).toHaveBeenCalledWith({ [RATING]: ['5'] });
//     });
// });
