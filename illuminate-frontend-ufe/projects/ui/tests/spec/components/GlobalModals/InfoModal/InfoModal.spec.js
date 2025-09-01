const React = require('react');
const { createSpy } = jasmine;
const { shallow } = require('enzyme');
const store = require('Store').default;
const Actions = require('Actions').default;
const InfoModal = require('components/GlobalModals/InfoModal/InfoModal').default;

describe('InfoModal component', () => {
    let component;
    let dispatchStub;
    let showInfoModalStub;
    const props = {};

    beforeEach(() => {
        dispatchStub = spyOn(store, 'dispatch');
        showInfoModalStub = spyOn(Actions, 'showInfoModal');
    });

    describe('requestClose method', () => {
        beforeEach(() => {
            props.cancelCallback = createSpy('cancelCallback');
            shallow(<InfoModal {...props} />)
                .instance()
                .requestClose(true);
        });

        it('should call cancelCallback method', () => {
            expect(props.cancelCallback).toHaveBeenCalledTimes(1);
        });

        it('should call dispatch method', () => {
            expect(dispatchStub).toHaveBeenCalledTimes(1);
        });

        it('should call dispatch method with params', () => {
            expect(dispatchStub).toHaveBeenCalledWith(showInfoModalStub());
        });

        it('should call showInfoModal method', () => {
            expect(showInfoModalStub).toHaveBeenCalledTimes(1);
        });

        it('should call showInfoModal method with params', () => {
            expect(showInfoModalStub).toHaveBeenCalledWith({ isOpen: false });
        });
    });

    describe('handleClick method', () => {
        beforeEach(() => {
            props.cancelCallback = createSpy('cancelCallback');
        });

        describe('without conifrmMsgObj', () => {
            beforeEach(() => {
                props.callback = createSpy('callback');
                component = shallow(<InfoModal {...props} />).instance();
                spyOn(component, 'requestClose');
                component.handleClick();
            });

            it('should call callback method', () => {
                expect(props.callback).toHaveBeenCalledTimes(1);
            });
        });

        describe('with conifrmMsgObj', () => {
            beforeEach(() => {
                props.confirmMsgObj = {
                    title: 'SomeTitle',
                    message: 'SomeMessage'
                };
                component = shallow(<InfoModal {...props} />).instance();
                spyOn(component, 'requestClose');
                component.handleClick();
            });

            it('should call dispatch method', () => {
                expect(dispatchStub).toHaveBeenCalledTimes(1);
            });

            it('should call dispatch method with params', () => {
                expect(dispatchStub).toHaveBeenCalledWith(showInfoModalStub());
            });

            it('should call showInfoModal method', () => {
                expect(showInfoModalStub).toHaveBeenCalledTimes(1);
            });

            it('should call showInfoModal method with params', () => {
                expect(showInfoModalStub).toHaveBeenCalledWith({
                    isOpen: true,
                    title: 'SomeTitle',
                    message: 'SomeMessage',
                    buttonText: 'done',
                    showCancelButton: false,
                    isHtml: true
                });
            });
        });
    });
});
