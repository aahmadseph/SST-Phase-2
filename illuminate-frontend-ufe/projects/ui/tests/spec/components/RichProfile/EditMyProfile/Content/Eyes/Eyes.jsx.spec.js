describe('Eyes', () => {
    const React = require('react');
    const Eyes = require('components/RichProfile/EditMyProfile/Content/Eyes/Eyes').default;
    let shallowComponent;
    let eyeColorsContainer;
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
    beforeEach(() => {
        shallowComponent = enzyme.shallow(<Eyes biAccount={biAccount} />);
        eyeColorsContainer = shallowComponent.children();
    });

    it('should render colors options', () => {
        const colors = eyeColorsContainer.find('LegacyGrid').children();
        expect(colors.length).toBe(biAccount.personalizedInformation.eyeColor.length);
    });
});
