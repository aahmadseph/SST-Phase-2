// /* eslint-disable object-curly-newline */
// const React = require('react');
// // eslint-disable-next-line no-undef
// const { shallow } = enzyme;
// const { any, objectContaining } = jasmine;

// describe('BccProductFinder component', () => {
//     let BccProductFinder;
//     let analyticsConstants;
//     let processEvent;
//     let wrapper;

//     beforeEach(() => {
//         BccProductFinder = require('components/Bcc/BccProductFinder/BccProductFinder').default;
//         analyticsConstants = require('analytics/constants').default;
//         processEvent = require('analytics/processEvent').default;
//     });

//     it('openProductFinderModal should fire link tracking event with proper data', () => {
//         // Arrange
//         const process = spyOn(processEvent, 'process');
//         digitalData.page.attributes.sephoraPageInfo.pageName = 'quiz page';

//         // Act
//         wrapper = shallow(<BccProductFinder name='bcc_product_finder' />);
//         const component = wrapper.instance();
//         component.openProductFinderModal();

//         // Assert
//         expect(process).toHaveBeenCalledWith(analyticsConstants.LINK_TRACKING_EVENT, {
//             data: {
//                 bindingMethods: [any(Function)],
//                 pageDetail: 'start-quiz',
//                 actionInfo: 'productfinder:start-quiz:bcc_product_finder',
//                 bccComponentName: 'productfinder:start-quiz:bcc_product_finder',
//                 pageName: 'productfinder:start-quiz:bcc_product_finder',
//                 previousPage: 'quiz page'
//             }
//         });
//     });

//     describe('when starting a new quiz', () => {
//         let Storage;
//         let getItemStub;
//         let BCC;

//         beforeEach(() => {
//             BccProductFinder = require('components/Bcc/BccProductFinder/BccProductFinder').default;
//             Storage = require('utils/localStorage/Storage').default;
//             getItemStub = spyOn(Storage.session, 'getItem');
//             BCC = require('utils/BCC').default;
//         });

//         it('initial state should not contains the quiz cache', () => {
//             wrapper = shallow(<BccProductFinder />);
//             const component = wrapper.instance();
//             component.setInitialState();

//             expect(wrapper.state()).toEqual(
//                 objectContaining({
//                     quizResults: [],
//                     skuGroups: [],
//                     isQuizSubmitted: false
//                 })
//             );
//         });

//         it('sould call the Storage.getItem method', () => {
//             wrapper = shallow(<BccProductFinder />);
//             const component = wrapper.instance();
//             component.setInitialState();

//             expect(getItemStub).toHaveBeenCalled();
//         });

//         it('should call the getQuizName helper', () => {
//             const getQuizNameSpy = spyOn(BCC, 'getQuizName');
//             wrapper = shallow(<BccProductFinder />);
//             const component = wrapper.instance();
//             component.setInitialState();

//             expect(getQuizNameSpy).toHaveBeenCalled();
//         });

//         it('should call the retrieveQuizResults helper', () => {
//             const retrieveQuizResultsSpy = spyOn(BCC, 'retrieveQuizResults');
//             wrapper = shallow(<BccProductFinder />);
//             const component = wrapper.instance();
//             component.setInitialState();

//             expect(retrieveQuizResultsSpy).toHaveBeenCalled();
//         });

//         it('should call the removeQuizResults helper', () => {
//             const removeQuizResultsSpy = spyOn(BCC, 'removeQuizResults');
//             wrapper = shallow(<BccProductFinder />);
//             const component = wrapper.instance();
//             component.setInitialState();

//             expect(removeQuizResultsSpy).toHaveBeenCalled();
//         });

//         it('should call the persistQuizResults helper', () => {
//             const persistQuizResultsSpy = spyOn(BCC, 'persistQuizResults');
//             const props = {
//                 componentList: [1, 2, 9]
//             };

//             wrapper = shallow(<BccProductFinder {...props} />);
//             wrapper.setState({
//                 isQuizSubmitted: true,
//                 skuGroups: ['gr1', 'gr2']
//             });
//             const component = wrapper.instance();
//             component.setInitialState();
//             wrapper.setProps({
//                 componentList: [1, 2, 9]
//             });

//             expect(persistQuizResultsSpy).toHaveBeenCalled();
//         });

//         it('initial state should contains the quiz cache when backing from the quiz results', () => {
//             const props = {
//                 componentList: [1, 2, 9]
//             };

//             wrapper = shallow(
//                 <BccProductFinder
//                     name='bcc_product_finder'
//                     {...props}
//                 />
//             );
//             wrapper.setState({
//                 isQuizSubmitted: true,
//                 skuGroups: ['gr1', 'gr2']
//             });
//             const component = wrapper.instance();
//             component.setInitialState();

//             expect(wrapper.state()).toEqual(
//                 objectContaining({
//                     skuGroups: ['gr1', 'gr2'],
//                     isQuizSubmitted: true
//                 })
//             );
//         });
//     });

//     describe('if quiz is submitted', () => {
//         beforeEach(() => {
//             wrapper = shallow(<BccProductFinder name='bcc_product_finder' />);
//             wrapper.setState({
//                 isQuizSubmitted: true
//             });
//         });

//         it('should render result image', () => {
//             expect(wrapper.findWhere(n => n.key() === 'resultsImageWrapper').length).toEqual(1);
//         });

//         describe('quiz div', () => {
//             it('should contain ErrorMsg if quizResults is empty', () => {
//                 wrapper.setState({
//                     skuGroups: [],
//                     quizResults: []
//                 });
//                 expect(wrapper.find('div ErrorMsg').length).toEqual(1);
//             });

//             it('should not contain ErrorMsg if quizResults is not empty', () => {
//                 wrapper.setState({
//                     skuGroups: [],
//                     quizResults: ['gr1', 'gr2']
//                 });
//                 expect(wrapper.find('div ErrorMsg').length).toEqual(0);
//             });
//         });

//         describe('if componentList is not empty', () => {
//             beforeEach(() => {
//                 wrapper.setProps({
//                     componentList: [1, 2, 9]
//                 });
//                 wrapper.setState({
//                     skuGroups: ['gr1', 'gr2']
//                 });
//             });

//             it('should contain BccComponentList', () => {
//                 expect(wrapper.find('div BccComponentList').at(0).prop('items')).toEqual([1, 2, 9]);
//             });

//             it('should not contain ProductFinderGrid', () => {
//                 expect(wrapper.find('div ProductFinderGrid').length).toEqual(0);
//             });
//         });

//         describe('if componentList is empty', () => {
//             beforeEach(() => {
//                 wrapper.setState({
//                     skuGroups: ['gr1', 'gr2']
//                 });
//             });

//             it('should not contain BccComponentList', () => {
//                 expect(wrapper.find('div BccComponentList').length).toEqual(0);
//             });

//             it('should contain ProductFinderGrid', () => {
//                 expect(wrapper.find('div ProductFinderGrid').at(0).prop('products')).toEqual(['gr1', 'gr2']);
//             });
//         });

//         it('should render bottom image', () => {
//             expect(wrapper.findWhere(n => n.key() === 'bottomImageWrapper').length).toEqual(1);
//         });

//         it('should not render launch image', () => {
//             expect(wrapper.findWhere(n => n.key() === 'launchImageWrapper').length).toEqual(0);
//         });
//     });
// });
