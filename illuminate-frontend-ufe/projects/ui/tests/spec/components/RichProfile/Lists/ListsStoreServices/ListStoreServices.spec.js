// const React = require('react');
// const { shallow } = enzyme;

// describe('ListStoreServices component', () => {
//     let ListStoreServices;
//     let profileApi;
//     let dsgUtils;
//     let localeUtils;
//     let actions;
//     let store;

//     beforeEach(() => {
//         profileApi = require('services/api/profile/index').default;
//         dsgUtils = require('utils/dsg').default;
//         localeUtils = require('utils/LanguageLocale').default;
//         actions = require('Actions').default;
//         store = require('store/Store').default;
//         ListStoreServices = require('components/RichProfile/Lists/ListsStoreServices/ListsStoreServices').default;

//         spyOn(store, 'getState').and.returnValue({ user: { profileId: 0 } });
//     });

//     describe('componentDidMount', () => {
//         it('should call getProfileSamplesByDSG', () => {
//             const getProfileSamplesByDSGStub = spyOn(profileApi, 'getProfileSamplesByDSG').and.returnValue({ then: () => {} });
//             shallow(<ListStoreServices />);
//             expect(getProfileSamplesByDSGStub).toHaveBeenCalledWith(0, {
//                 limit: 16,
//                 includeInactiveSkus: true,
//                 itemsPerPage: 16
//             });
//         });

//         it('should call combineSkusIntoServices', done => {
//             // Arrange
//             const getProfileSamplesByDSGResult = ['abc'];
//             const getProfileSamplesByDSGStub = spyOn(profileApi, 'getProfileSamplesByDSG').and.resolveTo(getProfileSamplesByDSGResult);
//             const combineSkusIntoServicesStub = spyOn(dsgUtils, 'combineSkusIntoServices').and.returnValue([{ skus: [] }]);

//             // Act
//             shallow(<ListStoreServices />);

//             // Assert
//             getProfileSamplesByDSGStub.calls.mostRecent().returnValue.then(() => {
//                 expect(combineSkusIntoServicesStub).toHaveBeenCalledWith(getProfileSamplesByDSGResult);
//                 done();
//             });
//         });

//         it('should update state if there are skus available', done => {
//             // Arrange
//             const getProfileSamplesByDSGResult = ['abc'];
//             const getProfileSamplesByDSGStub = spyOn(profileApi, 'getProfileSamplesByDSG').and.resolveTo(getProfileSamplesByDSGResult);
//             const skus = [{}, {}];
//             spyOn(dsgUtils, 'combineSkusIntoServices').and.returnValue([{ skus }]);
//             const component = new ListStoreServices({});
//             const setStateStub = spyOn(component, 'setState');

//             // Act
//             component.componentDidMount();

//             // Assert
//             getProfileSamplesByDSGStub.calls.mostRecent().returnValue.then(() => {
//                 expect(setStateStub).toHaveBeenCalledWith({
//                     digitalMakeoverSamples: skus,
//                     showStoreServices: true
//                 });
//                 done();
//             });
//         });

//         it('should update state if there are not skus available but it is located in US', done => {
//             // Arrange
//             const getProfileSamplesByDSGStub = spyOn(profileApi, 'getProfileSamplesByDSG').and.resolveTo([]);
//             spyOn(localeUtils, 'isUS').and.returnValue(true);
//             const component = new ListStoreServices({});
//             const setStateStub = spyOn(component, 'setState');

//             // Act
//             component.componentDidMount();

//             // Assert
//             getProfileSamplesByDSGStub.calls.mostRecent().returnValue.then(() => {
//                 expect(setStateStub).toHaveBeenCalledWith({
//                     showStoreServices: true,
//                     showBookReservation: true
//                 });
//                 done();
//             });
//         });
//     });

//     describe('showFindInStore', () => {
//         it('should call dispatch', () => {
//             // Arrange
//             const event = { preventDefault: () => {} };
//             const product = {};
//             const stubAction = { type: 'StubAction' };
//             spyOn(actions, 'showFindInStoreModal').and.returnValue(stubAction);
//             const dispatchStub = spyOn(store, 'dispatch');
//             const component = new ListStoreServices({});

//             // Act
//             component.showFindInStore(event, product);

//             // Assert
//             expect(dispatchStub).toHaveBeenCalledWith(stubAction);
//         });

//         it('should call showFindInStoreModal', () => {
//             // Arrange
//             const event = { preventDefault: () => {} };
//             const product = {};
//             const showFindInStoreModalStub = spyOn(actions, 'showFindInStoreModal');
//             spyOn(store, 'dispatch');
//             const component = new ListStoreServices({});

//             // Act
//             component.showFindInStore(event, product);

//             // Assert
//             expect(showFindInStoreModalStub).toHaveBeenCalledWith(true, product);
//         });
//     });
// });
