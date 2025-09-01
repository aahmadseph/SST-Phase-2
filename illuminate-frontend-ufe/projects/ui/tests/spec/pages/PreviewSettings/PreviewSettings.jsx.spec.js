const React = require('react');
const { shallow } = require('enzyme');

describe('Preview Settings page', () => {
    let PreviewSettings;
    let shallowComponent;

    beforeEach(() => {
        PreviewSettings = require('pages/PreviewSettings/PreviewSettings').default;
    });

    describe('PreviewSettings component', () => {
        beforeEach(() => {
            shallowComponent = shallow(<PreviewSettings />);
        });

        it('should render the PreviewSettings component', () => {
            expect(shallowComponent.find('PreviewSettings').length).toEqual(1);
        });
    });
});
