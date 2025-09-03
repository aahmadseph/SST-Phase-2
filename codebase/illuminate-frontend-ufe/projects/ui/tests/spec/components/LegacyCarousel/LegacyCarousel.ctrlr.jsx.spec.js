// const React = require('react');
// const { shallow } = require('enzyme');
// const { createSpy, any } = jasmine;

// describe('LegacyCarousel component', () => {
//     let LegacyCarousel;
//     let shallowedComponent;
//     let Hammer;
//     let Events;
//     let UI;
//     let store;
//     let CarouselActions;
//     let Actions;
//     let props;
//     let mockedProps;

//     beforeEach(() => {
//         mockedProps = {
//             lazyLoad: 'img',
//             displayCount: 5,
//             totalItems: 10,
//             isEnableCircle: false,
//             delay: false,
//             children: {}
//         };
//         Events = Sephora.Util;
//         LegacyCarousel = require('components/LegacyCarousel/LegacyCarousel').default;
//         UI = require('utils/UI').default;
//         Hammer = require('react-hammerjs');
//         store = require('Store').default;
//         CarouselActions = require('actions/CarouselActions').default;
//         Actions = require('actions/Actions').default;
//         shallowedComponent = shallow(<LegacyCarousel {...mockedProps} />);
//     });

//     it('should render main component', () => {
//         const mainDiv = shallowedComponent.find('div').at(0);
//         expect(mainDiv.prop('data-lload')).toBe('img');
//     });

//     it('should render touts components', () => {
//         const mainDiv = shallowedComponent.find('div').at(0);
//         expect(mainDiv.find('button').length).toBe(2);
//     });

//     it('should render the slideshow if available', () => {
//         mockedProps.isSlideshow = true;
//         shallowedComponent = shallow(<LegacyCarousel {...mockedProps} />);
//         expect(shallowedComponent.find({ role: 'tablist' }).length).toBe(1);
//     });

//     it('should render Hammer component', () => {
//         expect(shallowedComponent.find({ 'data-hammer-carousel-inner': true }).length).toBe(1);
//     });

//     describe('display arrow buttons', () => {
//         it('should not render previous arrow if is true', () => {
//             expect(shallowedComponent.find({ 'aria-label': 'Previous' }).length).toBe(0);
//         });

//         it('should not render next arrow if prop exists and it is true', () => {
//             expect(shallowedComponent.find({ 'aria-label': 'Next' }).length).toBe(0);
//         });

//         it('should not render previous arrow if prop exists and it is true', () => {
//             mockedProps.showArrows = true;
//             shallowedComponent = shallow(<LegacyCarousel {...mockedProps} />);
//             expect(shallowedComponent.find({ 'aria-label': 'Previous' }).length).toBe(1);
//         });

//         it('should not render next arrow if prop exists and it is true', () => {
//             mockedProps.showArrows = true;
//             shallowedComponent = shallow(<LegacyCarousel {...mockedProps} />);
//             expect(shallowedComponent.find({ 'aria-label': 'Next' }).length).toBe(1);
//         });
//     });

//     it('should render play button component if has pause activated', () => {
//         mockedProps.isEnableCircle = true;
//         mockedProps.delay = true;
//         shallowedComponent = shallow(<LegacyCarousel {...mockedProps} />);
//         expect(shallowedComponent.find('IconPlay').length).toBe(1);
//     });

//     describe('Should display data-at on Carousel', () => {
//         beforeEach(() => {
//             shallowedComponent = shallow(<LegacyCarousel {...mockedProps} />);
//         });

//         it('should have data-at property for product_carousel', () => {
//             const dataAt = shallowedComponent.findWhere(n => n.prop('data-at') === 'product_carousel');
//             expect(dataAt.length).toEqual(1);
//         });
//     });

