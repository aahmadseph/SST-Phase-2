const React = require('react');
const { shallow } = require('enzyme');
const Skin = require('components/RichProfile/EditMyProfile/Content/Skin/Skin.ctrlr').default;

describe('Skin', () => {
    it('renders without crashing', () => {
        const biAccountMock = {
            personalizedInformation: {
                skinTone: [],
                skinType: [],
                skinConcerns: []
            }
        };
        const wrapper = shallow(<Skin biAccount={biAccountMock} />);
        expect(wrapper.exists()).toBe(true);
    });
});
