// /* eslint-disable no-unused-vars */
// const React = require('react');
// const { shallow } = require('enzyme');
// const { any } = jasmine;
// const ThumbnailCarousel = require('components/ProductPage/ProductMediaCarousel/ThumbnailCarousel/ThumbnailCarousel').default;
// let items;
// let props;

// describe('<ThumbnailCarousel />', () => {
//     beforeEach(() => {
//         items = [];
//         props = {
//             seeAllClick: () => {}
//         };
//     });

//     describe('Thumbnail Carousel', () => {
//         it('should render thumbnails for all the items passed', () => {
//             // Arrange
//             const component = shallow(<ThumbnailCarousel items={[{}, {}, {}, {}, {}]} />);

//             // Act
//             const pages = component.find('ThumbnailMediaItem');

//             // Assert
//             expect(pages.length).toEqual(5);
//         });

//         it('should render single page of thumbnails if 8 elements passed or less', () => {
//             // Arrange
//             const component = shallow(
//                 <ThumbnailCarousel
//                     items={[{}, {}, {}, {}, {}, {}, {}, {}]}
//                     {...props}
//                 />
//             );

//             // Act
//             const pages = component.find('li');

//             // Assert
//             expect(pages.length).toEqual(1);
//         });

//         it('should render 2 pages if passed more then 8 elements', () => {
//             // Arrange
//             const component = shallow(
//                 <ThumbnailCarousel
//                     items={[{}, {}, {}, {}, {}, {}, {}, {}, {}]}
//                     {...props}
//                 />
//             );

//             // Act
//             const pages = component.find('li');

//             // Assert
//             expect(pages.length).toEqual(2);
//         });

//         it('should not render See All link if we got 8 items or less', () => {
//             // Arrange
//             const component = shallow(
//                 <ThumbnailCarousel
//                     items={[{}, {}, {}, {}, {}, {}, {}, {}]}
//                     {...props}
//                 />
//             );

//             // Act
//             const pages = component.find('Link');

//             // Assert
//             expect(pages.length).toEqual(0);
//         });

//         it('should render See All link if there\'re more than 8 items', () => {
//             // Arrange
//             const component = shallow(
//                 <ThumbnailCarousel
//                     items={[{}, {}, {}, {}, {}, {}, {}, {}, {}]}
//                     {...props}
//                 />
//             );

//             // Act
//             const pages = component.find('Link');

//             // Assert
//             expect(pages.length).toEqual(1);
//         });

//         it('should attach the click handler to see All link', () => {
//             // Arrange
//             const seeAllSpy = jasmine.createSpy();
//             const component = shallow(
//                 <ThumbnailCarousel
//                     seeAllClick={seeAllSpy}
//                     items={[{}, {}, {}, {}, {}, {}, {}, {}, {}]}
//                 />
//             );
//             const seeAllLink = component.find('Link');

//             // Act
//             seeAllLink.simulate('click');

//             // Assert
//             expect(seeAllSpy).toHaveBeenCalled();
//         });

//         describe('scrollTo', () => {
//             it('should set state.selectedIndex from a given index', () => {
//                 // Arrange
//                 const component = shallow(<ThumbnailCarousel items={[{}, {}, {}, {}, {}]} />);
//                 const instance = component.instance();
//                 const index = 0;
//                 const setStateSpy = spyOn(instance, 'setState');

//                 // Act
//                 instance.scrollTo(index);

//                 // Assert
//                 expect(setStateSpy).toHaveBeenCalledWith({ selectedIndex: index }, any(Function));
//             });
//         });
//     });
// });