//     describe('LegacyCarousel componentDidMount', () => {
//         describe('with carousel set', () => {
//             let component;
//             beforeEach(() => {
//                 props = {
//                     children: [],
//                     isEnableCircle: true,
//                     delay: 100
//                 };
//                 const wrapper = shallow(<LegacyCarousel {...props} />);
//                 component = wrapper.instance();
//                 component.carousel = { getBoundingClientRect: createSpy('getBoundingClientRect').and.returnValue({ width: 100 }) };
//             });

//             it('should call addEventListener if it is on mobile', () => {
//                 const addEventListenerStub = spyOn(window, 'addEventListener');
//                 spyOn(Sephora, 'isMobile').and.returnValue(true);
//                 component.componentDidMount();
//                 expect(addEventListenerStub).toHaveBeenCalled();
//             });

//             it('should call onLastLoadEvent', () => {
//                 const onLastLoadEventStub = spyOn(Events, 'onLastLoadEvent');
//                 component.componentDidMount();
//                 expect(onLastLoadEventStub).toHaveBeenCalled();
//             });

//             it('call play if has isEnableCircle and delay', () => {
//                 const playStub = spyOn(component, 'play');
//                 component.componentDidMount();
//                 expect(playStub).toHaveBeenCalled();
//             });

//             it('should apply Hammer specific logic for iOS', () => {
//                 const isOSSpy = spyOn(UI, 'isIOS');
//                 component.componentDidMount();
//                 expect(isOSSpy).toHaveBeenCalled();
//             });

//             it('should set TouchMouseInput support for Hammer if platform ' + 'has issues with PointerEvents', () => {
//                 spyOn(UI, 'isIOS').and.returnValue(true);
//                 Hammer.defaults = {};
//                 component.componentDidMount();
//                 expect(Hammer.defaults.inputClass).toEqual(Hammer.TouchMouseInput);
//             });
//         });
//     });

//     describe('LegacyCarousel showPause', () => {
//         it('should set state of showPause', () => {
//             props = { children: [] };
//             const wrapper = shallow(<LegacyCarousel {...props} />);
//             const component = wrapper.instance();
//             component.showPause();
//             expect(component.state.showPause).toBeTruthy();
//         });
//     });

//     describe('LegacyCarousel play', () => {
//         let component;
//         let setIntervalStub;
//         beforeEach(() => {
//             props = { children: [] };
//             const wrapper = shallow(<LegacyCarousel {...props} />);
//             component = wrapper.instance();
//             setIntervalStub = spyOn(global, 'setInterval');
//         });

//         it('should call setInterval', () => {
//             component.play();
//             expect(setIntervalStub).toHaveBeenCalled();
//         });

//         it('should set state of the intervalId', () => {
//             setIntervalStub.and.returnValue(17);
//             component.play();
//             expect(component.state.intervalId).toBe(17);
//         });
//     });

//     describe('LegacyCarousel pause', () => {
//         let component;
//         let clearIntervalStub;
//         beforeEach(() => {
//             props = { children: [] };
//             const wrapper = shallow(<LegacyCarousel {...props} />);
//             component = wrapper.instance();
//             clearIntervalStub = spyOn(global, 'clearInterval');
//         });

//         it('should call clearInterval', () => {
//             component.pause();
//             expect(clearIntervalStub).toHaveBeenCalled();
//         });

//         it('should set state of the intervalId', () => {
//             component.pause();
//             expect(component.state.intervalId).toBeFalsy();
//         });
//     });

//     describe('LegacyCarousel playOrPause', () => {
//         let component;
//         beforeEach(() => {
//             props = { children: [] };
//             const wrapper = shallow(<LegacyCarousel {...props} />);
//             component = wrapper.instance();
//         });

//         it('should call pause if has intervalId on state', () => {
//             const pauseStub = spyOn(component, 'pause');
//             component.setState({ intervalId: 10 });
//             component.playOrPause();
//             expect(pauseStub).toHaveBeenCalled();
//         });

//         it('should call play if has no intervalId on state', () => {
//             const playStub = spyOn(component, 'play');
//             component.setState({ intervalId: null });
//             component.playOrPause();
//             expect(playStub).toHaveBeenCalled();
//         });
//     });

