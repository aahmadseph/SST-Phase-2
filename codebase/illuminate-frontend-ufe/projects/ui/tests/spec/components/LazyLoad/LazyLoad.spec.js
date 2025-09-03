const { any } = jasmine;
const { shallow } = require('enzyme');
const LazyLoad = require('components/LazyLoad/LazyLoad').default;
const LazyLoadService = require('utils/framework/LazyLoad').default.LazyLoaderInstance;
const React = require('react');

describe('LazyLoad component', () => {
    it('ctrlr method should call addLazyComponent method to register component', () => {
        // Arrange
        Sephora.isLazyLoadEnabled = true;
        const addLazyComponent = spyOn(LazyLoadService, 'addLazyComponent');

        // Act
        shallow(<LazyLoad componentClass='Test' />);

        // Assert
        expect(addLazyComponent).toHaveBeenCalled();
    });

    // it('load method should setState to component class', () => {
    //     // Arrange
    //     const TestComponent = () => <></>;
    //     TestComponent.name = 'TestComponent';

    //     const wrapper = shallow(<LazyLoad component={TestComponent} />, { disableLifecycleMethods: true });
    //     const component = wrapper.instance();
    //     const setStateStub = spyOn(component, 'setState');

    //     // Act
    //     component.load();

    //     // Assert
    //     const reactComponent = component.props.component;
    //     expect(setStateStub).toHaveBeenCalledWith({ component: reactComponent });
    //     expect(reactComponent.name).toBe('TestComponent');
    // });

    it('should register component in LazyLoadService on creation', () => {
        // Arrange
        Sephora.isLazyLoadEnabled = true;
        spyOn(LazyLoadService, 'addLazyComponent');
        const registerComponent = spyOn(LazyLoadService, 'registerComponent');

        // Act
        shallow(<LazyLoad />);

        // assert
        expect(registerComponent).toHaveBeenCalledTimes(1);
    });

    it('should unregister component in LazyLoadService before deletion', () => {
        // Arrange
        const unregisterComponent = spyOn(LazyLoadService, 'unregisterComponent');

        // Act
        shallow(<LazyLoad />, { disableLifecycleMethods: true })
            .instance()
            .componentWillUnmount();

        // assert
        expect(unregisterComponent).toHaveBeenCalledTimes(1);
    });

    it('should set instance field resetMode to true when beginReset invoked', () => {
        // Arrange
        const component = shallow(<LazyLoad />, { disableLifecycleMethods: true }).instance();

        // Act
        component.beginReset();

        // Assert
        expect(component.resetMode).toBeTruthy();
    });

    it('should set instance field resetMode to false when endReset invoked', () => {
        // Arrange
        const component = shallow(<LazyLoad />, { disableLifecycleMethods: true }).instance();
        spyOn(component, 'setState');
        component.resetMode = true;

        // Act
        component.endReset();

        // Assert
        expect(component.resetMode).toBeFalsy();
    });

    it('should set this.state.component field to null when endReset invoked', () => {
        // Arrange
        const component = shallow(<LazyLoad />, { disableLifecycleMethods: true }).instance();
        const setState = spyOn(component, 'setState');
        const newState = { component: null };

        // Act
        component.endReset();

        // Assert
        expect(setState).toHaveBeenCalledWith(newState, any(Function));
    });

    it('should call addLazyComponent when endReset invoked', () => {
        // Arrange
        const addLazyComponent = spyOn(LazyLoadService, 'addLazyComponent');
        const component = shallow(<LazyLoad />, { disableLifecycleMethods: true }).instance();
        const setState = spyOn(component, 'setState');

        // Act
        component.endReset();
        setState.calls.argsFor(0)[1]();

        // Assert
        expect(addLazyComponent).toHaveBeenCalledTimes(1);
    });
});
