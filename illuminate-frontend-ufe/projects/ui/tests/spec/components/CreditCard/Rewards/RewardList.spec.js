/* eslint-disable object-curly-newline */
const React = require('react');
const { any, objectContaining } = jasmine;
const { shallow } = require('enzyme');

describe('RewardList component', () => {
    let store;
    let setAndWatchStub;
    let setStateStub;
    let RewardList;
    let wrapper;
    let component;
    let promoUtils;
    let rewardCertificates;
    const user = {
        bankRewards: {
            currentLevelName: '3980994172',
            currentLevelNumber: '0600672112',
            expiredRewardsTotal: 0,
            rewardCertificates: [
                {
                    available: true,
                    barcodeIndicator: '39',
                    certificateNumber: 'RW8781863517',
                    expireDate: '2020-01-01',
                    fulfilDate: '2018-06-01',
                    pinCode: '100',
                    rewardAmount: 44,
                    startDate: '2018-06-01'
                },
                {
                    available: true,
                    barcodeIndicator: '39',
                    certificateNumber: 'RW6322971342',
                    expireDate: '2020-01-01',
                    fulfilDate: '2018-06-01',
                    pinCode: '100',
                    rewardAmount: 78,
                    startDate: '2018-06-01'
                },
                {
                    available: true,
                    barcodeIndicator: '39',
                    certificateNumber: 'RW2600991012',
                    expireDate: '2020-01-01',
                    fulfilDate: '2018-06-01',
                    pinCode: '100',
                    rewardAmount: 30,
                    startDate: '2018-06-01'
                },
                {
                    available: true,
                    barcodeIndicator: '39',
                    certificateNumber: 'RW4432859463',
                    expireDate: '2020-01-01',
                    fulfilDate: '2018-06-01',
                    pinCode: '100',
                    rewardAmount: 46,
                    startDate: '2018-06-01'
                },
                {
                    available: true,
                    barcodeIndicator: '39',
                    certificateNumber: 'RW3716670175',
                    expireDate: '2020-01-01',
                    fulfilDate: '2018-06-01',
                    pinCode: '100',
                    rewardAmount: 66,
                    startDate: '2018-06-01'
                },
                {
                    available: true,
                    barcodeIndicator: '39',
                    certificateNumber: 'RW4180794969',
                    expireDate: '2020-01-01',
                    fulfilDate: '2018-06-01',
                    pinCode: '100',
                    rewardAmount: 27,
                    startDate: '2018-06-01'
                },
                {
                    available: true,
                    barcodeIndicator: '39',
                    certificateNumber: 'RW8072461389',
                    expireDate: '2020-01-01',
                    fulfilDate: '2018-06-01',
                    pinCode: '100',
                    rewardAmount: 30,
                    startDate: '2018-06-01'
                },
                {
                    available: true,
                    barcodeIndicator: '128',
                    certificateNumber: 'RW2161792470',
                    expireDate: '2020-01-01',
                    fulfilDate: '2018-06-01',
                    pinCode: '100',
                    redeemDate: '2018-05-01',
                    rewardAmount: 76,
                    startDate: '2018-06-01'
                },
                {
                    available: true,
                    barcodeIndicator: '39',
                    certificateNumber: 'RW9474601479',
                    expireDate: '2020-01-01',
                    fulfilDate: '2018-06-01',
                    pinCode: '100',
                    redeemDate: '2018-05-01',
                    rewardAmount: 24,
                    startDate: '2018-06-01'
                },
                {
                    available: true,
                    barcodeIndicator: '39',
                    certificateNumber: 'RW5251298540',
                    expireDate: '2020-01-01',
                    fulfilDate: '2018-06-01',
                    pinCode: '100',
                    rewardAmount: 46,
                    startDate: '2018-06-01'
                }
            ],
            rewardsTotal: 467,
            upcomingRewardsTotal: 0
        },
        ccRewards: {
            bankRewards: {
                currentLevelName: '3980994172',
                currentLevelNumber: '0600672112',
                expiredRewardsTotal: 0,
                rewardCertificates: [
                    {
                        available: true,
                        barcodeIndicator: '39',
                        certificateNumber: 'RW8781863517',
                        expireDate: '2020-01-01',
                        fulfilDate: '2018-06-01',
                        pinCode: '100',
                        rewardAmount: 44,
                        startDate: '2018-06-01'
                    },
                    {
                        available: true,
                        barcodeIndicator: '39',
                        certificateNumber: 'RW6322971342',
                        expireDate: '2020-01-01',
                        fulfilDate: '2018-06-01',
                        pinCode: '100',
                        rewardAmount: 78,
                        startDate: '2018-06-01'
                    },
                    {
                        available: true,
                        barcodeIndicator: '39',
                        certificateNumber: 'RW2600991012',
                        expireDate: '2020-01-01',
                        fulfilDate: '2018-06-01',
                        pinCode: '100',
                        rewardAmount: 30,
                        startDate: '2018-06-01'
                    },
                    {
                        available: true,
                        barcodeIndicator: '39',
                        certificateNumber: 'RW4432859463',
                        expireDate: '2020-01-01',
                        fulfilDate: '2018-06-01',
                        pinCode: '100',
                        rewardAmount: 46,
                        startDate: '2018-06-01'
                    },
                    {
                        available: true,
                        barcodeIndicator: '39',
                        certificateNumber: 'RW3716670175',
                        expireDate: '2020-01-01',
                        fulfilDate: '2018-06-01',
                        pinCode: '100',
                        rewardAmount: 66,
                        startDate: '2018-06-01'
                    },
                    {
                        available: true,
                        barcodeIndicator: '39',
                        certificateNumber: 'RW4180794969',
                        expireDate: '2020-01-01',
                        fulfilDate: '2018-06-01',
                        pinCode: '100',
                        rewardAmount: 27,
                        startDate: '2018-06-01'
                    },
                    {
                        available: true,
                        barcodeIndicator: '39',
                        certificateNumber: 'RW8072461389',
                        expireDate: '2020-01-01',
                        fulfilDate: '2018-06-01',
                        pinCode: '100',
                        rewardAmount: 30,
                        startDate: '2018-06-01'
                    },
                    {
                        available: true,
                        barcodeIndicator: '128',
                        certificateNumber: 'RW2161792470',
                        expireDate: '2020-01-01',
                        fulfilDate: '2018-06-01',
                        pinCode: '100',
                        redeemDate: '2018-05-01',
                        rewardAmount: 76,
                        startDate: '2018-06-01'
                    },
                    {
                        available: true,
                        barcodeIndicator: '39',
                        certificateNumber: 'RW9474601479',
                        expireDate: '2020-01-01',
                        fulfilDate: '2018-06-01',
                        pinCode: '100',
                        redeemDate: '2018-05-01',
                        rewardAmount: 24,
                        startDate: '2018-06-01'
                    },
                    {
                        available: true,
                        barcodeIndicator: '39',
                        certificateNumber: 'RW5251298540',
                        expireDate: '2020-01-01',
                        fulfilDate: '2018-06-01',
                        pinCode: '100',
                        rewardAmount: 46,
                        startDate: '2018-06-01'
                    }
                ],
                rewardsTotal: 467,
                upcomingRewardsTotal: 0
            }
        }
    };
    const basket = {
        appliedPromotions: [
            {
                couponCode: 'RW8781863517',
                discountAmount: '$10.00',
                displayName: 'Bank Rewards Promotion',
                promotionId: 'promo4240001',
                promotionType: 'Order Discount'
            }
        ]
    };
    const promotion = {
        appliedPromotions: [
            {
                couponCode: 'RW8781863517',
                discountAmount: '$10.00',
                displayName: 'Bank Rewards Promotion',
                promotionId: 'promo4240001',
                promotionType: 'Order Discount'
            }
        ]
    };

    beforeEach(() => {
        RewardList = require('components/CreditCard/Rewards/RewardList/RewardList').default;
        store = require('Store').default;
        promoUtils = require('utils/Promos').default;
        setAndWatchStub = spyOn(store, 'setAndWatch');

        wrapper = shallow(<RewardList globalModals={{}} />);
        component = wrapper.instance();
        component.NUMBER_OF_REWARDS_TO_SHOW = 3;
    });

    describe('render', () => {
        beforeEach(() => {
            component.setState({
                showRewardList: true,
                bankRewards: {},
                rewardsToShow: user.bankRewards.rewardCertificates
            });
        });

        it('should render rewards as a list', () => {
            // Arrange
            const renderAsListStub = spyOn(component, 'renderAsList');

            // Act
            component.render();

            // Assert
            expect(renderAsListStub).toHaveBeenCalledTimes(1);
        });

        it('should render rewards as a carousel', () => {
            // Arrange
            const renderAsCarouselStub = spyOn(component, 'renderAsCarousel');
            wrapper.setProps({ isCarousel: true });

            // Act
            component.render();

            // Assert
            expect(renderAsCarouselStub).toHaveBeenCalled();
        });
    });

    describe('ctrlr', () => {
        it('should call setAndWatch function with arguments', () => {
            // Arrange/Act
            wrapper = shallow(<RewardList />);
            component = wrapper.instance();

            // Assert
            expect(setAndWatchStub).toHaveBeenCalledWith('user', component, any(Function));
        });

        it('should call setAndWatch function with arguments', () => {
            // Arrange/Act
            wrapper = shallow(<RewardList />);
            component = wrapper.instance();

            // Assert
            expect(setAndWatchStub).toHaveBeenCalledWith('order.orderDetails', component, any(Function));
        });

        it('should call setAndWatch function with arguments', () => {
            // Arrange/Act
            wrapper = shallow(<RewardList />);
            component = wrapper.instance();

            // Assert
            expect(setAndWatchStub).toHaveBeenCalledWith('basket', component, any(Function));
        });

        it('should call setAndWatch function with arguments', () => {
            // Arrange/Act
            wrapper = shallow(<RewardList />);
            component = wrapper.instance();

            // Assert
            expect(setAndWatchStub).toHaveBeenCalledWith('promo', component, any(Function));
        });
    });

    describe('setCreditCardRewards method', () => {
        let bankRewards;
        let appliedRewards;
        let appliedRewardsTotal = 0;
        let availableRewardsTotal;

        beforeEach(() => {
            bankRewards = user.bankRewards;
            setStateStub = spyOn(component, 'setState');
        });

        describe('with no applied rewards', () => {
            beforeEach(() => {
                appliedRewards = [];
                rewardCertificates = component.addStatusAndSort(bankRewards, appliedRewards);
                appliedRewardsTotal = component.addAppliedRewards(rewardCertificates);
                availableRewardsTotal = bankRewards.rewardsTotal - appliedRewardsTotal;

                const mockUser = Object.assign({}, { user });
                component.setCreditCardRewards(mockUser);
            });

            it('should call setState function once', () => {
                expect(setStateStub).toHaveBeenCalledTimes(1);
            });

            it('should call setState function with', () => {
                expect(setStateStub).toHaveBeenCalledWith(
                    objectContaining({
                        rewardCertificates,
                        appliedRewardsTotal,
                        availableRewardsTotal
                    })
                );
            });
        });

        describe('with one or more applied rewards', () => {
            let mockUserAndBasket;
            let mockUserAndPromos;
            let getAppliedPromotionsStub;

            describe('on Basket page', () => {
                beforeEach(() => {
                    appliedRewards = basket.appliedPromotions;
                    getAppliedPromotionsStub = spyOn(promoUtils, 'getAppliedPromotions').and.returnValue(appliedRewards);
                    rewardCertificates = component.addStatusAndSort(bankRewards, appliedRewards);
                    appliedRewardsTotal = component.addAppliedRewards(rewardCertificates);
                    availableRewardsTotal = bankRewards.rewardsTotal - appliedRewardsTotal;

                    mockUserAndBasket = Object.assign({}, { user }, { basket });
                    component.setCreditCardRewards(mockUserAndBasket);
                });

                it('should call getAppliedPromotion function once', () => {
                    expect(getAppliedPromotionsStub).toHaveBeenCalledTimes(1);
                });

                it('should call setState function once', () => {
                    expect(setStateStub).toHaveBeenCalledTimes(1);
                });

                it('should call setState function with', () => {
                    expect(setStateStub).toHaveBeenCalledWith(
                        objectContaining({
                            rewardCertificates,
                            appliedRewardsTotal,
                            availableRewardsTotal
                        })
                    );
                });
            });

            describe('on Checkout page ', () => {
                beforeEach(() => {
                    appliedRewards = promotion.appliedPromotions;
                    getAppliedPromotionsStub = spyOn(promoUtils, 'getAppliedPromotions').and.returnValue(appliedRewards);
                    rewardCertificates = component.addStatusAndSort(bankRewards, appliedRewards);
                    appliedRewardsTotal = component.addAppliedRewards(rewardCertificates);
                    availableRewardsTotal = bankRewards.rewardsTotal - appliedRewardsTotal;

                    mockUserAndPromos = Object.assign({}, { user }, { promotion });
                    wrapper.setProps({ isCheckout: true });
                    component.setCreditCardRewards(mockUserAndPromos);
                });

                it('should call getAppliedPromotion function once', () => {
                    expect(getAppliedPromotionsStub).toHaveBeenCalledTimes(1);
                });

                it('should call setState function once', () => {
                    expect(setStateStub).toHaveBeenCalledTimes(1);
                });

                it('should call setState function with', () => {
                    expect(setStateStub).toHaveBeenCalledWith(
                        objectContaining({
                            rewardCertificates,
                            appliedRewardsTotal,
                            availableRewardsTotal
                        })
                    );
                });
            });
        });
    });

    describe('setErrorMessage method', () => {
        let errorMessage;

        beforeEach(() => {
            errorMessage = ['Error'];
            setStateStub = spyOn(component, 'setState');
            component.setErrorMessage(errorMessage);
        });

        it('should call setState function once', () => {
            expect(setStateStub).toHaveBeenCalledTimes(1);
        });

        it('should call setState function with', () => {
            expect(setStateStub).toHaveBeenCalledWith({
                errorMessage: errorMessage[0],
                hasError: true,
                showRewardList: true
            });
        });
    });

    describe('showMore method', () => {
        const currentPage = 1;

        beforeEach(() => {
            rewardCertificates = user.bankRewards.rewardCertificates;
            component.setState({
                currentPage,
                rewardCertificates
            });
            setStateStub = spyOn(component, 'setState');
            component.showMore();
        });

        it('should call setState function once', () => {
            expect(setStateStub).toHaveBeenCalledTimes(1);
        });

        it('should call setState function with', () => {
            expect(setStateStub).toHaveBeenCalledWith(
                objectContaining({
                    rewardsToShow: rewardCertificates.slice(0, component.NUMBER_OF_REWARDS_TO_SHOW * (currentPage + 2))
                })
            );
        });
    });

    describe('showLess method', () => {
        beforeEach(() => {
            rewardCertificates = user.bankRewards.rewardCertificates;
            component.setState({ rewardCertificates });
            setStateStub = spyOn(component, 'setState');
            component.showLess();
        });

        it('should call setState function once', () => {
            expect(setStateStub).toHaveBeenCalledTimes(1);
        });

        it('should call setState function with', () => {
            expect(setStateStub).toHaveBeenCalledWith(
                objectContaining({
                    rewardsToShow: rewardCertificates.slice(0, component.NUMBER_OF_REWARDS_TO_SHOW)
                })
            );
        });
    });

    describe('applyToBasket method', () => {
        let applyPromoStub;
        let certNumberStub;

        beforeEach(() => {
            applyPromoStub = spyOn(promoUtils, 'applyPromo');
            certNumberStub = user.bankRewards.rewardCertificates[0].certificateNumber;
            component.applyToBasket(certNumberStub);
        });

        it('should call applyPromoStub function once', () => {
            expect(applyPromoStub).toHaveBeenCalledTimes(1);
        });

        it('should call applyPromoStub function with', () => {
            expect(applyPromoStub).toHaveBeenCalledWith(certNumberStub.toLowerCase(), null, any(String));
        });
    });

    describe('removeFromBasket method', () => {
        let removePromoStub;
        let certNumberStub;
        const fakePromise = {
            then: function () {
                return fakePromise;
            },
            catch: function () {
                return fakePromise;
            }
        };

        beforeEach(() => {
            removePromoStub = spyOn(promoUtils, 'removePromo').and.returnValue(fakePromise);
            certNumberStub = user.bankRewards.rewardCertificates[0].certificateNumber;
            component.removeFromBasket(certNumberStub);
        });

        it('should call setState function once', () => {
            expect(removePromoStub).toHaveBeenCalledTimes(1);
        });

        it('should call setState function with', () => {
            expect(removePromoStub).toHaveBeenCalledWith(certNumberStub.toLowerCase(), any(String));
        });
    });

    describe('openMediaModal method', () => {
        let termsAndConditionsActions;
        let dispatchStub;
        let showModalStub;
        let mediaId;

        beforeEach(() => {
            termsAndConditionsActions = require('actions/TermsAndConditionsActions').default;
            mediaId = require('utils/BCC').default.MEDIA_IDS.REWARDS_TERMS_AND_CONDITIONS;

            Sephora.headerFooterContent = { globalModals: {} };
            dispatchStub = spyOn(store, 'dispatch');
            showModalStub = spyOn(termsAndConditionsActions, 'showModal');

            component.openMediaModal();
        });

        it('should call dispatchStub with argument showModalStub', () => {
            expect(dispatchStub).toHaveBeenCalledWith(showModalStub());
        });

        it('should call showModalStub with correct arguments', () => {
            expect(showModalStub).toHaveBeenCalledWith(true, mediaId, '');
        });
    });

    describe('openModal method', () => {
        let fireAnalyticsStub;

        beforeEach(() => {
            spyOn(store, 'dispatch');
            fireAnalyticsStub = spyOn(component, 'fireAnalytics');
            component.openModal();
        });

        it('should call fireAnalytics when opening a modal', () => {
            expect(fireAnalyticsStub).toHaveBeenCalled();
        });
    });
});