//     describe('LegacyCarousel adjust', () => {
//         let component;
//         let requestFrameStub;
//         beforeEach(() => {
//             props = {
//                 children: [{}, {}, {}, {}],
//                 displayCount: 2
//             };
//             const wrapper = shallow(<LegacyCarousel {...props} />);
//             component = wrapper.instance();
//             component.carousel = { getBoundingClientRect: createSpy('getBoundingClientRect').and.returnValue({ width: 150 }) };
//             requestFrameStub = spyOn(UI, 'requestFrame');
//         });

//         it('should call requestFrame', () => {
//             component.adjust();
//             expect(requestFrameStub).toHaveBeenCalled();
//         });

//         it('should set visibleArea state', () => {
//             component.adjust();
//             requestFrameStub.calls.first().args[0]();
//             expect(component.state.visibleArea).toBe(150);
//         });

//         it('should set scrollEnd state', () => {
//             component.adjust();
//             requestFrameStub.calls.first().args[0]();
//             expect(component.state.scrollEnd).toBe(150);
//         });

//         it('should set totalWidth state', () => {
//             component.adjust();
//             requestFrameStub.calls.first().args[0]();
//             expect(component.state.totalWidth).toBe(300);
//         });

//         it('should set posX state', () => {
//             component.setState({ page: 2 });
//             component.adjust();
//             requestFrameStub.calls.first().args[0]();
//             expect(component.state.posX).toBe(-150);
//         });

//         it('should call callback function', () => {
//             const callbackFn = createSpy();
//             component.adjust(callbackFn);
//             requestFrameStub.calls.first().args[0]();
//             expect(callbackFn).toHaveBeenCalled();
//         });
//     });

//     describe('LegacyCarousel handleSwipe', () => {
//         let component;
//         let prevSephoraIsTouch;
//         beforeEach(() => {
//             props = { children: [] };
//             const wrapper = shallow(<LegacyCarousel {...props} />);
//             component = wrapper.instance();
//             prevSephoraIsTouch = Sephora.isTouch;
//             Sephora.isTouch = true;
//         });

//         it('should go to next page if event direction is set as next', () => {
//             const nextPageStub = spyOn(component, 'nextPage');
//             component.handleSwipe({ direction: 2 });
//             expect(nextPageStub).toHaveBeenCalled();
//         });

//         it('should go to previous page if event direction is set as next', () => {
//             const previousPageStub = spyOn(component, 'previousPage');
//             component.handleSwipe({ direction: 4 });
//             expect(previousPageStub).toHaveBeenCalled();
//         });

//         afterEach(() => {
//             Sephora.isTouch = prevSephoraIsTouch;
//         });
//     });

//     describe('LegacyCarousel nextPage', () => {
//         it('should call moveTo', () => {
//             props = { isEnableCircle: false };
//             const wrapper = shallow(<LegacyCarousel {...props} />);
//             const component = wrapper.instance();
//             const moveToStub = spyOn(component, 'moveTo');

//             component.setState({
//                 page: 1,
//                 numberOfPages: 5
//             });
//             component.nextPage();

//             expect(moveToStub).toHaveBeenCalledWith(2);
//         });
//     });

//     describe('LegacyCarousel previousPage', () => {
//         it('should call carouselPlugin.previousPage', () => {
//             props = { isEnableCircle: false };
//             const wrapper = shallow(<LegacyCarousel {...props} />);
//             const component = wrapper.instance();
//             const moveToStub = spyOn(component, 'moveTo');

//             component.setState({
//                 page: 4,
//                 numberOfPages: 5
//             });
//             component.previousPage();

//             expect(moveToStub).toHaveBeenCalledWith(3);
//         });
//     });

//     describe('LegacyCarousel moveTo', () => {
//         it('should call set the new posX', () => {
//             // Arrange
//             const state = {
//                 posX: -1128,
//                 isResize: false,
//                 page: 3
//             };
//             const component = shallow(<LegacyCarousel {...props} />).instance();
//             spyOn(component, 'adjust').and.callFake(func => func());
//             const setState = spyOn(component, 'setState');
//             component.state.visibleArea = 940;
//             component.state.totalWidth = 2068;

