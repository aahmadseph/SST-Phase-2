const React = require('react');
// eslint-disable-next-line no-undef
const shallow = enzyme.shallow;

describe('Eyes component', () => {
    const Eyes = require('components/RichProfile/EditMyProfile/Content/Eyes/Eyes').default;
    let component;

    const biAccount = {
        personalizedInformation: {
            eyeColor: [
                {
                    displayName: 'Blue',
                    value: 'blue'
                },
                {
                    displayName: 'Brown',
                    value: 'brown'
                },
                {
                    displayName: 'Green',
                    value: 'green'
                },
                {
                    displayName: 'Grey',
                    value: 'grey'
                },
                {
                    displayName: 'Hazel',
                    value: 'hazel'
                }
            ]
        }
    };
    const componentProps = { biAccount: biAccount };
    beforeEach(() => {
        const wrapper = shallow(<Eyes {...componentProps} />);
        component = wrapper.instance();
        component.state.eyeColor = 'blue';
    });
    it('getData should return selected eye color', () => {
        expect(component.getData().biAccount.personalizedInformation.eyeColor).toBe('blue');
    });
});
