const React = require('react');
const { shallow } = require('enzyme');
const ReviewAuthor = require('components/ProductPage/RatingsAndReviews/Review/ReviewAuthor').default;

xdescribe('<ReviewAuthor />', () => {
    describe('Render', () => {
        it('should display the user avatar', () => {
            // Arrange
            const imageUrl = 'imageUrl';
            const props = { additionalFields: { socialLockUp: { value: `avatar=${imageUrl}` } } };
            const component = shallow(<ReviewAuthor {...props} />);

            // Act
            const avatar = component.find('Image[data-at="avatar"]');

            // Assert
            expect(avatar.prop('src')).toEqual(imageUrl);
        });

        it('should display a default avatar if user does not have an image', () => {
            // Arrange
            const { AVATAR_PHOTO_DEFAULT } = require('services/api/thirdparty/Lithium').default;
            const component = shallow(<ReviewAuthor />);

            // Act
            const avatar = component.find('Image[data-at="avatar"]');

            // Assert
            expect(avatar.prop('src')).toEqual(AVATAR_PHOTO_DEFAULT);
        });
    });
});