//             // Act
//             component.moveTo(3);

//             // Assert
//             expect(setState).toHaveBeenCalledWith(state, any(Function));
//         });
//     });

//     describe('LegacyCarousel isFirstPage', () => {
//         let component;

//         beforeEach(() => {
//             props = { children: [] };
//             const wrapper = shallow(<LegacyCarousel {...props} />);
//             component = wrapper.instance();
//         });

//         it('should return true if carousel is in the first page', () => {
//             component.setState({ page: 1 });
//             const isFirstPage = component.isFirstPage();
//             expect(isFirstPage).toBeTruthy();
//         });

//         it('should return false if carousel is not in the first page', () => {
//             component.setState({ page: 2 });
//             const isFirstPage = component.isFirstPage();
//             expect(isFirstPage).toBeFalsy();
//         });
//     });

//     describe('LegacyCarousel isLastPage', () => {
//         let component;

//         beforeEach(() => {
//             props = {
//                 children: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
//                 totalItems: 10,
//                 displayCount: 4
//             };
//             const wrapper = shallow(<LegacyCarousel {...props} />);
//             component = wrapper.instance();
//         });

//         it('should tell if the last page of the carousel is shown', () => {
//             component.setState({ page: 3 });

//             const isLastPage = component.isLastPage();

//             expect(isLastPage).toBeTruthy();
//         });

//         it('should tell if the last page of the carousel is not shown', () => {
//             component.setState({ page: 2 });

//             const isLastPage = component.isLastPage();

//             expect(isLastPage).toBeFalsy();
//         });
//     });

//     describe('LegacyCarousel getCurrentPage', () => {
//         it('should return the current page visible', () => {
//             props = { children: [] };
//             const wrapper = shallow(<LegacyCarousel {...props} />);
//             const component = wrapper.instance();
//             component.setState({ page: 3 });
//             expect(component.getCurrentPage()).toBe(3);
//         });
//     });

//     describe('LegacyCarousel getCurrentActiveItem', () => {
//         it('should return the current item visible', () => {
//             props = { children: [] };
//             const wrapper = shallow(<LegacyCarousel {...props} />);
//             const component = wrapper.instance();
//             component.setState({ currentActiveItem: 'item_11' });
//             const currentActiveItem = component.getCurrentActiveItem();
//             expect(currentActiveItem).toBe(11);
//         });

//         it('should return the current item visible when there is a panel index', () => {
//             props = { children: [] };
//             const wrapper = shallow(<LegacyCarousel {...props} />);
//             const component = wrapper.instance();
//             component.setState({ currentActiveItem: 'item_11_12' });
//             const currentActiveItem = component.getCurrentActiveItem();
//             expect(currentActiveItem).toBe(42);
//         });
//     });

//     describe('LegacyCarousel getTotalItems', () => {
//         let component;

//         beforeEach(() => {
//             props = {
//                 children: [],
//                 totalItems: 20
//             };
//             const wrapper = shallow(<LegacyCarousel {...props} />);
//             component = wrapper.instance();
//         });

//         it('should return total items', () => {
//             expect(component.getTotalItems()).toBe(20);
//         });
//     });

//     describe('LegacyCarousel getDisplayCount', () => {
//         let component;

//         beforeEach(() => {
//             props = {
//                 children: [],
//                 displayCount: 2
//             };
//             const wrapper = shallow(<LegacyCarousel {...props} />);
//             component = wrapper.instance();
//         });

//         it('should return total items', () => {
//             expect(component.getDisplayCount()).toBe(2);
//         });
//     });

//     describe('LegacyCarousel updateCurrentActiveItem', () => {
//         let component;
//         let dispatchStub;

