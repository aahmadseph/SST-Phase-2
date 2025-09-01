// Temp removal of BeautyMatchFilter as per AC1 in https://jira.sephora.com/browse/INFL-642
// const React = require('react');
// const { shallow } = require('enzyme');
// const BeautyMatchFilter = require('components/ProductPage/RatingsAndReviews/ReviewsFilters/BeautyMatchFilter').default;
// const biProfile = require('utils/BiProfile').default;
// const communityUtils = require('utils/Community').default;
// const { createSpy } = jasmine;

// describe('<BeautyMatchFilter />', () => {
//     let props;
//     let applyFiltersSpy;
//     beforeEach(() => {
//         props = {
//             name: 'beautyMatches',
//             filtersConfiguration: [],
//             selectedFilters: {},
//             applyFilters: () => {}
//         };
//         applyFiltersSpy = spyOn(props, 'applyFilters');
//     });

//     describe('render()', () => {
//         it('should render Pill if hasAllTraits', () => {
//             const wrapper = shallow(<BeautyMatchFilter {...props} />, { disableLifecycleMethods: true });
//             wrapper.setState({
//                 isBiUser: false,
//                 hasAllTraits: true
//             });
//             const pill = wrapper.find('Pill');

//             expect(pill.exists()).toBeTruthy();
//         });

//         it('should render Pill if is not BI user', () => {
//             const wrapper = shallow(<BeautyMatchFilter {...props} />, { disableLifecycleMethods: true });
//             wrapper.setState({
//                 isBiUser: false,
//                 hasAllTraits: false
//             });
//             const pill = wrapper.find('Pill');

//             expect(pill.exists()).toBeTruthy();
//         });
//     });

//     describe('toggle', () => {
//         it('it should call ensureUserIsReadyForSocialAction', () => {
//             const ensureUserIsReadyForSocialActionStub = spyOn(communityUtils, 'ensureUserIsReadyForSocialAction').and.returnValue({
//                 then: createSpy().and.returnValue({ catch: () => {} })
//             });
//             const wrapper = shallow(<BeautyMatchFilter {...props} />);
//             const component = wrapper.instance();
//             component.toggle();
//             expect(ensureUserIsReadyForSocialActionStub).toHaveBeenCalledWith(communityUtils.PROVIDER_TYPES.lithium);
//         });
//     });

//     describe('applyBeautyTraits()', () => {
//         it('should apply only BM filter itself if no any intersection with filtersConfiguration found', () => {
//             const wrapper = shallow(<BeautyMatchFilter {...props} />, { disableLifecycleMethods: true });
//             const biInfo = { someTrait1: 'someValue1' };
//             spyOn(biProfile, 'getBiProfileInfo').and.returnValue(biInfo);

//             const component = wrapper.instance();
//             component.applyBeautyTraits(true);

//             const expectedFilters = { [props.name]: [true] };
//             expect(applyFiltersSpy).toHaveBeenCalledWith(expectedFilters);
//         });

//         it('should remove only BM filter itself if no any intersection with filtersConfiguration found', () => {
//             const wrapper = shallow(<BeautyMatchFilter {...props} />, { disableLifecycleMethods: true });
//             const biInfo = { someTrait1: 'someValue1' };
//             spyOn(biProfile, 'getBiProfileInfo').and.returnValue(biInfo);

//             const component = wrapper.instance();
//             component.applyBeautyTraits(false);

//             const expectedFilters = { [props.name]: [] };
//             expect(applyFiltersSpy).toHaveBeenCalledWith(expectedFilters);
//         });

//         it('should apply BM filter itself and mapped contextual Trait from filtersConfiguration', () => {
//             const biInfo = {
//                 someTrait1: 'someValue11',
//                 someTrait2: 'someValue21'
//             };
//             spyOn(biProfile, 'getBiProfileInfo').and.returnValue(biInfo);
//             props.filtersConfiguration = [
//                 {
//                     id: 'someTrait1',
//                     contextual: true,
//                     options: [{ value: 'someValue11' }, { value: 'someValue12' }]
//                 },
//                 {
//                     id: 'someTrait2',
//                     contextual: false,
//                     options: [{ value: 'someValue21' }, { value: 'someValue22' }]
//                 }
//             ];
//             const wrapper = shallow(<BeautyMatchFilter {...props} />, { disableLifecycleMethods: true });
//             const component = wrapper.instance();

//             component.applyBeautyTraits(true);

//             const expectedFilters = {
//                 [props.name]: [true],
//                 ['someTrait1']: [biInfo['someTrait1']]
//             };
//             expect(applyFiltersSpy).toHaveBeenCalledWith(expectedFilters);
//         });

//         it('should remove BM filter itself and mapped contextual Trait value from filtersConfiguration from the selection', () => {
//             const biInfo = {
//                 someTrait1: 'someValue11',
//                 someTrait2: 'someValue21'
//             };
//             spyOn(biProfile, 'getBiProfileInfo').and.returnValue(biInfo);
//             props.selectedFilters = { someTrait1: ['someValue11', 'someValue12'] };
//             props.filtersConfiguration = [
//                 {
//                     id: 'someTrait1',
//                     contextual: true,
//                     options: [{ value: 'someValue11' }, { value: 'someValue12' }]
//                 },
//                 {
//                     id: 'someTrait2',
//                     contextual: false,
//                     options: [{ value: 'someValue21' }, { value: 'someValue22' }]
//                 }
//             ];
//             const wrapper = shallow(<BeautyMatchFilter {...props} />, { disableLifecycleMethods: true });
//             const component = wrapper.instance();

//             component.applyBeautyTraits(false);

//             const expectedFilters = {
//                 ['someTrait1']: ['someValue12'],
//                 [props.name]: []
//             };
//             expect(applyFiltersSpy).toHaveBeenCalledWith(expectedFilters);
//         });
//     });
// });
