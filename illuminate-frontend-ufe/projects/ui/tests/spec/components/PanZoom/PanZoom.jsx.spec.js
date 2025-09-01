const React = require('react');
const { shallow } = require('enzyme');

describe('<PanZoom />', () => {
    let PanZoom;
    let props;
    let shallowWrapper;
    let component;

    beforeEach(() => {
        PanZoom = require('components/PanZoom/PanZoom').default;
        props = {};
        shallowWrapper = shallow(<PanZoom {...props} />);
    });

    describe('Gesture options', () => {
        let options;

        beforeEach(() => {
            const hammerElement = shallowWrapper.findWhere(n => n.name() === 'Hammer');
            options = hammerElement.prop('options');
        });

        it('should enable pinch', () => {
            expect(options.recognizers.pinch.enable).toEqual(true);
        });
        it('should enable pan', () => {
            expect(options.recognizers.pan.enable).toEqual(true);
        });
        it('should enable tap', () => {
            expect(options.recognizers.tap.enable).toEqual(true);
        });
        it('should disable swipe', () => {
            expect(options.recognizers.swipe.enable).toEqual(false);
        });
        it('should disable press', () => {
            expect(options.recognizers.press.enable).toEqual(false);
        });
    });

    describe('Pinch handlers', () => {
        let hammerElement;
        let onPanSpy;
        let onPanStartSpy;
        let event;

        beforeEach(() => {
            event = {};
            component = shallowWrapper.instance();
            onPanSpy = spyOn(component, 'onPan');
            onPanStartSpy = spyOn(component, 'onPanStart');
            component.forceUpdate();
            shallowWrapper.update();
            hammerElement = shallowWrapper.findWhere(n => n.name() === 'Hammer');
        });

        it('should modify scale according to pinch scale of pinch event', () => {
            event.scale = 2;
            hammerElement.prop('onPinch')(event);
            expect(shallowWrapper.state().pinchScale).toEqual(2);
        });

        it('should hide the Pinch And Zoom message', () => {
            hammerElement.prop('onPinch')(event);
            expect(shallowWrapper.state().showMsg).toBeFalsy();
        });

        it('should call onPan to update coordinates of the image', () => {
            hammerElement.prop('onPinch')(event);
            expect(onPanSpy).toHaveBeenCalledWith(event);
        });

        it('should reset the pinch scale value at the end', () => {
            hammerElement.prop('onPinchEnd')(event);
            expect(shallowWrapper.state().pinchScale).toEqual(1);
        });

        it('should trigger onPanStart event to update the coordinates of the image', () => {
            hammerElement.prop('onPinchStart')(event);
            expect(onPanStartSpy).toHaveBeenCalledWith(event);
        });
    });

    describe('Event binding', () => {
        let onPanSpy;
        let onPanStartSpy;
        let onPanEndSpy;
        let onPinchSpy;
        let onPinchStartSpy;
        let onPinchEndSpy;
        let hammerElement;

        beforeEach(() => {
            component = shallowWrapper.instance();
            onPanSpy = spyOn(component, 'onPan');
            onPanStartSpy = spyOn(component, 'onPanStart');
            onPanEndSpy = spyOn(component, 'onPanEnd');
            onPinchSpy = spyOn(component, 'onPinch');
            onPinchStartSpy = spyOn(component, 'onPinchStart');
            onPinchEndSpy = spyOn(component, 'onPinchEnd');
            component.forceUpdate();
            shallowWrapper.update();
            hammerElement = shallowWrapper.findWhere(n => n.name() === 'Hammer');
        });

        it('should attach the component method onPan to Hammer property', () => {
            hammerElement.prop('onPan')();
            expect(onPanSpy).toHaveBeenCalled();
        });
        it('should attach the component method onPanStart to Hammer property', () => {
            hammerElement.prop('onPanStart')();
            expect(onPanStartSpy).toHaveBeenCalled();
        });
        it('should attach the component method onPanEnd to Hammer property', () => {
            hammerElement.prop('onPanEnd')();
            expect(onPanEndSpy).toHaveBeenCalled();
        });
        it('should attach the component method onPinch to Hammer property', () => {
            hammerElement.prop('onPinch')();
            expect(onPinchSpy).toHaveBeenCalled();
        });
        it('should attach the component method onPinchStart to Hammer property', () => {
            hammerElement.prop('onPinchStart')();
            expect(onPinchStartSpy).toHaveBeenCalled();
        });
        it('should attach the component method onPinchEnd to Hammer property', () => {
            hammerElement.prop('onPinchEnd')();
            expect(onPinchEndSpy).toHaveBeenCalled();
        });
    });
});