//         beforeEach(() => {
//             props = {
//                 children: [],
//                 name: 'Component',
//                 analyticsContext: 'add to basket modal'
//             };
//             const wrapper = shallow(<LegacyCarousel {...props} />);
//             component = wrapper.instance();
//             component.uniqueid = '1';
//             dispatchStub = spyOn(store, 'dispatch');
//         });

//         it('should set state for currentActiveItem', () => {
//             component.updateCurrentActiveItem(3, 2, false);
//             expect(component.state.currentActiveItem).toBe('1_2_3');
//         });

//         it('should call dispatch if dispatchAction is true', () => {
//             component.updateCurrentActiveItem(3, 2, true);
//             expect(dispatchStub).toHaveBeenCalled();
//         });

//         it('should call carouselItemClicked if dispatchAction is true', () => {
//             const carouselItemClickedStub = spyOn(CarouselActions, 'carouselItemClicked');
//             component.updateCurrentActiveItem(3, 2, true);
//             expect(carouselItemClickedStub).toHaveBeenCalledWith('Component', 3, 2);
//         });

//         it('should close ATB Modal if the context matches it', () => {
//             const showATBModalStub = spyOn(Actions, 'showAddToBasketModal');
//             component.updateCurrentActiveItem(3, 2, true);
//             expect(showATBModalStub).toHaveBeenCalledWith(Object({ isOpen: false }));
//         });
//     });

//     describe('LegacyCarousel toggleHover', () => {
//         let component;
//         let currentIsTouch;
//         let event;
//         let dispatchStub;

//         beforeEach(() => {
//             props = {
//                 children: [],
//                 name: 'Component'
//             };
//             const wrapper = shallow(<LegacyCarousel {...props} />);
//             component = wrapper.instance();
//             currentIsTouch = Sephora.isTouch;
//             Sephora.isTouch = false;
//             event = {
//                 type: 'mouseenter',
//                 target: {
//                     getBoundingClientRect: createSpy('getBoundingClientRect').and.returnValue({
//                         left: 0,
//                         top: 0
//                     })
//                 },
//                 clientX: 10,
//                 clientY: 20
//             };
//             dispatchStub = spyOn(store, 'dispatch');
//         });

//         it('should set currentHoverItem with -1 if it is not a mouse enter event', () => {
//             event.type = 'customevent';
//             component.toggleHover(event, 1, 2);
//             expect(component.state.currentHoverItem).toBe(-1);
//         });

//         it('should set currentHoverItem with item index if it is a mouse enter event', () => {
//             component.toggleHover(event, 1, 2);
//             expect(component.state.currentHoverItem).toBe(1);
//         });

//         it('should call dispatch if dispatchAction is true', () => {
//             component.toggleHover(event, 1, 2);
//             expect(dispatchStub).toHaveBeenCalled();
//         });

//         it('should call carouselItemClicked if dispatchAction is true', () => {
//             const carouselItemHoveredStub = spyOn(CarouselActions, 'carouselItemHovered');
//             component.toggleHover(event, 1, 2);
//             expect(carouselItemHoveredStub).toHaveBeenCalledWith('Component', 1, 2, true, {
//                 x: 10,
//                 y: 20
//             });
//         });

//         afterEach(() => {
//             Sephora.isTouch = currentIsTouch;
//         });
//     });

//     describe('LegacyCarousel toggleMoveOver', () => {
//         let component;
//         let currentIsTouch;
//         let event;
//         let dispatchStub;

//         beforeEach(() => {
//             props = {
//                 children: [],
//                 name: 'Component'
//             };
//             const wrapper = shallow(<LegacyCarousel {...props} />);
//             component = wrapper.instance();
//             currentIsTouch = Sephora.isTouch;
//             Sephora.isTouch = false;
//             event = {
//                 type: 'mouseenter',
//                 target: {
//                     getBoundingClientRect: createSpy('getBoundingClientRect').and.returnValue({
//                         left: 0,
//                         top: 0
//                     })
//                 },
//                 clientX: 10,
//                 clientY: 20
//             };
//             dispatchStub = spyOn(store, 'dispatch');
//         });

