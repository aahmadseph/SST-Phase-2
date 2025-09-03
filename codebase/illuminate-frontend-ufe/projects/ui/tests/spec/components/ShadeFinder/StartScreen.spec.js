const React = require('react');
// eslint-disable-next-line no-undef
const shallow = enzyme.shallow;

describe('StartScreen component', () => {
    let StartScreen;
    let component;
    let wizardActions;

    beforeEach(() => {
        StartScreen = require('components/ShadeFinder/StartScreen/StartScreen').default;
        wizardActions = require('actions/WizardActions').default;
    });

    describe('#nextPage method', () => {
        let goToNextPageSpy;

        beforeEach(() => {
            const wrapper = shallow(<StartScreen />);
            component = wrapper.instance();
            goToNextPageSpy = spyOn(wizardActions, 'goToNextPage').and.returnValue({ type: 'type' });
        });

        it('should dispatch goToNextPage wizard action', () => {
            component.nextPage();
            expect(goToNextPageSpy).toHaveBeenCalledTimes(1);
        });
    });
});
