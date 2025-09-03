const React = require('react');
const { shallow } = require('enzyme');
const store = require('Store').default;
const Actions = require('Actions').default;
const SampleModal = require('components/GlobalModals/SampleModal/SampleModal').default;

describe('SampleModal component', () => {
    let dispatch;
    let showSampleModal;

    describe('isDone method', () => {
        beforeEach(() => {
            dispatch = spyOn(store, 'dispatch');
            showSampleModal = spyOn(Actions, 'showSampleModal');

            shallow(<SampleModal />)
                .instance()
                .isDone();
        });

        it('should call dispatch method', () => {
            expect(dispatch).toHaveBeenCalledTimes(1);
        });

        it('should call dispatch method with params', () => {
            expect(dispatch).toHaveBeenCalledWith(showSampleModal());
        });

        it('should call showSampleModal method', () => {
            expect(showSampleModal).toHaveBeenCalledTimes(1);
        });

        it('should call dispatch method with params', () => {
            expect(showSampleModal).toHaveBeenCalledWith({ isOpen: false });
        });
    });
});
