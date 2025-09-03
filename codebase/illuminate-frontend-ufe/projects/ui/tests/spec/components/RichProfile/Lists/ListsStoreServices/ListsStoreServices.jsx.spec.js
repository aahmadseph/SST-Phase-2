// const React = require('react');
// const { shallow } = require('enzyme');

// describe('<ListStoreServices /> component', () => {
//     let ListStoreServices;
//     let shallowedComponent;

//     beforeEach(() => {
//         ListStoreServices = require('components/RichProfile/Lists/ListsStoreServices/ListsStoreServices').default;
//     });

//     it('should not display a ListHeader', () => {
//         shallowedComponent = shallow(<ListStoreServices />, { disableLifecycleMethods: true });
//         expect(shallowedComponent.find('ListsHeader').length).toBe(0);
//     });

//     it('should display a ListHeader if show store services', () => {
//         shallowedComponent = shallow(<ListStoreServices />, { disableLifecycleMethods: true });
//         shallowedComponent.setState({ showStoreServices: true });
//         expect(shallowedComponent.find('ListsHeader').length).toBe(1);
//     });

//     it('should not display a link of there are no digital makeover samples', () => {
//         shallowedComponent = shallow(<ListStoreServices />, { disableLifecycleMethods: true });
//         shallowedComponent.setState({ showStoreServices: true });
//         expect(shallowedComponent.find('ListsHeader').prop('link')).toBeNull();
//     });

//     it('should display a link of there are digital makeover samples', () => {
//         shallowedComponent = shallow(<ListStoreServices />, { disableLifecycleMethods: true });
//         shallowedComponent.setState({
//             digitalMakeoverSamples: [
//                 {
//                     dateToDisplay: '5678123',
//                     store: { displayName: 'Name' }
//                 }
//             ],
//             showStoreServices: true
//         });
//         expect(shallowedComponent.find('ListsHeader').prop('link')).toBe('/in-store-services');
//     });

//     it('should display a product items', () => {
//         shallowedComponent = shallow(<ListStoreServices />, { disableLifecycleMethods: true });
//         shallowedComponent.setState({
//             digitalMakeoverSamples: [
//                 {
//                     dateToDisplay: '5678123',
//                     store: { displayName: 'Name 1' }
//                 },
//                 {
//                     dateToDisplay: '5678123',
//                     store: { displayName: 'Name 2' }
//                 }
//             ],
//             showStoreServices: true
//         });
//         expect(shallowedComponent.find('ErrorBoundary(Connect(ProductItem))').length).toBe(2);
//     });
// });
