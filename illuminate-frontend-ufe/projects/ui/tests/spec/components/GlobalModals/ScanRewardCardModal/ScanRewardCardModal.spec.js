const React = require('react');
const { shallow } = require('enzyme');
const mediaId = require('utils/BCC').default.MEDIA_IDS.REWARDS_TERMS_AND_CONDITIONS;

describe('ScanRewardCardModal component', () => {
    let ScanRewardCardModal;
    let store;
    let actions;
    let component;
    let showScanRewardCardModalStub;
    let dispatchStub;
    let setStateStub;

    beforeEach(() => {
        ScanRewardCardModal = require('components/GlobalModals/ScanRewardCardModal/ScanRewardCardModal').default;
        store = require('Store').default;
        actions = require('Actions').default;

        dispatchStub = spyOn(store, 'dispatch');
        const wrapper = shallow(<ScanRewardCardModal globalModals={{}} />);
        component = wrapper.instance();
    });

    describe('requestClose Method', () => {
        beforeEach(() => {
            showScanRewardCardModalStub = spyOn(actions, 'showScanRewardCardModal');
            component.requestClose();
        });

        it('should call dispatch method', () => {
            expect(dispatchStub).toHaveBeenCalledTimes(1);
        });

        it('should call dispatch method with params', () => {
            expect(dispatchStub).toHaveBeenCalledWith(showScanRewardCardModalStub());
        });

        it('should call showScanRewardCardModalStub', () => {
            expect(showScanRewardCardModalStub).toHaveBeenCalledTimes(1);
        });

        it('should call showScanRewardCardModalStub with params', () => {
            expect(showScanRewardCardModalStub).toHaveBeenCalledWith({ isOpen: false });
        });
    });

    describe('showBarCode Method', () => {
        const activeId = 1;

        beforeEach(() => {
            const event = { preventDefault: () => {} };
            setStateStub = spyOn(component, 'setState');
            component.showBarCode(event, activeId);
        });

        it('should call setState', () => {
            expect(setStateStub).toHaveBeenCalledTimes(1);
        });

        it('should call setState', () => {
            expect(setStateStub).toHaveBeenCalledWith({ activeId });
        });
    });

    describe('isActiveId Method', () => {
        let id;

        beforeEach(() => {
            id = 1;
        });

        it('should return true if id and activeId match', () => {
            component.setState({ activeId: 1 });
            expect(component.isActiveId(id)).toBe(true);
        });

        it('should return false if id and activeId do not match', () => {
            component.setState({ activeId: 2 });
            expect(component.isActiveId(id)).toBe(false);
        });

        it('should return false if activeId is undefined', () => {
            component.setState({ activeId: undefined });
            const result = component.isActiveId(id);
            expect(result).toBe(false);
        });

        it('should return false if id is undefined', () => {
            id = undefined;
            component.setState({ activeId: 1 });
            expect(component.isActiveId(id)).toBe(false);
        });
    });

    describe('openMediaModal Method', () => {
        let showMediaModalStub;
        const event = { preventDefault: () => {} };

        beforeEach(() => {
            showMediaModalStub = spyOn(actions, 'showMediaModal');
            component.openMediaModal(event);
        });

        it('should call dispatchStub with argument showMediaModalStub', () => {
            expect(dispatchStub).toHaveBeenCalledWith(showMediaModalStub());
        });

        it('should call showMediaModalStub with correct arguments', () => {
            expect(showMediaModalStub).toHaveBeenCalledWith({
                isOpen: true,
                mediaId
            });
        });
    });
});
