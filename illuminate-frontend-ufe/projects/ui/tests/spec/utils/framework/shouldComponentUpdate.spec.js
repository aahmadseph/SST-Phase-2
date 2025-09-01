/* eslint-disable class-methods-use-this */

describe('shouldComponentUpdate', () => {
    let React, ComponentClass, renderStub;

    beforeEach(() => {
        React = require('react');
        const { wrapComponent } = require('utils/framework').default;
        const BaseClass = require('components/BaseClass').default;

        class ClassDefinition extends BaseClass {
            state = { stateCount: 0 };

            constructor(props) {
                super(props);
            }

            render() {
                return React.createElement('div', null, 'Hello world');
            }
        }

        ComponentClass = wrapComponent(ClassDefinition, 'ClassDefinition', true);

        renderStub = spyOn(ComponentClass.prototype, 'render');
    });

    it('Test that component re-renders occur as expected when state and props change or dont change', () => {
        const instance = enzyme.shallow(<ComponentClass propCount={0} />);
        expect(renderStub.calls.count()).toEqual(1);
        instance.setProps({ propCount: 0 });
        expect(renderStub.calls.count()).toEqual(1);
        instance.setProps({ propCount: 1 });
        expect(renderStub.calls.count()).toEqual(2);
        instance.setState({ stateCount: 1 });
        expect(renderStub.calls.count()).toEqual(3);
        instance.setState({ stateCount: 1 });
        expect(renderStub.calls.count()).toEqual(3);
    });
});
