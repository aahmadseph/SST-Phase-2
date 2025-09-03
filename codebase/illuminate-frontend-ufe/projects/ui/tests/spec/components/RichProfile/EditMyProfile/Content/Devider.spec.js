const React = require('react');
const { shallow } = require('enzyme');
const ContentDivider = require('components/RichProfile/EditMyProfile/Content/ContentDivider.ctrlr').default;

describe('ContentDivider', () => {
    it('renders without crashing', () => {
        const wrapper = shallow(<ContentDivider />);
        expect(wrapper.exists()).toBe(true);
    });
});