//         it('should call dispatch if dispatchAction is true', () => {
//             component.toggleMoveOver(event, 1, 2);
//             expect(dispatchStub).toHaveBeenCalled();
//         });

//         it('should call carouselItemClicked if dispatchAction is true', () => {
//             const carouselItemMovedOverStub = spyOn(CarouselActions, 'carouselItemMovedOver');
//             component.toggleMoveOver(event, 1, 2);
//             expect(carouselItemMovedOverStub).toHaveBeenCalledWith('Component', 1, 2, {
//                 x: 10,
//                 y: 20
//             });
//         });

//         afterEach(() => {
//             Sephora.isTouch = currentIsTouch;
//         });
//     });

//     describe('LegacyCarousel handleComponentOnKeyDown', () => {
//         let component;

//         beforeEach(() => {
//             const wrapper = shallow(<LegacyCarousel />);
//             component = wrapper.instance();
//         });

//         it('should call handleRightKeyNavigation when user pressed right key', () => {
//             const handleRightKeyNavigationStub = spyOn(component, 'handleRightKeyNavigation');
//             const right = 'ArrowRight';
//             const e = {
//                 key: right,
//                 target: 'arrow'
//             };

//             component.handleComponentOnKeyDown(e);
//             expect(handleRightKeyNavigationStub).toHaveBeenCalledWith(e.target);
//         });

//         it('should call handleLeftKeyNavigation when user presses left key', () => {
//             const handleLeftKeyNavigationStub = spyOn(component, 'handleLeftKeyNavigation');
//             const left = 'ArrowLeft';
//             const e = {
//                 key: left,
//                 target: 'arrow'
//             };

//             component.handleComponentOnKeyDown(e);
//             expect(handleLeftKeyNavigationStub).toHaveBeenCalledWith(e.target);
//         });

//         it('should call handleActionKeyNavigation when user presses Enter key', () => {
//             const handleActionKeyNavigationStub = spyOn(component, 'handleActionKeyNavigation');
//             const enter = 'Enter';
//             const e = {
//                 key: enter,
//                 target: 'enter'
//             };

//             component.handleComponentOnKeyDown(e);
//             expect(handleActionKeyNavigationStub).toHaveBeenCalledWith(e.target);
//         });
//     });

//     describe('LegacyCarousel handleRightKeyNavigation', () => {
//         let component;
//         let target;

//         beforeEach(() => {
//             props = { children: [] };
//             const wrapper = shallow(<LegacyCarousel {...props} />);
//             component = wrapper.instance();
//             target = { id: 'item_11_12_13' };
//         });

//         it('should call nextPage is carrousel has target element ref', () => {
//             component.carouselPanels.hasOwnProperty = createSpy('hasOwnProperty').and.returnValue(true);
//             const nextPageStub = spyOn(component, 'nextPage');
//             component.handleRightKeyNavigation(target);
//             expect(nextPageStub).toHaveBeenCalled();
//         });

//         it('should call next sibling focus if available on carousel items', () => {
//             component.carouselItems.hasOwnProperty = createSpy('hasOwnProperty').and.returnValue(true);
//             const focusStub = createSpy('focusStub');
//             target.nextSibling = { focus: focusStub };
//             component.handleRightKeyNavigation(target);
//             expect(focusStub).toHaveBeenCalled();
//         });

//         it('should call nextPage is page number is lower than total pages number', () => {
//             component.setState({
//                 page: 1,
//                 numberOfPages: 2
//             });
//             component.carouselItems.hasOwnProperty = createSpy('hasOwnProperty').and.returnValue(true);
//             const nextPageStub = spyOn(component, 'nextPage');
//             component.handleRightKeyNavigation(target);
//             expect(nextPageStub).toHaveBeenCalled();
//         });

