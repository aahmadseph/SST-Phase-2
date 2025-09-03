xdescribe('Start Screen', () => {
    let React;
    let StartScreen;
    let shallowComponent;

    beforeEach(() => {
        React = require('react');
        StartScreen = require('components/ShadeFinder/StartScreen/StartScreen').default;

        shallowComponent = enzyme.shallow(<StartScreen />);
    });

    describe('total elements', () => {
        it('Should have 3 children', () => {
            expect(shallowComponent.children().length).toBe(3);
        });
    });

    describe('Title element', () => {
        let titleContainer;
        beforeEach(() => {
            titleContainer = shallowComponent.findWhere(n => n.name() === 'Text').at(0);
        });
        it('Should render a h1 element', () => {
            expect(titleContainer.props().is).toEqual('h1');
        });
        it('Should have the correct text', () => {
            expect(titleContainer.childAt(0).text()).toEqual('You’ve got options!');
        });
    });

    describe('Middle text element', () => {
        let pText;
        beforeEach(() => {
            pText = shallowComponent.findWhere(n => n.name() === 'Text').at(1);
        });
        it('should render a p element', () => {
            expect(pText.props().is).toBe('p');
        });
        it('should have the correct text', () => {
            expect(pText.childAt(0).text())
                /* eslint-disable max-len */
                .toBe('Start with the foundation you currently use to find a matching shade from this brand.');
        });
    });

    describe('Button element', () => {
        let btn;
        it('Should have a btn element', () => {
            btn = shallowComponent.findWhere(n => n.name() === 'Button');
            expect(btn.props().children === 'Let’s get started');
        });
    });
});
