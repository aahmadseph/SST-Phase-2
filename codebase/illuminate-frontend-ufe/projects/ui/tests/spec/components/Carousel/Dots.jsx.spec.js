// const React = require('react');
// const { shallow } = require('enzyme');
// const Dots = require('components/Carousel/Dots').default;

// describe('<Dots />', () => {
//     it('should render as many dots as mentioned in qty prop', () => {
//         // Arrange
//         const component = shallow(
//             <Dots
//                 qty={3}
//                 dotsShown={5}
//             />
//         );

//         // Act
//         const dots = component.find('button');

//         // Assert
//         expect(dots.length).toEqual(3);
//     });

//     describe('scrollToRight', () => {
//         it('should make last dot scrollable if there\'re more dots provided', () => {
//             // Arrance
//             const component = shallow(
//                 <Dots
//                     qty={6}
//                     dotsShown={5}
//                 />
//             );
//             const instance = component.instance();

//             // Act
//             const shouldScrollRight = instance.shouldScrollRight(4);

//             // Assert
//             expect(shouldScrollRight).toBeTruthy();
//         });

//         it('should not make last dot scrollable if there\'s no more dots to show', () => {
//             // Arrance
//             const component = shallow(
//                 <Dots
//                     qty={6}
//                     dotsShown={5}
//                 />
//             );
//             const instance = component.instance();

//             // Act
//             const shouldScrollRight = instance.shouldScrollRight(5);

//             // Assert
//             expect(shouldScrollRight).toBeFalsy();
//         });
//     });

//     describe('scrollToLeft', () => {
//         it('should not make first dot scrollable if component is not scrolled yet', () => {
//             // Arrance
//             const component = shallow(
//                 <Dots
//                     qty={6}
//                     dotsShown={5}
//                 />
//             );
//             const instance = component.instance();

//             // Act
//             const shouldScrollLeft = instance.shouldScrollLeft(0);

//             // Assert
//             expect(shouldScrollLeft).toBeFalsy();
//         });

//         it('should render the very left dot as scrollable if component scrolled already', () => {
//             // Arrance
//             const component = shallow(
//                 <Dots
//                     qty={6}
//                     dotsShown={5}
//                 />
//             );
//             component.setState({ scrolledIndex: 1 });
//             const instance = component.instance();

//             // Act
//             const shouldScrollLeft = instance.shouldScrollLeft(1);

//             // Assert
//             expect(shouldScrollLeft).toBeTruthy();
//         });
//     });

//     describe('handleClick', () => {
//         it('should listen for click event on dots', () => {
//             // Arrance
//             const component = shallow(
//                 <Dots
//                     qty={6}
//                     dotsShown={5}
//                 />
//             );
//             const instance = component.instance();
//             const clickSpy = spyOn(instance, 'handleClick');
//             const dots = component.find('button');

//             // Act
//             dots.at(0).simulate('click');

//             // Assert
//             expect(clickSpy).toHaveBeenCalled();
//         });

//         it('should select the clicked dot', () => {
//             // Arrance
//             const component = shallow(
//                 <Dots
//                     qty={6}
//                     dotsShown={5}
//                 />
//             );
//             const instance = component.instance();
//             const setStateSpy = spyOn(instance, 'setState');
//             instance.rootRef = { current: { scrollTo: jasmine.createSpy() } };
//             const dots = component.find('button');

//             // Act
//             dots.at(2).simulate('click');

//             // Assert
//             expect(setStateSpy).toHaveBeenCalledWith(
//                 {
//                     selectedIndex: 2,
//                     scrolledIndex: 0
//                 },
//                 jasmine.any(Function)
//             );
//         });

//         it('should scroll the dot component if clicked', () => {
//             // Arrance
//             const component = shallow(
//                 <Dots
//                     qty={6}
//                     dotsShown={5}
//                 />
//             );
//             const instance = component.instance();
//             const scrollToSpy = jasmine.createSpy();
//             instance.rootRef = { current: { scrollTo: scrollToSpy } };
//             const dots = component.find('button');

//             // Act
//             dots.at(2).simulate('click');

//             // Assert
//             expect(scrollToSpy).toHaveBeenCalled();
//         });
//     });
// });