//         it('should call nextPage is page number is lower than total pages number2', () => {
//             component.setState({
//                 page: 1,
//                 numberOfPages: 2
//             });
//             component.carouselItems.hasOwnProperty = createSpy('hasOwnProperty').and.returnValue(true);
//             const setTimeoutStub = spyOn(global, 'setTimeout');
//             component.handleRightKeyNavigation(target);
//             expect(setTimeoutStub).toHaveBeenCalledWith(any(Function), 100);
//         });

//         it('should call next sibling focus if available on toutItems', () => {
//             component.toutItems.hasOwnProperty = createSpy('hasOwnProperty').and.returnValue(true);
//             const focusStub = createSpy('focusStub');
//             target.nextSibling = { focus: focusStub };
//             component.handleRightKeyNavigation(target);
//             expect(focusStub).toHaveBeenCalled();
//         });
//     });

//     describe('LegacyCarousel handleLeftKeyNavigation', () => {
//         let component;
//         let target;

//         beforeEach(() => {
//             props = { children: [] };
//             const wrapper = shallow(<LegacyCarousel {...props} />);
//             component = wrapper.instance();
//             target = { id: 'item_11_12_13' };
//         });

//         it('should call nextPage is carrousel has target element ref', () => {
//             component.carouselPanels.hasOwnProperty = createSpy('hasOwnProperty').and.returnValue(true);
//             const previousPageStub = spyOn(component, 'previousPage');
//             component.handleLeftKeyNavigation(target);
//             expect(previousPageStub).toHaveBeenCalled();
//         });

//         it('should call next sibling focus if available on carousel items', () => {
//             component.carouselItems.hasOwnProperty = createSpy('hasOwnProperty').and.returnValue(true);
//             const focusStub = createSpy('focusStub');
//             target.previousSibling = { focus: focusStub };
//             component.handleLeftKeyNavigation(target);
//             expect(focusStub).toHaveBeenCalled();
//         });

//         it('should call nextPage is page number is lower than total pages number', () => {
//             component.setState({
//                 page: 1,
//                 numberOfPages: 2
//             });
//             component.carouselItems.hasOwnProperty = createSpy('hasOwnProperty').and.returnValue(true);
//             const previousPageStub = spyOn(component, 'previousPage');
//             component.handleLeftKeyNavigation(target);
//             expect(previousPageStub).toHaveBeenCalled();
//         });

//         it('should call nextPage is page number is lower than total pages number', () => {
//             component.setState({
//                 page: 1,
//                 numberOfPages: 2
//             });
//             component.carouselItems.hasOwnProperty = createSpy('hasOwnProperty').and.returnValue(true);
//             const setTimeoutStub = spyOn(global, 'setTimeout');
//             component.handleLeftKeyNavigation(target);
//             expect(setTimeoutStub).toHaveBeenCalledWith(any(Function), 100);
//         });

//         it('should call next sibling focus if available on toutItems', () => {
//             component.toutItems.hasOwnProperty = createSpy('hasOwnProperty').and.returnValue(true);
//             const focusStub = createSpy('focusStub');
//             target.previousSibling = { focus: focusStub };
//             component.handleLeftKeyNavigation(target);
//             expect(focusStub).toHaveBeenCalled();
//         });
//     });

//     describe('LegacyCarousel handleActionKeyNavigation', () => {
//         let component;

//         beforeEach(() => {
//             const wrapper = shallow(<LegacyCarousel />);
//             component = wrapper.instance();
//         });

//         it('should update the current active item if user hits Enter on a navigation item', () => {
//             const target = { id: 'tabItem_shx_2_4' };
//             const childIndex = '4';
//             const panelIndex = '2';
//             const updateCurrentActiveItemStub = spyOn(component, 'updateCurrentActiveItem');

//             component.handleActionKeyNavigation(target);
//             expect(updateCurrentActiveItemStub).toHaveBeenCalledWith(childIndex, panelIndex);
//         });

//         it('should return true if carousel is in the first page', () => {
//             // Arrange
//             const target = { onClick: createSpy('onClick') };

//             // Act
//             component.handleActionKeyNavigation(target);

//             // Assert
//             expect(target.onClick).toHaveBeenCalled();
//         });
//     });
// });
