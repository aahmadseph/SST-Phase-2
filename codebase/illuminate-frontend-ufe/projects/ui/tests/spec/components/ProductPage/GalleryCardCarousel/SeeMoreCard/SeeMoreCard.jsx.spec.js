// const React = require('react');
// const { shallow } = require('enzyme');

// describe('SeeMoreCard component', () => {
//     let SeeMoreCard;

//     beforeEach(() => {
//         SeeMoreCard = require('components/ProductPage/GalleryCardCarousel/SeeMoreCard/SeeMoreCard').default;
//     });

//     it('should redirect to a proper gallery link using productId for filtering', () => {
//         // Arrange
//         const Location = require('utils/Location').default;
//         const navigateToStub = spyOn(Location, 'navigateTo');

//         // Act
//         const component = shallow(<SeeMoreCard productId={123456} />);
//         const link = component.find('button');
//         link.simulate('click');

//         // Assert
//         expect(navigateToStub).toHaveBeenCalledWith(undefined, '/community/gallery');
//     });

//     it('should render button data-at', () => {
//         const component = shallow(<SeeMoreCard productId={123456} />);

//         const elementName = component.findWhere(n => n.prop('data-at') === `${Sephora.debug.dataAt('see_more_in_the_gallery_btn')}`).name();
//         expect(elementName).toEqual('button');
//     });

//     it('should render see more in the gallery message', () => {
//         // Arrange
//         const localeUtils = require('utils/LanguageLocale').default;
//         const component = shallow(<SeeMoreCard productId={123456} />);
//         const getText = text =>
//             localeUtils.getLocaleResourceFile('components/ProductPage/GalleryCardCarousel/SeeMoreCard/locales', 'SeeMoreCard')(text);

//         // Act
//         const message = component.findWhere(x => x.name() === 'span').text();

//         // Assert
//         expect(message.includes(getText('seeMore')) && message.includes(getText('inTheGallery'))).toBeTruthy();
//     });
// });
