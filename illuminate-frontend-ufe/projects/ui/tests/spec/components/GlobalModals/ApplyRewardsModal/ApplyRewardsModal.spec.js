describe('ApplyRewardsModal component', () => {
    let React;
    let shallow;
    let store;
    let showApplyRewardsModal;
    let ApplyRewardsModal;
    let shallowComponent;
    let PROMO_TYPES;

    beforeEach(() => {
        React = require('react');
        shallow = enzyme.shallow;
        store = require('store/Store').default;
        showApplyRewardsModal = require('Actions').default.showApplyRewardsModal;
        ApplyRewardsModal = require('components/GlobalModals/ApplyRewardsModal/ApplyRewardsModal').default;
        PROMO_TYPES = require('utils/Promos').default.PROMO_TYPES;
    });

    describe('requestClose', () => {
        it('should dispatch showApplyRewardsModal action', () => {
            const dispatchFunc = spyOn(store, 'dispatch');
            const action = showApplyRewardsModal(false);
            ApplyRewardsModal.requestClose();
            expect(dispatchFunc).toHaveBeenCalledWith(action);
        });
    });

    describe('with CBR type', () => {
        let requestCloseFunc;
        const getHeadLink = () => {
            return shallowComponent.find('ModalHeader').find('Link');
        };

        beforeEach(() => {
            requestCloseFunc = spyOn(ApplyRewardsModal, 'requestClose');
            shallowComponent = shallow(<ApplyRewardsModal type={PROMO_TYPES.CBR} />);
        });

        it('should render a modal instance', () => {
            expect(shallowComponent.find('Modal').length).toBe(1);
        });

        it('should render a single element in the body', () => {
            expect(shallowComponent.find('ModalBody').children().length).toBe(1);
        });

        it('should render LoyaltyPromo', () => {
            expect(shallowComponent.find('ModalBody').childAt(0).name()).toBe('ErrorBoundary(Connect(LoyaltyPromo))');
        });

        it('should render a close link in header', () => {
            expect(getHeadLink().childAt(0).text()).toBe('Done');
        });

        it('should call requestClose on close link click', () => {
            getHeadLink().simulate('click');
            expect(requestCloseFunc).toHaveBeenCalledTimes(1);
        });
    });

    describe('with CCR type', () => {
        beforeEach(() => {
            shallowComponent = shallow(<ApplyRewardsModal type={PROMO_TYPES.CCR} />);
        });

        it('should render a single element in the body', () => {
            expect(shallowComponent.find('ModalBody').children().length).toBe(1);
        });

        it('should render RewardList', () => {
            expect(shallowComponent.find('ModalBody').childAt(0).name()).toBe('ErrorBoundary(Connect(RewardList))');
        });
    });

    describe('with malformed type', () => {
        beforeEach(() => {
            shallowComponent = shallow(<ApplyRewardsModal type='invalid' />);
        });

        it('should not render elements in the body', () => {
            expect(shallowComponent.find('ModalBody').children().length).toBe(0);
        });

        xit('should output an error', () => {
            // eslint-disable-next-line no-console
            expect(console.error).toHaveBeenCalled();
        });
    });
});
