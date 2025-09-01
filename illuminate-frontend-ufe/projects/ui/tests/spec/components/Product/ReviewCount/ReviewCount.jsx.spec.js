const React = require('react');
const { shallow } = require('enzyme');

describe('<ReviewCount /> component', () => {
    const validReviewCount = 92;
    let ReviewCount;
    let wrapper;

    beforeEach(() => {
        ReviewCount = require('components/Product/ReviewCount/ReviewCount').default;
    });

    it('should not render if it has no reviews', () => {
        wrapper = shallow(<ReviewCount productReviewCount={0} />);
        expect(wrapper.find('span').length).toBe(0);
    });

    it('should render if it has reviews', () => {
        wrapper = shallow(<ReviewCount productReviewCount={validReviewCount} />);
        expect(wrapper.find('span').length).toBe(1);
    });

    it('should display the review count data', () => {
        wrapper = shallow(<ReviewCount productReviewCount={validReviewCount} />);
        expect(wrapper.find('span').prop('children')).toBe(`${validReviewCount}`);
    });

    it('should render data-at attribute set to "review_count"', () => {
        wrapper = shallow(<ReviewCount productReviewCount={validReviewCount} />);
        expect(wrapper.find('[data-at="review_count"]').length).toBe(1);
    });
});
