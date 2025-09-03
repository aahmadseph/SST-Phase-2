// import React from 'react';
// import { shallow } from 'enzyme';
// import MobileStickyMenu from 'components/ProductPage/MobileStickyMenu/MobileStickyMenu.ctrlr';

// describe('<MobileStickyMenu />', () => {
//     let wrapper;

//     beforeEach(() => {
//         wrapper = shallow(<MobileStickyMenu />);
//     });

//     it('should initialize with correct default state', () => {
//         const expectedState = {
//             activeId: '',
//             showNavBar: false,
//             isNavigatingByClick: false
//         };

//         expect(wrapper.state()).toEqual(expectedState);
//     });

//     it('should set up IntersectionObserver and event listeners on mount', () => {
//         const instance = wrapper.instance();
//         const observeSpy = spyOn(instance.observer, 'observe');
//         const addEventListenerSpy = spyOn(window, 'addEventListener');

//         instance.componentDidMount();

//         expect(addEventListenerSpy).toHaveBeenCalledWith('DebouncedScroll', instance.handlerScroll);

//         instance.menuItems.forEach(section => {
//             const element = document.getElementById(section.anchor);

//             if (element) {
//                 expect(observeSpy).toHaveBeenCalledWith(element);
//             }
//         });
//     });

//     it('should remove event listeners and disconnect observer on unmount', () => {
//         const instance = wrapper.instance();
//         const removeEventListenerSpy = spyOn(window, 'removeEventListener');
//         const disconnectSpy = spyOn(instance.observer, 'disconnect');

//         instance.componentWillUnmount();

//         expect(removeEventListenerSpy).toHaveBeenCalledWith('DebouncedScroll', instance.handlerScroll);
//         expect(disconnectSpy).toHaveBeenCalled();
//     });

//     it('should update showNavBar as true and activeId as details', () => {
//         const instance = wrapper.instance();
//         const scrollSpy = spyOn(instance, 'handlerScroll').and.callThrough();
//         const setStateSpy = spyOn(instance, 'setState');
//         spyOnProperty(window, 'scrollY', 'get').and.returnValue(1100);

//         instance.handlerScroll();

//         expect(scrollSpy).toHaveBeenCalled();
//         expect(setStateSpy).toHaveBeenCalledWith({
//             showNavBar: true,
//             activeId: 'details'
//         });
//     });

//     it('should update showNavBar as false and activeId as details', () => {
//         const instance = wrapper.instance();
//         wrapper.setState({
//             showNavBar: true,
//             activeId: 'similar'
//         });
//         const scrollSpy = spyOn(instance, 'handlerScroll').and.callThrough();
//         const setStateSpy = spyOn(instance, 'setState');
//         spyOnProperty(window, 'scrollY', 'get').and.returnValue(100);

//         instance.handlerScroll();

//         expect(scrollSpy).toHaveBeenCalled();
//         expect(setStateSpy).toHaveBeenCalledWith({
//             showNavBar: false,
//             activeId: 'details'
//         });
//     });

//     it('should render correctly when navbar is visible', () => {
//         wrapper.setState({ showNavBar: true });

//         expect(wrapper.find('Box').exists()).toBe(true);
//         expect(wrapper.find('Link').length).toEqual(wrapper.instance().menuItems.length);
//     });

//     it('should not render when navbar is not visible', () => {
//         wrapper.setState({ showNavBar: false });

//         expect(wrapper.isEmptyRender()).toBe(true);
//     });

//     it('should navigate to anchor when link is clicked', () => {
//         const instance = wrapper.instance();
//         wrapper.setState({ showNavBar: true });
//         const firstAnchor = instance.menuItems[0].anchor;
//         const spyDebounceScrollSmooth = spyOn(instance, 'debounceScrollSmooth');

//         instance.navigateToAnchor(firstAnchor)({ preventDefault: () => {} });

//         expect(wrapper.state().isNavigatingByClick).toBe(true);
//         expect(wrapper.state().activeId).toEqual(firstAnchor);
//         expect(spyDebounceScrollSmooth).toHaveBeenCalledWith(firstAnchor);
//     });
// });
