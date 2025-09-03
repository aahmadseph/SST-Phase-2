const React = require('react');
const { shallow } = require('enzyme');
const store = require('Store').default;
const actions = require('Actions').default;
const anaConsts = require('analytics/constants').default;
const processEvent = require('analytics/processEvent').default;
const OrderConfirmRewardModal = require('components/GlobalModals/OrderConfirmRewardModal/OrderConfirmRewardModal').default;

describe('OrderConfirmRewardModal component', () => {
    let showOrderConfirmRewardModal;
    let dispatch;
    let processStub;

    describe('Request Close Method', () => {
        beforeEach(() => {
            dispatch = spyOn(store, 'dispatch');
            showOrderConfirmRewardModal = spyOn(actions, 'showOrderConfirmRewardModal');
        });

        it('should call dispatch method', () => {
            // Arrange/Act
            shallow(<OrderConfirmRewardModal />)
                .instance()
                .requestClose();

            // Assert
            expect(dispatch).toHaveBeenCalledTimes(1);
        });

        it('should call dispatch method with params', () => {
            // Arrange/Act
            shallow(<OrderConfirmRewardModal />)
                .instance()
                .requestClose();

            // Assert
            expect(dispatch).toHaveBeenCalledTimes(1);
        });

        it('should call showOrderConfirmRewardModalStub', () => {
            // Arrange/Act
            shallow(<OrderConfirmRewardModal />)
                .instance()
                .requestClose();

            // Assert
            expect(showOrderConfirmRewardModal).toHaveBeenCalledTimes(1);
        });

        it('should call showOrderConfirmRewardModalStub with params', () => {
            // Arrange/Act
            shallow(<OrderConfirmRewardModal />)
                .instance()
                .requestClose();

            // Assert
            expect(showOrderConfirmRewardModal).toHaveBeenCalledWith(false);
        });
    });

    describe('ctrlr Method', () => {
        beforeEach(() => {
            processStub = spyOn(processEvent, 'process');

            shallow(<OrderConfirmRewardModal />);
        });

        it('should call process method', () => {
            expect(processStub).toHaveBeenCalledTimes(1);
        });

        it('should call process method with params', () => {
            expect(processStub).toHaveBeenCalledWith(anaConsts.ASYNC_PAGE_LOAD, {
                data: {
                    pageName: 'modal:rewards bazaar:n/a:*',
                    pageType: 'modal',
                    pageDetail: 'rewards bazaar'
                }
            });
        });
    });
});
