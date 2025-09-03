const React = require('react');
const { createSpy } = jasmine;
const { shallow } = require('enzyme');

describe('ValueTable component', () => {
    let store;
    let actions;
    let dispatchSpy;
    let showMediaModalStub;
    let ValueTable;
    let component;

    beforeEach(() => {
        store = require('store/Store').default;
        actions = require('actions/Actions').default;
        dispatchSpy = spyOn(store, 'dispatch');
        showMediaModalStub = spyOn(actions, 'showMediaModal');
        ValueTable = require('components/RichProfile/BeautyInsider/ValueTable/ValueTable').default;
        const wrapper = shallow(<ValueTable />);
        component = wrapper.instance();
    });

    describe('openModal', () => {
        let preventDefaultSpy;
        let event;
        beforeEach(() => {
            preventDefaultSpy = createSpy();
            event = {
                type: 'click',
                preventDefault: preventDefaultSpy
            };
        });

        it('should call event preventDefault', () => {
            component.openModal(event, 0);
            expect(preventDefaultSpy).toHaveBeenCalled();
        });

        it('should call dispatch', () => {
            component.openModal(event, 0);
            expect(dispatchSpy).toHaveBeenCalled();
        });

        it('should call dispatch', () => {
            component.openModal(event, 0);
            expect(showMediaModalStub).toHaveBeenCalled();
        });
    });
});
