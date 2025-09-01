const React = require('react');
const { shallow } = require('enzyme');
const store = require('Store').default;
const Actions = require('Actions').default;
const ExtendSessionFailureModal = require('components/GlobalModals/ExtendSessionFailureModal/ExtendSessionFailureModal').default;

describe('ExtendSessionFailureModal component', () => {
    let dispatch;
    let showExtendSessionFailureModal;

    beforeEach(() => {
        dispatch = spyOn(store, 'dispatch');
        showExtendSessionFailureModal = spyOn(Actions, 'showExtendSessionFailureModal');

        shallow(<ExtendSessionFailureModal />)
            .instance()
            .requestClose();
    });

    it('should call dispatch method', () => {
        expect(dispatch).toHaveBeenCalledTimes(1);
    });

    it('should call dispatch method with params', () => {
        expect(dispatch).toHaveBeenCalledWith(showExtendSessionFailureModal());
    });

    it('should call showExtendSessionFailureModal method', () => {
        expect(showExtendSessionFailureModal).toHaveBeenCalledTimes(1);
    });

    it('should call showExtendSessionFailureModal method with params', () => {
        expect(showExtendSessionFailureModal).toHaveBeenCalledWith(false);
    });
});
