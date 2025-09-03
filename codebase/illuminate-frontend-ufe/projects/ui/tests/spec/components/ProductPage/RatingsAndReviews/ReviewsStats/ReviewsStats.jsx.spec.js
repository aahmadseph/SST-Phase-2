const React = require('react');
const { shallow } = require('enzyme');
const ReviewsStats = require('components/ProductPage/RatingsAndReviews/ReviewsStats/ReviewsStats').default;

describe('<ReviewsStats />', () => {
    it('should display the percentage of product recommendations when percentage > 80', () => {
        // Arrange
        const props = {
            productId: 123456,
            reviewStatistics: {
                recommendedCount: 65
            },
            redirectToAddReview: false,
            totalReviewCount: 70,
            sentiments: []
        };
        const component = shallow(<ReviewsStats {...props} />);

        const percentageText = component.findWhere(n => n.name() === 'Text' && n.text() === '93%');

        // Assert
        expect(percentageText.length).toEqual(1);
    });

    it('should not display the percentage of product recommendations when percentage < 80', () => {
        // Arrange
        const props = {
            reviewStatistics: {
                recommendedCount: 50
            },
            totalReviewCount: 70,
            sentiments: []
        };
        const component = shallow(<ReviewsStats {...props} />);

        // Act
        const percentageText = component.findWhere(n => n.name() === 'Text' && n.text() === '71%');

        // Assert
        expect(percentageText.length).toEqual(0);
    });

    it('should render the average review number', () => {
        // Arrange
        const props = {
            reviewStatistics: {
                averageOverallRating: 4.7037
            },
            totalReviewCount: 12600,
            sentiments: []
        };
        const component = shallow(<ReviewsStats {...props} />);

        // Act
        const element = component.findWhere(n => n.name() === 'Text' && n.text() === '4.7');

        // Assert
        expect(element.length).toEqual(1);
    });

    it('should render the review count with correct format', () => {
        // Arrange
        const props = {
            reviewStatistics: {
                totalReviewCount: 12600
            },
            totalReviewCount: 12600,
            sentiments: []
        };

        const component = shallow(<ReviewsStats {...props} />);

        // Act
        const element = component.findWhere(n => n.name() === 'Text' && n.text() === '12,600 Reviews');

        // Assert
        expect(element.length).toEqual(1);
    });

    it('should render ReviewLegalText component', () => {
        const props = {
            reviewStatistics: {
                recommendedCount: 50
            },
            totalReviewCount: 70,
            sentiments: []
        };

        const component = shallow(<ReviewsStats {...props} />);

        expect(component.findWhere(n => n.name() === 'ReviewLegalText').length).toBe(1);
    });
});
