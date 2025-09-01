const React = require('react');
const { shallow } = require('enzyme');

describe('<JoinCommunity /> block component', () => {
    let JoinCommunity;

    beforeEach(() => {
        JoinCommunity = require('components/RichProfile/UserProfile/common/JoinCommunity/JoinCommunity').default;
    });

    it('should feature a data-at attribute', () => {
        const wrapper = shallow(<JoinCommunity />);
        const component = wrapper.findWhere(n => n.prop('data-at') === 'beauty_insider_community_block');

        expect(component.exists()).toBe(true);
    });
});
