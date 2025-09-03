/* eslint-disable no-unused-vars */
const React = require('react');
const { createSpy } = jasmine;
const { shallow } = require('enzyme');
const cmsApi = require('services/api/cms').default;
const UI = require('utils/UI').default;
const store = require('Store').default;
const Actions = require('Actions').default;
const MediaPopup = require('components/GlobalModals/MediaPopup/MediaPopup').default;

describe('MediaPopup component', () => {
    let component;
    let getMediaContentCompStub;
    let getMediaContentAPIStub;
    let setStateStub;
    let dispatchStub;
    let showMediaModalStub;
    const props = { mediaId: 'someMediaId' };

    describe('componentDidMount method', () => {
        beforeEach(() => {
            const wrapper = shallow(<MediaPopup {...props} />);
            component = wrapper.instance();
            getMediaContentCompStub = spyOn(component, 'getMediaContent');
            component.state = { regions: null };
            component.componentDidMount();
        });

        it('should call getMediaContent of component', () => {
            expect(getMediaContentCompStub).toHaveBeenCalledTimes(1);
        });

        it('should call getMediaContent of component with params', () => {
            expect(getMediaContentCompStub).toHaveBeenCalledWith('someMediaId');
        });
    });

    describe('getMediaContent method', () => {
        let fakePromise;
        beforeEach(() => {
            fakePromise = {
                then: resolve => {
                    resolve({});

                    return fakePromise;
                },
                catch: () => {
                    return fakePromise;
                }
            };
            getMediaContentAPIStub = spyOn(cmsApi, 'getMediaContent').and.returnValue(fakePromise);
            const wrapper = shallow(<MediaPopup {...props} />);
            component = wrapper.instance();
            setStateStub = spyOn(component, 'setState');
            component.getMediaContent('MediaId');
        });

        it('should call getMediaContent of cmsApi', () => {
            expect(getMediaContentAPIStub).toHaveBeenCalled();
        });

        it('should call setState method', () => {
            expect(setStateStub).toHaveBeenCalled();
        });
    });

    describe('requestClose method', () => {
        beforeEach(() => {
            showMediaModalStub = spyOn(Actions, 'showMediaModal');
            dispatchStub = spyOn(store, 'dispatch');
        });

        it('should call onDismiss callback', () => {
            props.onDismiss = createSpy('onDismiss');
            const wrapper = shallow(<MediaPopup {...props} />);
            component = wrapper.instance();
            component.requestClose();
            expect(props.onDismiss).toHaveBeenCalledTimes(1);
        });

        it('should call dispatch method', () => {
            delete props.onDismiss;
            const wrapper = shallow(<MediaPopup {...props} />);
            component = wrapper.instance();
            component.requestClose();
            expect(dispatchStub).toHaveBeenCalledTimes(1);
        });

        it('should call dispatch method with values', () => {
            delete props.onDismiss;
            const wrapper = shallow(<MediaPopup {...props} />);
            component = wrapper.instance();
            component.requestClose();
            expect(dispatchStub).toHaveBeenCalledWith(showMediaModalStub());
        });

        it('should call showMediaModal method', () => {
            delete props.onDismiss;
            const wrapper = shallow(<MediaPopup {...props} />);
            component = wrapper.instance();
            component.requestClose();
            expect(showMediaModalStub).toHaveBeenCalledTimes(1);
        });

        it('should call showMediaModal method with values', () => {
            delete props.onDismiss;
            const wrapper = shallow(<MediaPopup {...props} />);
            component = wrapper.instance();
            component.requestClose();
            expect(showMediaModalStub).toHaveBeenCalledWith({ isOpen: false });
        });
    });

    describe('componentWillReceiveProps method', () => {
        const updatedProps = { mediaId: 'NewMediaId' };

        beforeEach(() => {
            dispatchStub = spyOn(store, 'dispatch');
            const wrapper = shallow(<MediaPopup {...props} />);
            component = wrapper.instance();
            setStateStub = spyOn(component, 'setState');
            getMediaContentCompStub = spyOn(component, 'getMediaContent');
        });

        it('should call setState method', () => {
            component.componentWillReceiveProps(updatedProps);
            expect(setStateStub).toHaveBeenCalledTimes(1);
        });

        it('should call setState method with isOpen false', () => {
            updatedProps.isOpen = false;
            component.componentWillReceiveProps(updatedProps);
            expect(setStateStub).toHaveBeenCalledWith({ isOpen: false });
        });

        it('should call setState method with isOpen true', () => {
            updatedProps.isOpen = true;
            component.componentWillReceiveProps(updatedProps);
            expect(setStateStub).toHaveBeenCalledWith({ isOpen: true });
        });

        it('should call getMediaContent method of component', () => {
            component.componentWillReceiveProps(updatedProps);
            expect(getMediaContentCompStub).toHaveBeenCalledTimes(1);
        });

        it('should call getMediaContent method of component with values', () => {
            component.componentWillReceiveProps(updatedProps);
            expect(getMediaContentCompStub).toHaveBeenCalledWith('NewMediaId');
        });
    });
});
