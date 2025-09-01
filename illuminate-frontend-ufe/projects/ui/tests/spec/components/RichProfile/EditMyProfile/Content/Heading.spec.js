const React = require('react');
const { shallow } = require('enzyme');
const ContentHeading = require('components/RichProfile/EditMyProfile/Content/ContentHeading.ctrlr').default;

describe('ContentHeading', () => {
    it('renders without crashing', () => {
        const wrapper = shallow(<ContentHeading />);
        expect(wrapper.exists()).toBe(true);
    });
});
