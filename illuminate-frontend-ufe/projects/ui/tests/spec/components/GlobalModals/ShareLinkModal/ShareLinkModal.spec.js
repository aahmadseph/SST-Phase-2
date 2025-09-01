const React = require('react');
const { shallow } = require('enzyme');
const store = require('Store').default;
const Actions = require('Actions').default;
const ShareLinkModal = require('components/GlobalModals/ShareLinkModal/ShareLinkModal').default;

describe('ShareLinkModal component', () => {
    let dispatchStub;
    let showShareLinkModalStub;

    describe('requestClose method', () => {
        beforeEach(() => {
            dispatchStub = spyOn(store, 'dispatch');
            showShareLinkModalStub = spyOn(Actions, 'showShareLinkModal');

            shallow(<ShareLinkModal />)
                .instance()
                .requestClose();
        });

        it('should call dispatch method', () => {
            expect(dispatchStub).toHaveBeenCalledTimes(1);
        });

        it('should call dispatch method params', () => {
            expect(dispatchStub).toHaveBeenCalledWith(showShareLinkModalStub());
        });

        it('should call showShareLinkModal method', () => {
            expect(showShareLinkModalStub).toHaveBeenCalledTimes(1);
        });

        it('should call showShareLinkModal method params', () => {
            expect(showShareLinkModalStub).toHaveBeenCalledWith(false);
        });
    });
});
