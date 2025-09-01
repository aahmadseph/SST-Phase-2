/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import PropTypes from 'prop-types';
import {
    Flex, Button, Text, Link, Box, Grid, Divider, Icon, Image
} from 'components/ui';
import {
    space, colors, fontSizes, lineHeights, fontWeights, mediaQueries
} from 'style/config';
import AutoReplenishmentItem from 'components/RichProfile/MyAccount/AutoReplenishment/AutoReplenishmentItem';
import AutoReplenishmentCancelledItem from 'components/RichProfile/MyAccount/AutoReplenishment/AutoReplenishmentCancelledItem';
import PleaseSignInBlock from 'components/RichProfile/MyAccount/PleaseSignIn';
import UnsubscribeAutoReplenModal from 'components/GlobalModals/UnsubscribeAutoReplenModal';
import PauseAutoReplenModal from 'components/GlobalModals/PauseAutoReplenModal';
import SkipAutoReplenModal from 'components/GlobalModals/SkipAutoReplenModal';
import GetItSoonerAutoReplenModal from 'components/GlobalModals/GetItSoonerAutoReplenModal';
import ManageSubscriptionModal from 'components/GlobalModals/ManageSubscriptionModal';
import ModifySubscriptionErrorModal from 'components/GlobalModals/ModifySubscriptionErrorModal';
import DeliveryFrequencyModal from 'components/GlobalModals/DeliveryFrequencyModal';
import SubscriptionUpdatePaymentModal from 'components/GlobalModals/SubscriptionUpdatePaymentModal';
import AddPaymentMethodModal from 'components/GlobalModals/AddPaymentMethodModal';
import ResumeSubscriptionModal from 'components/GlobalModals/ResumeSubscriptionModal';
import ConfirmResumeAutoReplenModal from 'components/GlobalModals/ConfirmResumeAutoReplenModal';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import errorsUtils from 'utils/Errors';
import anaUtils from 'analytics/utils';
import creditCardUtils from 'utils/CreditCard';
import helpersUtils from 'utils/Helpers';
import stringUtils from 'utils/String';
import linkTrackingError from 'analytics/bindings/pages/all/linkTrackingError';
import SubscriptionTypes from 'constants/SubscriptionTypes';
import RCPSCookies from 'utils/RCPSCookies';
import { globalModals, renderModal } from 'utils/globalModals';
import ComponentList from 'components/Content/ComponentList';
import contentConstants from 'constants/content';
import autoReplenishmentConstants from 'constants/AutoReplenishment';
import Empty from 'constants/empty';
const { AUTO_REPLENISHMENT } = SubscriptionTypes;
const { AUTO_REPLENISH_FAQS } = globalModals;
const { formatSiteCatalystPrice } = helpersUtils;
const { CONTEXTS } = contentConstants;
const { CARD_SIZE_CONFIG } = autoReplenishmentConstants;

class AutoReplenishment extends BaseClass {
    state = {
        showUnsubscribeAutoReplenModal: false,
        showPauseAutoReplenModal: false,
        showSkipAutoReplenModal: false,
        showManageSubscriptionModal: false,
        showModifySubscriptionErrorModal: false,
        currentSubscription: {},
        showChangeDeliveryFrequencyModal: false,
        showUpdatePaymentModal: false,
        currentSubscriptionPaymentInfo: {},
        unsubscribeConfirmation: false,
        showAddCardModal: false,
        isEditMode: false,
        creditCardForEdit: null,
        allCreditCards: null,
        rawCreditCards: null,
        showResumeSubscriptionModal: false,
        showConfirmResumeSubscriptionModal: false,
        previousModal: null
    };

    componentDidMount() {
        this.props.loadSubscriptions();

        if (Sephora.configurationSettings.isChasePaymentEnabled) {
            creditCardUtils.loadChaseTokenizer();
        }

        if (this.props.profileId) {
            this.props.fetchClientSummary(this.props.profileId, true);
        }
    }

    componentDidUpdate(prevProps) {
        const eventStrings = [];
        let totalSubscriptions = 0;

        if (this.props.active !== prevProps.active) {
            eventStrings.push(`${anaConsts.Event.AUTO_REPLENISH_ACTIVE_PRODUCTS}=${this.props.active}`);
            totalSubscriptions += this.props.active;
        }

        if (this.props.paused !== prevProps.paused) {
            eventStrings.push(`${anaConsts.Event.AUTO_REPLENISH_PAUSED_PRODUCTS}=${this.props.paused}`);
            totalSubscriptions += this.props.paused;
        }

        eventStrings.push(`${anaConsts.Event.PRODUCT_COUNT}=${totalSubscriptions}`);

        if (eventStrings.length > 0) {
            digitalData.page.attributes.eventStrings = eventStrings;
        }

        if (this.props.profileId && !prevProps.profileId) {
            this.props.fetchClientSummary(this.props.profileId, true);
        }

        if (RCPSCookies.isRCPSFullProfileGroup() && !this.props.displaySignIn && this.props.displaySignIn !== prevProps.displaySignIn) {
            this.props.loadSubscriptions();
        }
    }

    renderCancelledItems(cancelledSubscriptions) {
        return cancelledSubscriptions?.map(subscription =>
            subscription?.items?.map(item => (
                <AutoReplenishmentCancelledItem
                    key={subscription.subscriptionId}
                    subscription={subscription}
                    item={item}
                />
            ))
        );
    }

    toggleUnsubscribeAutoReplenModal = () => {
        if (this.state.showUnsubscribeAutoReplenModal) {
            this.props.unsubscribeModalClose(this.state.currentSubscription);
        }

        this.setState(
            prevState => ({
                showUnsubscribeAutoReplenModal: !prevState.showUnsubscribeAutoReplenModal
            }),
            () => {
                if (!this.state.unsubscribeConfirmation) {
                    this.fireAnalytics('unsubscribeModal');
                }
            }
        );
    };

    toggleSkipAutoReplenModal = (triggerAnalytics = true, analyticsKey = 'skip') => {
        const { previousModal, showSkipAutoReplenModal } = this.state;

        if (showSkipAutoReplenModal) {
            this.props.skipModalClose(this.state.currentSubscription);
        }

        this.setState(
            prevState => ({
                showSkipAutoReplenModal: !prevState.showSkipAutoReplenModal,
                ...(previousModal && {
                    showManageSubscriptionModal: !prevState.showManageSubscriptionModal,
                    [previousModal]: !prevState[previousModal],
                    previousModal: null
                })
            }),
            () => {
                this.toggleManageSubscriptionModal(false);
                triggerAnalytics && this.fireAnalytics(analyticsKey);
            }
        );
    };

    toggleGetItSoonerAutoReplenModal = () => {
        // Only trigger on close
        if (!this.state.showManageSubscriptionModal) {
            this.props.closeGetItSooner(this.state.currentSubscription);
        }

        this.setState(
            prevState => ({
                showGetItSoonerAutoReplenModal: !prevState.showGetItSoonerAutoReplenModal
            }),
            () => {
                this.toggleManageSubscriptionModal(false);
                this.fireAnalytics('getItSoonerModal');
            }
        );
    };

    togglePauseAutoReplenModal = (triggerAnalytics = true) => {
        this.setState(
            prevState => ({
                showPauseAutoReplenModal: !prevState.showPauseAutoReplenModal
            }),
            () => {
                if (triggerAnalytics) {
                    this.fireAnalytics('pauseSubscription');
                }

                this.toggleManageSubscriptionModal(false);
            }
        );
    };

    handleCloseGetItSooner = () => {
        this.setState(prevState => ({
            showGetItSoonerAutoReplenModal: !prevState.showGetItSoonerAutoReplenModal
        }));
    };

    handleUnsubscribeConfirmation = () => {
        this.setState(
            {
                unsubscribeConfirmation: true
            },
            () => {
                this.fireAnalytics('unsubscribeConfirmation');
                this.setState({
                    unsubscribeConfirmation: false
                });
            }
        );
    };

    toggleManageSubscriptionModal = (triggerAnalytics = true) => {
        this.setState(
            prevState => {
                return {
                    showManageSubscriptionModal: !prevState.showManageSubscriptionModal
                };
            },
            () => {
                if (triggerAnalytics) {
                    this.fireAnalytics('manageSubscription');
                }
            }
        );
    };

    toggleChangeDeliveryFrequencyModal = () => {
        this.setState(
            prevState => ({
                showChangeDeliveryFrequencyModal: !prevState.showChangeDeliveryFrequencyModal
            }),
            () => {
                this.fireAnalytics('deliveryFrequencyModal');
            }
        );
    };

    toggleModifySubscriptionErrorModal = () => {
        this.setState(prevState => ({
            showModifySubscriptionErrorModal: !prevState.showModifySubscriptionErrorModal
        }));
    };

    toggleUpdatePaymentModal = (analyticsKey = 'updatePayment') => {
        this.setState(
            prevState => ({
                showManageSubscriptionModal: !prevState.showManageSubscriptionModal,
                showUpdatePaymentModal: !prevState.showUpdatePaymentModal,
                currentSubscriptionPaymentInfo: {}
            }),
            () => {
                this.fireAnalytics(analyticsKey);
            }
        );
    };

    toggleAddCardModal = (isEditMode = false, analyticsKey) => {
        this.setState(
            prevState => {
                return {
                    showUpdatePaymentModal: !prevState.showUpdatePaymentModal,
                    showAddCardModal: !prevState.showAddCardModal,
                    isEditMode
                };
            },
            () => {
                this.fireAnalytics(analyticsKey);
            }
        );
    };

    toggleResumeSubscriptionModal = (analyticsKey = 'resumeSubscription') => {
        this.setState(
            prevState => {
                return {
                    showResumeSubscriptionModal: !prevState.showResumeSubscriptionModal
                };
            },
            () => {
                this.fireAnalytics(analyticsKey);
            }
        );
    };

    setCurrentSubscription = subscription => {
        const currentCardInfo = Object.keys(this.state.currentSubscriptionPaymentInfo).length > 0;
        const currentPaymentId = currentCardInfo ? this.state.currentSubscriptionPaymentInfo.selectedCreditCardId : subscription.paymentId;
        this.setState({
            currentSubscription: {
                ...subscription,
                paymentId: currentPaymentId,
                currentSku: {
                    ...subscription.items[0],
                    frequency: subscription.frequency,
                    frequencyType: subscription.frequencyType
                }
            }
        });
    };

    analyticsMap = {
        unsubscribeModal: ({ showUnsubscribeAutoReplenModal }) => ({
            method: anaConsts.ASYNC_PAGE_LOAD,
            pageDetail: anaConsts.PAGE_DETAIL.UNSUBSCRIBE_SUBSCRIPTION,
            prop55: showUnsubscribeAutoReplenModal
                ? anaConsts.LinkData.UNSUBSCRIBE_SUBSCRIPTION_OPEN
                : anaConsts.LinkData.UNSUBSCRIBE_SUBSCRIPTION_CLOSE
        }),
        unsubscribeConfirmation: () => ({
            method: anaConsts.ASYNC_PAGE_LOAD,
            pageDetail: anaConsts.PAGE_DETAIL.UNSUBSCRIBE_CONFIRMATION,
            prop55: null
        }),
        manageSubscription: ({ showManageSubscriptionModal }) => ({
            method: anaConsts.ASYNC_PAGE_LOAD,
            pageDetail: anaConsts.PAGE_DETAIL.MANAGE_SUBSCRIPTION,
            prop55: showManageSubscriptionModal ? anaConsts.LinkData.MANAGE_SUBSCRIPTION_OPEN : anaConsts.LinkData.MANAGE_SUBSCRIPTION_CLOSE
        }),
        pauseConfirmation: () => ({
            method: anaConsts.ASYNC_PAGE_LOAD,
            pageDetail: anaConsts.PAGE_DETAIL.PAUSE_CONFIRMATION,
            prop55: null,
            subscriptionStatusFromModal: 'paused'
        }),
        deliveryFrequencyModal: ({ showChangeDeliveryFrequencyModal }) => ({
            method: anaConsts.ASYNC_PAGE_LOAD,
            prop55: showChangeDeliveryFrequencyModal
                ? anaConsts.LinkData.AUTO_REPLENISH_FREQUENCY_OPEN
                : anaConsts.LinkData.AUTO_REPLENISH_FREQUENCY_CLOSE,
            pageDetail: anaConsts.PAGE_DETAIL.DELIVERY_FREQUENCY
        }),
        getItSoonerModal: ({ showGetItSoonerAutoReplenModal }) => ({
            method: showGetItSoonerAutoReplenModal ? anaConsts.ASYNC_PAGE_LOAD : anaConsts.LINK_TRACKING_EVENT,
            prop55: showGetItSoonerAutoReplenModal ? anaConsts.LinkData.GET_IT_SOONER_OPEN : anaConsts.LinkData.GET_IT_SOONER_CLOSE,
            pageDetail: anaConsts.PAGE_DETAIL.GET_IT_SOONER
        }),
        getItSoonerConfirmation: ({ showGetItSoonerAutoReplenModal }) => ({
            method: showGetItSoonerAutoReplenModal ? anaConsts.ASYNC_PAGE_LOAD : anaConsts.LINK_TRACKING_EVENT,
            prop55: null,
            pageDetail: anaConsts.PAGE_DETAIL.GET_IT_SOONER_CONFIRMATION
        }),
        getItSoonerUnavailable: ({ showGetItSoonerAutoReplenModal }) => ({
            method: showGetItSoonerAutoReplenModal ? anaConsts.ASYNC_PAGE_LOAD : anaConsts.LINK_TRACKING_EVENT,
            prop55: null,
            pageDetail: anaConsts.PAGE_DETAIL.GET_IT_SOONER_UNAVAILABLE
        }),
        pauseSubscription: ({ showPauseAutoReplenModal }) => ({
            method: anaConsts.ASYNC_PAGE_LOAD,
            prop55: showPauseAutoReplenModal ? anaConsts.LinkData.PAUSE_SUBSCRIPTION_OPEN : anaConsts.LinkData.PAUSE_SUBSCRIPTION_CLOSE,
            pageDetail: anaConsts.PAGE_DETAIL.PAUSE_SUBSCRIPTION
        }),
        updatePayment: ({ showUpdatePaymentModal }) => ({
            method: showUpdatePaymentModal ? anaConsts.ASYNC_PAGE_LOAD : anaConsts.LINK_TRACKING_EVENT,
            prop55: showUpdatePaymentModal ? anaConsts.LinkData.UPDATE_PAYMENT_OPEN : anaConsts.LinkData.UPDATE_PAYMENT_CLOSE,
            pageDetail: anaConsts.PAGE_DETAIL.UPDATE_PAYMENT,
            previousPageDetail: showUpdatePaymentModal ? anaConsts.PAGE_DETAIL.MANAGE_SUBSCRIPTION : anaConsts.PAGE_DETAIL.UPDATE_PAYMENT
        }),
        addCard: ({ showAddCardModal }) => ({
            method: showAddCardModal ? anaConsts.ASYNC_PAGE_LOAD : anaConsts.LINK_TRACKING_EVENT,
            prop55: showAddCardModal ? anaConsts.LinkData.ADD_CARD_OPEN : anaConsts.LinkData.ADD_CARD_CLOSE,
            pageDetail: anaConsts.PAGE_DETAIL.ADD_CARD,
            previousPageDetail: showAddCardModal ? anaConsts.PAGE_DETAIL.UPDATE_PAYMENT : anaConsts.PAGE_DETAIL.ADD_CARD
        }),
        editCard: ({ isEditMode }) => ({
            method: isEditMode ? anaConsts.ASYNC_PAGE_LOAD : anaConsts.LINK_TRACKING_EVENT,
            prop55: isEditMode ? anaConsts.LinkData.EDIT_CARD_OPEN : anaConsts.LinkData.EDIT_CARD_CLOSE,
            pageDetail: anaConsts.PAGE_DETAIL.EDIT_CARD,
            previousPageDetail: isEditMode ? anaConsts.PAGE_DETAIL.UPDATE_PAYMENT : anaConsts.PAGE_DETAIL.EDIT_CARD
        }),
        saveUpdateMethod: () => ({
            method: anaConsts.LINK_TRACKING_EVENT,
            prop55: anaConsts.LinkData.SAVE_CARD_UPDATE,
            pageDetail: anaConsts.PAGE_DETAIL.UPDATE_PAYMENT,
            previousPageDetail: anaConsts.PAGE_DETAIL.UPDATE_PAYMENT
        }),
        saveEditedCard: () => ({
            method: anaConsts.LINK_TRACKING_EVENT,
            prop55: anaConsts.LinkData.SAVE_CARD_EDIT,
            pageDetail: anaConsts.PAGE_DETAIL.EDIT_CARD,
            previousPageDetail: anaConsts.PAGE_DETAIL.EDIT_CARD
        }),
        saveAddedCard: () => ({
            method: anaConsts.LINK_TRACKING_EVENT,
            prop55: anaConsts.LinkData.SAVE_CARD_ADD,
            pageDetail: anaConsts.PAGE_DETAIL.ADD_CARD,
            previousPageDetail: anaConsts.PAGE_DETAIL.ADD_CARD
        }),
        deleteCard: () => ({
            method: anaConsts.LINK_TRACKING_EVENT,
            prop55: anaConsts.LinkData.DELETE_CARD,
            pageDetail: anaConsts.PAGE_DETAIL.EDIT_CARD,
            previousPageDetail: anaConsts.PAGE_DETAIL.EDIT_CARD
        }),
        removeCard: () => ({
            method: anaConsts.LINK_TRACKING_EVENT,
            prop55: anaConsts.LinkData.REMOVE_CARD,
            pageDetail: anaConsts.PAGE_DETAIL.UPDATE_PAYMENT,
            previousPageDetail: anaConsts.PAGE_DETAIL.UPDATE_PAYMENT
        }),
        loadMore: () => ({
            method: anaConsts.LINK_TRACKING_EVENT,
            prop55: anaConsts.LinkData.AUTO_REPLENISH_LOAD_MORE,
            pageDetail: anaConsts.PAGE_NAMES.MY_ACCOUNT,
            extraStringInfo: anaConsts.PAGE_TYPES.AUTO_REPLENISHMENT,
            pageTypeFromMethod: anaConsts.PAGE_TYPES.USER_PROFILE
        }),
        skip: ({ showSkipAutoReplenModal }) => ({
            method: showSkipAutoReplenModal ? anaConsts.ASYNC_PAGE_LOAD : anaConsts.LINK_TRACKING_EVENT,
            prop55: showSkipAutoReplenModal ? anaConsts.LinkData.SKIP_SUBSCRIPTION_OPEN : anaConsts.LinkData.SKIP_SUBSCRIPTION_CLOSE,
            pageDetail: anaConsts.PAGE_DETAIL.SKIP_SUBSCRIPTION,
            previousPageDetail: showSkipAutoReplenModal ? anaConsts.PAGE_DETAIL.MANAGE_SUBSCRIPTION : anaConsts.PAGE_DETAIL.SKIP_SUBSCRIPTION
        }),
        confirmSkip: () => ({
            method: anaConsts.ASYNC_PAGE_LOAD,
            pageDetail: anaConsts.PAGE_DETAIL.SKIP_SUBSCRIPTION_CONFIRM
        }),
        unavailableSkip: () => ({
            method: anaConsts.ASYNC_PAGE_LOAD,
            pageDetail: anaConsts.PAGE_DETAIL.SKIP_SUBSCRIPTION_UNAVAILABLE
        }),
        resumeSubscription: ({ showResumeSubscriptionModal }) => ({
            method: showResumeSubscriptionModal ? anaConsts.ASYNC_PAGE_LOAD : anaConsts.LINK_TRACKING_EVENT,
            prop55: showResumeSubscriptionModal ? anaConsts.LinkData.RESUME_SUBSCRIPTION_OPEN : anaConsts.LinkData.RESUME_SUBSCRIPTION_CLOSE,
            pageDetail: anaConsts.PAGE_DETAIL.RESUME_SUBSCRIPTION
        }),
        confirmResumeSubscription: () => ({
            method: anaConsts.ASYNC_PAGE_LOAD,
            pageDetail: anaConsts.PAGE_DETAIL.RESUME_SUBSCRIPTION_CONFIRM,
            subscriptionStatusFromModal: 'active'
        }),
        genericErrorPageLoad: () => ({
            method: anaConsts.ASYNC_PAGE_LOAD
        }),
        genericErrorTracking: () => ({
            method: anaConsts.LINK_TRACKING_EVENT
        })
    };

    fireAnalytics = (type, options = {}) => {
        const {
            method, prop55, pageDetail, subscriptionStatusFromModal, previousPageDetail, pageTypeFromMethod, extraStringInfo
        } =
            this.analyticsMap[type](this.state);
        const pageType = pageTypeFromMethod || anaConsts.PAGE_TYPES.AUTO_REPLENISH;
        const subscription = this.state.currentSubscription;
        const previousPageName = previousPageDetail && `${pageType}:${previousPageDetail}:n/a:*`;
        const isErrorModal = type === anaConsts.EVENT_NAMES.GENERIC_ERROR_PAGE_LOAD || type === anaConsts.EVENT_NAMES.GENERIC_ERROR_TRACKING;
        const errorPageName = isErrorModal && `${pageType} ${anaConsts.EVENT_NAMES.ERROR}:${options.modalTitle.toLowerCase()}:n/a:*`;

        let productStrings = '';

        if (Object.keys(subscription).length !== 0) {
            const item = subscription?.items[0];
            productStrings = anaUtils.buildSingleAutoReplenishProductString({
                ...item,
                price: formatSiteCatalystPrice(item?.price),
                replenishmentFreqType: subscription?.frequencyType.toLowerCase(),
                replenishmentFreqNum: subscription?.frequency,
                status: subscriptionStatusFromModal || subscription?.status.toLowerCase()
            });
        }

        processEvent.process(method, {
            data: {
                pageName: isErrorModal ? errorPageName : `${pageType}:${pageDetail}:n/a:*${extraStringInfo ? extraStringInfo : ''}`,
                pageDetail: isErrorModal ? options.modalTitle.toLowerCase() : pageDetail,
                productStrings,

                ...(method === anaConsts.LINK_TRACKING_EVENT && {
                    linkName: prop55,
                    actionInfo: prop55,
                    previousPage: previousPageName,
                    bindingMethods: isErrorModal && linkTrackingError,
                    fieldErrors: isErrorModal && [pageType],
                    errorMessages: isErrorModal && [options.errorMessage]
                }),

                ...(method === anaConsts.ASYNC_PAGE_LOAD && {
                    linkData: prop55,
                    previousPageName,
                    pageType
                })
            }
        });
    };

    handleOnUnsubscribe = subscriptionId => {
        this.props.manageUnsubscribe(this.state.currentSubscription);
        this.props.unsubscribeAutoReplenishment(subscriptionId, this.fireGenericErrorAnalytics);
        this.handleUnsubscribeConfirmation();
        this.toggleUnsubscribeAutoReplenModal();
        this.props.openConfirmUnsubscribeModal();
    };

    handleOnSkipSubscription = () => {
        this.props.skipConfirmation(this.state.currentSubscription);
        const { currentSubscription } = this.state;
        let afterTextMessage = '';
        const { basePromotion, acceleratedPromotion } = currentSubscription.currentSku;

        if (acceleratedPromotion && acceleratedPromotion.skippingLeadsToLossOfDiscount) {
            const baseDiscountAmount = Math.ceil(basePromotion?.discountAmount);
            afterTextMessage = ` ${stringUtils.format(this.props.rateOf, baseDiscountAmount)}`;
        }

        this.props.skipAutoReplenishment(
            currentSubscription,
            afterTextMessage,
            () =>
                this.setState(prevState => ({
                    showPauseAutoReplenModal: !prevState.showPauseAutoReplenModal
                })),
            () => this.toggleManageSubscriptionModal(false),
            this.fireAnalytics,
            this.fireGenericErrorAnalytics
        );
        this.handleCancelSkipAutoReplenModal(false);
    };

    handleOnGetItSooner = () => {
        const currentSubscription = this.state.currentSubscription;

        this.props.getItSoonerAutoReplenishment(
            currentSubscription,
            () => {
                this.setState(prevState => ({
                    showPauseAutoReplenModal: !prevState.showPauseAutoReplenModal
                }));
            },
            this.handleCloseGetItSooner,
            this.fireGetItSoonerConfirmationAnalytics,
            this.fireGetItSoonerUnavailableAnalytics,
            this.fireGenericErrorAnalytics
        );
    };

    handleOnPauseSubscription = () => {
        this.props.pauseConfirmation(this.state.currentSubscription);
        this.props.pauseAutoReplenishment(this.state.currentSubscription.subscriptionId, this.fireGenericErrorAnalytics);
        this.props.openConfirmPausedSubscriptionModal();
        this.fireAnalytics('pauseConfirmation');
        this.togglePauseAutoReplenModal(false);
        this.toggleManageSubscriptionModal(false);
    };

    handleResumeSubscription = () => {
        this.props.resumeModalConfirm(this.state.currentSubscription);
        this.props.resumeAutoReplenishment(this.state.currentSubscription.subscriptionId, this.fireGenericErrorAnalytics).then(() => {
            this.setState(prevState => ({
                showResumeSubscriptionModal: !prevState.showResumeSubscriptionModal,
                showConfirmResumeSubscriptionModal: !prevState.showConfirmResumeSubscriptionModal
            }));
        });
        this.fireAnalytics('confirmResumeSubscription');
    };

    toggleConfirmResumeModal = () => {
        this.setState(prevState => ({
            showConfirmResumeSubscriptionModal: !prevState.showConfirmResumeSubscriptionModal
        }));
    };

    handleManageSubscription = () => {
        this.toggleManageSubscriptionModal();
    };

    handleUpdatePaymentModal = () => {
        this.toggleUpdatePaymentModal();
    };

    fireGetItSoonerConfirmationAnalytics = () => {
        this.fireAnalytics('getItSoonerConfirmation');
    };

    fireGetItSoonerUnavailableAnalytics = () => {
        this.fireAnalytics('getItSoonerUnavailable');
    };

    fireGenericErrorAnalytics = (modalTitle, errorMessage) => {
        this.fireAnalytics('genericErrorPageLoad', { modalTitle, errorMessage });
        this.fireAnalytics('genericErrorTracking', { modalTitle, errorMessage });
    };

    fireFormErrorAnalytics = (modalTitle, errorMessage) => {
        this.fireAnalytics('genericErrorTracking', { modalTitle, errorMessage });
    };

    handleCurrentSubscriptionPaymentInfo = data => {
        const logoFileName = creditCardUtils.creditCardLogos.get(data.selectedCreditCard.cardType);
        const cardNumber = data.selectedCreditCard.cardNumber;
        this.setState({
            currentSubscription: {
                ...this.state.currentSubscription,
                paymentId: data.selectedCreditCardId
            },
            currentSubscriptionPaymentInfo: {
                logoFileName,
                cardType: data.selectedCreditCard.cardType,
                cardNumber: cardNumber.substr(cardNumber.length - 4),
                ...data
            }
        });
    };

    handleEditCard = (creditCard, allCreditCards, rawCreditCards) => {
        this.setState(
            {
                isEditMode: true,
                creditCardForEdit: creditCard,
                allCreditCards: allCreditCards,
                rawCreditCards: rawCreditCards
            },
            () => {
                this.toggleAddCardModal(true, 'editCard');
            }
        );
    };

    handleSkipNextDelivery = () => {
        this.setState(prevState => ({
            showSkipAutoReplenModal: !prevState.showSkipAutoReplenModal,
            showUnsubscribeAutoReplenModal: !prevState.showUnsubscribeAutoReplenModal,
            previousModal: 'showUnsubscribeAutoReplenModal'
        }));
    };

    handleRemove = (creditCard, creditCardList, analyticsKey) => {
        const { showAddCardModal } = this.state;
        const isCardDefaultForDelete = creditCard.isDefault;

        if (isCardDefaultForDelete && creditCardList[1]) {
            const creditCardToDefaultAndDelete = {
                creditCardForDefault: creditCardList[1].creditCardId,
                profileId: this.props.profileId,
                creditCardId: creditCard.creditCardId
            };

            this.props.setDefaultCCOnProfileAndDelete(creditCardToDefaultAndDelete).then(data => {
                if (data?.errorMessages?.length) {
                    errorsUtils.collectAndValidateBackEndErrors(data, this);
                } else {
                    this.setState(
                        {
                            isAddCard: false,
                            isEditMode: false
                        },
                        () => {
                            if (this.state.showUpdatePaymentModal) {
                                this.toggleUpdatePaymentModal(analyticsKey);
                            } else {
                                this.toggleAddCardModal(false, analyticsKey);
                            }
                        }
                    );
                }
            });
        } else {
            this.props.removeCreditCard(this.props.profileId, creditCard.creditCardId, this.fireGenericErrorAnalytics).then(data => {
                if (data?.errorMessages?.length) {
                    errorsUtils.collectAndValidateBackEndErrors(data, this);
                } else {
                    this.setState(
                        {
                            isAddCard: false,
                            isEditMode: false
                        },
                        () => {
                            if (showAddCardModal) {
                                this.toggleAddCardModal(false, analyticsKey);
                            } else {
                                this.toggleUpdatePaymentModal(analyticsKey);
                            }
                        }
                    );
                }
            });
        }
    };

    handleLoadMore = () => {
        this.props.loadMoreTracking();
        this.fireAnalytics('loadMore');
        this.props.loadSubscriptions();
    };

    handleLoadMoreActive = () => {
        this.props.updateActiveSubscriptions();
    };

    handleLoadMorePaused = () => {
        this.props.updatePausedSubscriptions();
    };

    handleLoadMoreCancelled = () => {
        this.props.updateCancelledSubscriptions();
    };

    handleCancelSkipAutoReplenModal = () => {
        this.setState({ showSkipAutoReplenModal: false });
    };

    renderViewShipmentsLink = alignment => {
        const { viewShipments } = this.props;

        return (
            <Flex>
                <Link
                    css={{
                        ...styles.link,
                        ...styles[alignment]
                    }}
                    href='/profile/MyAccount/Orders'
                    children={viewShipments}
                />
            </Flex>
        );
    };

    // eslint-disable-next-line complexity
    render() {
        const {
            loadSubscriptions,
            openFAQModal,
            isLoggedIn,
            displaySignIn,
            subscriptions,
            subscriptionList,
            hasNext,
            viewMore,
            viewMoreSubscriptions,
            needHelp,
            viewFAQ,
            deliveryFrequency,
            autoReplenishSummary,
            active,
            paused,
            cancelled,
            canceledSubscriptionsHeading,
            canceledSubscriptionsSubheading,
            headerItem,
            headerPrice,
            activeText,
            pausedText,
            canceledText,
            biPointsEarned,
            totalSaving,
            points,
            totalAggregateDiscount,
            biPoints,
            activeSubscriptionsCount,
            pausedSubscriptionsCount,
            canceledSubscriptionsCount,
            cmsData
        } = this.props;
        const {
            showUnsubscribeAutoReplenModal,
            showPauseAutoReplenModal,
            showSkipAutoReplenModal,
            showGetItSoonerAutoReplenModal,
            showManageSubscriptionModal,
            showModifySubscriptionErrorModal,
            showChangeDeliveryFrequencyModal,
            showUpdatePaymentModal,
            currentSubscription,
            currentSubscriptionPaymentInfo,
            showAddCardModal,
            isEditMode,
            creditCardForEdit,
            allCreditCards,
            rawCreditCards,
            showResumeSubscriptionModal,
            showConfirmResumeSubscriptionModal
        } = this.state;

        let activeSubscriptions;
        let pausedSubscriptions;
        let cancelledSubscriptions;
        let shouldShowSummary = active > 0 || paused > 0;

        const isSkipAvailable = !!Sephora.configurationSettings?.autoReplenishmentConfigurations?.enableReplenishmentOperations;
        const isAutoReplenishEmptyHubEnabled = !!Sephora.configurationSettings?.isAutoReplenishEmptyHubEnabled;

        if (isAutoReplenishEmptyHubEnabled) {
            activeSubscriptions = subscriptionList?.active?.subscriptions || [];
            pausedSubscriptions = subscriptionList?.paused?.subscriptions || [];
            cancelledSubscriptions = subscriptionList?.cancelled?.subscriptions || [];
            shouldShowSummary = active > 0 || paused > 0 || cancelled > 0;
        }

        return (
            <div>
                {isLoggedIn && (
                    <>
                        {shouldShowSummary && (
                            <Box css={styles.summaryContainer}>
                                <Grid css={styles.summaryContent}>
                                    <Box>
                                        <div>{autoReplenishSummary}</div>
                                        <div css={styles.summarySmallText}>
                                            {`${activeText} (${active})`}
                                            {
                                                <>
                                                    <span css={styles.separator}>|</span> {`${pausedText} (${paused})`}
                                                </>
                                            }
                                            {isAutoReplenishEmptyHubEnabled && (
                                                <>
                                                    <span css={styles.separator}>|</span> {`${canceledText} (${cancelled})`}
                                                </>
                                            )}
                                        </div>
                                    </Box>
                                    {!isAutoReplenishEmptyHubEnabled && this.renderViewShipmentsLink('vAlignMiddle')}
                                </Grid>
                                <Divider />
                                <Grid css={styles.summaryContent}>
                                    <Box>
                                        <div css={styles.summaryDetailed}>
                                            <Text
                                                is='p'
                                                css={styles.summaryDescription}
                                            >
                                                <Image
                                                    css={styles.icon}
                                                    height={25}
                                                    src='/img/ufe/icons/points.svg'
                                                />
                                                {biPointsEarned}
                                                <Text
                                                    is='span'
                                                    css={styles.summaryDescpriptionValue}
                                                >
                                                    <strong>{`${biPoints} ${points}`}</strong>
                                                </Text>
                                            </Text>
                                        </div>
                                        <div css={styles.summaryDetailed}>
                                            <Text
                                                is='p'
                                                css={styles.summaryDescription}
                                            >
                                                <Icon
                                                    css={styles.icon}
                                                    name='autoReplenish'
                                                />
                                                {totalSaving}
                                            </Text>
                                            <Text
                                                is='span'
                                                css={styles.summaryDescpriptionValue}
                                            >
                                                <strong>{totalAggregateDiscount}</strong>
                                            </Text>
                                        </div>
                                    </Box>
                                </Grid>
                                {isAutoReplenishEmptyHubEnabled && (
                                    <React.Fragment>
                                        <Divider />
                                        {this.renderViewShipmentsLink('hAlignLeft')}
                                    </React.Fragment>
                                )}
                            </Box>
                        )}
                        {isAutoReplenishEmptyHubEnabled && active > 0 && (
                            <section>
                                <Text
                                    css={styles.heading}
                                    is='h2'
                                >
                                    Active
                                </Text>
                                {activeSubscriptions.map(subscription =>
                                    subscription?.items?.map(item => (
                                        <AutoReplenishmentItem
                                            key={subscription.subscriptionId}
                                            subscription={subscription}
                                            item={item}
                                            firstName={this.props.firstName}
                                            toggleUnsubscribeAutoReplenModal={this.toggleUnsubscribeAutoReplenModal}
                                            toggleManageSubscriptionModal={this.toggleManageSubscriptionModal}
                                            toggleModifySubscriptionErrorModal={this.toggleModifySubscriptionErrorModal}
                                            setCurrentSubscription={this.setCurrentSubscription}
                                            toggleResumeSubscriptionModal={this.toggleResumeSubscriptionModal}
                                        />
                                    ))
                                )}
                                <Text css={styles.subscriptionsCountText}>
                                    {stringUtils.format(activeSubscriptionsCount, activeSubscriptions.length, active)}
                                </Text>
                                {subscriptionList?.active?.hasNext && (
                                    <Flex css={styles.viewMoreButtonContainer}>
                                        <Button
                                            variant='secondary'
                                            hasMinWidth={true}
                                            onClick={this.handleLoadMoreActive}
                                        >
                                            {viewMoreSubscriptions}
                                        </Button>
                                    </Flex>
                                )}
                            </section>
                        )}
                        {isAutoReplenishEmptyHubEnabled && paused > 0 && (
                            <section>
                                <Text
                                    css={styles.heading}
                                    is='h2'
                                >
                                    Paused
                                </Text>
                                {pausedSubscriptions.map(subscription =>
                                    subscription?.items?.map(item => (
                                        <AutoReplenishmentItem
                                            key={subscription.subscriptionId}
                                            subscription={subscription}
                                            item={item}
                                            firstName={this.props.firstName}
                                            toggleUnsubscribeAutoReplenModal={this.toggleUnsubscribeAutoReplenModal}
                                            toggleManageSubscriptionModal={this.toggleManageSubscriptionModal}
                                            toggleModifySubscriptionErrorModal={this.toggleModifySubscriptionErrorModal}
                                            setCurrentSubscription={this.setCurrentSubscription}
                                            toggleResumeSubscriptionModal={this.toggleResumeSubscriptionModal}
                                        />
                                    ))
                                )}
                                <Text css={styles.subscriptionsCountText}>
                                    {stringUtils.format(pausedSubscriptionsCount, pausedSubscriptions.length, paused)}
                                </Text>
                                {subscriptionList?.paused?.hasNext && (
                                    <Flex css={styles.viewMoreButtonContainer}>
                                        <Button
                                            variant='secondary'
                                            hasMinWidth={true}
                                            onClick={this.handleLoadMorePaused}
                                        >
                                            {viewMoreSubscriptions}
                                        </Button>
                                    </Flex>
                                )}
                            </section>
                        )}
                        {!isAutoReplenishEmptyHubEnabled &&
                            subscriptions.map(subscription =>
                                subscription?.items?.map(item => (
                                    <AutoReplenishmentItem
                                        key={subscription.subscriptionId}
                                        subscription={subscription}
                                        item={item}
                                        firstName={this.props.firstName}
                                        toggleUnsubscribeAutoReplenModal={this.toggleUnsubscribeAutoReplenModal}
                                        toggleManageSubscriptionModal={this.toggleManageSubscriptionModal}
                                        toggleModifySubscriptionErrorModal={this.toggleModifySubscriptionErrorModal}
                                        setCurrentSubscription={this.setCurrentSubscription}
                                        toggleResumeSubscriptionModal={this.toggleResumeSubscriptionModal}
                                    />
                                ))
                            )}
                        {hasNext && (
                            <Flex css={styles.buttonContainer}>
                                <Button
                                    variant='secondary'
                                    hasMinWidth={true}
                                    onClick={this.handleLoadMore}
                                >
                                    {viewMore}
                                </Button>
                            </Flex>
                        )}

                        {isAutoReplenishEmptyHubEnabled && cancelled > 0 && (
                            <section>
                                <Box>
                                    <Text
                                        css={styles.heading}
                                        is='h2'
                                    >
                                        {canceledSubscriptionsHeading}
                                    </Text>
                                    <Text css={styles.subheading}>{canceledSubscriptionsSubheading}</Text>
                                </Box>

                                <Divider css={styles.headerDivider} />
                                <Flex css={styles.cancelledList}>
                                    <Text>{headerItem}</Text>
                                    <Text css={styles.priceHeader}>{headerPrice}</Text>
                                </Flex>

                                {this.renderCancelledItems(cancelledSubscriptions)}
                                <Text css={styles.subscriptionsCountText}>
                                    {stringUtils.format(canceledSubscriptionsCount, cancelledSubscriptions.length, cancelled)}
                                </Text>
                                {subscriptionList?.cancelled?.hasNext && (
                                    <Flex css={styles.viewMoreButtonContainer}>
                                        <Button
                                            variant='secondary'
                                            hasMinWidth={true}
                                            onClick={this.handleLoadMoreCancelled}
                                        >
                                            {viewMoreSubscriptions}
                                        </Button>
                                    </Flex>
                                )}
                            </section>
                        )}

                        {isAutoReplenishEmptyHubEnabled && cmsData?.bottomContent && (
                            <ComponentList
                                items={cmsData.bottomContent}
                                context={CONTEXTS.CONTAINER}
                                customCardSize={CARD_SIZE_CONFIG}
                            />
                        )}

                        {showUnsubscribeAutoReplenModal && (
                            <UnsubscribeAutoReplenModal
                                isOpen={showUnsubscribeAutoReplenModal}
                                onDismiss={this.toggleUnsubscribeAutoReplenModal}
                                subscription={currentSubscription}
                                isSkipAvailable={isSkipAvailable}
                                onUnsubscribe={this.handleOnUnsubscribe}
                                onSkipNextDelivery={this.handleSkipNextDelivery}
                            />
                        )}
                        {showPauseAutoReplenModal && (
                            <PauseAutoReplenModal
                                isOpen={showPauseAutoReplenModal}
                                onDismiss={this.togglePauseAutoReplenModal}
                                handleOnPauseSubscription={this.handleOnPauseSubscription}
                                subscription={currentSubscription}
                            />
                        )}
                        {showSkipAutoReplenModal && (
                            <SkipAutoReplenModal
                                isOpen={showSkipAutoReplenModal}
                                onDismiss={this.toggleSkipAutoReplenModal}
                                handleOnSkipSubscription={this.handleOnSkipSubscription}
                                subscription={currentSubscription}
                            />
                        )}
                        {showGetItSoonerAutoReplenModal && (
                            <GetItSoonerAutoReplenModal
                                isOpen={showGetItSoonerAutoReplenModal}
                                onDismiss={this.toggleGetItSoonerAutoReplenModal}
                                handleOnGetItSooner={this.handleOnGetItSooner}
                                subscription={currentSubscription}
                            />
                        )}
                        {showManageSubscriptionModal && (
                            <ManageSubscriptionModal
                                title={deliveryFrequency}
                                currentProduct={currentSubscription.items[0]}
                                isOpen={showManageSubscriptionModal}
                                subscription={currentSubscription}
                                currentSubscriptionPaymentInfo={currentSubscriptionPaymentInfo}
                                handleManageSubscription={this.handleManageSubscription}
                                handleOnSkipSubscription={this.handleOnSkipSubscription}
                                toggleSkipAutoReplenModal={this.toggleSkipAutoReplenModal}
                                toggleGetItSoonerAutoReplenModal={this.toggleGetItSoonerAutoReplenModal}
                                togglePauseAutoReplenModal={this.togglePauseAutoReplenModal}
                                onDismiss={this.toggleManageSubscriptionModal}
                                isBasket={true}
                                replenishmentFreqNum={currentSubscription.frequency}
                                replenishmentFreqType={currentSubscription.frequencyType}
                                qty={currentSubscription.items[0].quantity}
                                updateFrequencyModal={({ quantity, currentProduct }) => {
                                    this.updateBasket(quantity, currentProduct);
                                    this.toggleChangeDeliveryFrequencyModal();
                                }}
                                toggleChangeDeliveryFrequencyModal={this.toggleChangeDeliveryFrequencyModal}
                                openUpdatePaymentModal={this.handleUpdatePaymentModal}
                                fireGenericErrorAnalytics={this.fireGenericErrorAnalytics}
                            />
                        )}
                        {showUpdatePaymentModal && (
                            <SubscriptionUpdatePaymentModal
                                isOpen={showUpdatePaymentModal}
                                subscriptionType={AUTO_REPLENISHMENT}
                                handleUpdatePaymentModal={this.handleUpdatePaymentModal}
                                updatePaymentSubscription={this.props.updateAutoReplenishmentSubscription}
                                onDismiss={this.toggleUpdatePaymentModal}
                                paymentId={currentSubscription.paymentId}
                                toggleChangeDeliveryFrequencyModal={this.toggleChangeDeliveryFrequencyModal}
                                currentSubscription={currentSubscription}
                                handleCurrentSubscriptionPaymentInfo={this.handleCurrentSubscriptionPaymentInfo}
                                handleAddCardModal={this.toggleAddCardModal}
                                handleEditCard={this.handleEditCard}
                                handleRemove={this.handleRemove}
                                fireGenericErrorAnalytics={this.fireGenericErrorAnalytics}
                            />
                        )}
                        {showAddCardModal && (
                            <AddPaymentMethodModal
                                isOpen={showAddCardModal}
                                onDismiss={this.toggleAddCardModal}
                                currentSubscription={currentSubscription}
                                isEditMode={isEditMode}
                                creditCardForEdit={isEditMode && creditCardForEdit}
                                handleRemove={this.handleRemove}
                                allCreditCards={allCreditCards}
                                rawCreditCards={rawCreditCards}
                                fireGenericErrorAnalytics={this.fireGenericErrorAnalytics}
                                fireFormErrorAnalytics={this.fireFormErrorAnalytics}
                                isSubscription={true}
                            />
                        )}
                        {showResumeSubscriptionModal && (
                            <ResumeSubscriptionModal
                                isOpen={showResumeSubscriptionModal}
                                onDismiss={this.toggleResumeSubscriptionModal}
                                toggleResumeSubscriptionModal={this.toggleResumeSubscriptionModal}
                                subscription={currentSubscription}
                                item={currentSubscription.items[0]}
                                handleResumeSubscription={this.handleResumeSubscription}
                            />
                        )}
                        {showConfirmResumeSubscriptionModal && (
                            <ConfirmResumeAutoReplenModal
                                isOpen={showConfirmResumeSubscriptionModal}
                                onDismiss={this.toggleConfirmResumeModal}
                                subscription={currentSubscription}
                                item={currentSubscription.items[0]}
                            />
                        )}
                        {showModifySubscriptionErrorModal && (
                            <ModifySubscriptionErrorModal
                                isOpen={showModifySubscriptionErrorModal}
                                onDismiss={this.toggleModifySubscriptionErrorModal}
                            />
                        )}
                        {showChangeDeliveryFrequencyModal && (
                            <DeliveryFrequencyModal
                                isOpen={showChangeDeliveryFrequencyModal}
                                onDismiss={this.toggleChangeDeliveryFrequencyModal}
                                title={deliveryFrequency}
                                isBasket={false}
                                isManageSubscription={true}
                                currentProduct={currentSubscription}
                                quantity={currentSubscription.items[0].qty}
                                replenishmentFreqNum={currentSubscription.frequency}
                                replenishmentFreqType={currentSubscription.frequencyType}
                                updateSubscriptionModal={this.props.updateAutoReplenishmentSubscription}
                                toggleChangeDeliveryFrequencyModal={this.toggleChangeDeliveryFrequencyModal}
                                toggleManageSubscriptionModal={this.toggleManageSubscriptionModal}
                                fireGenericErrorAnalytics={this.fireGenericErrorAnalytics}
                            />
                        )}
                        <Flex css={styles.buttonContainer}>
                            <Text is='p'>
                                {`${needHelp} `}
                                <Link
                                    css={styles.link}
                                    onClick={() => renderModal(this.props.globalModals[AUTO_REPLENISH_FAQS], openFAQModal)}
                                    children={viewFAQ}
                                />
                            </Text>
                        </Flex>
                    </>
                )}
                {displaySignIn && <PleaseSignInBlock afterAuth={loadSubscriptions} />}
            </div>
        );
    }
}

const styles = {
    heading: {
        display: 'inline-block',
        verticalAlign: 'middle',
        paddingTop: `${space[2]}px`,
        marginTop: `${space[5]}px`,
        fontSize: `${fontSizes.md}px`,
        fontWeight: `${fontWeights.bold}`,
        maxWidth: '85%',
        lineHeight: `${lineHeights.tight}em`
    },
    subheading: {
        fontWeight: `${fontWeights.normal}`,
        display: 'block',
        whiteSpace: 'nowrap'
    },
    headerDivider: {
        margin: `${space[3]}px ${space[4]}px 0 0`,
        [mediaQueries.smMax]: { display: 'none' }
    },
    cancelledList: {
        fontSize: `${fontSizes['base']}`,
        fontWeight: `${fontWeights.bold}`,
        paddingTop: `${space[3]}px`,
        display: 'grid',
        gridTemplateColumns: `min(${space[9]}px) min(280px) max(70px) 1fr max(${space[6]}px)`,
        textAlign: 'center',
        alignItems: 'center',
        [mediaQueries.smMax]: { display: 'none' }
    },
    priceHeader: {
        gridColumn: 3
    },
    buttonContainer: {
        marginTop: `${space[6]}`,
        justifyContent: 'center'
    },
    viewMoreButtonContainer: {
        marginTop: `${space[3]}`,
        justifyContent: 'center'
    },
    link: {
        color: `${colors.blue}`
    },
    vAlignMiddle: {
        margin: 'auto'
    },
    hAlignLeft: {
        margin: `${space[3]}px 0`
    },
    separator: {
        margin: `0 ${space[2]}px`,
        color: `${colors.midGray}`
    },
    subscriptionsCountText: {
        display: 'table',
        margin: `${space[3]}px auto 0`
    },
    summaryContainer: {
        backgroundColor: `${colors.nearWhite}`,
        padding: `${space[1]}px ${space[4]}px 0 ${space[4]}px`,
        marginTop: `${space[4]}px`,
        borderRadius: `${space[1]}px`
    },
    summaryContent: {
        gap: `${space[2]}px`,
        gridTemplateColumns: '1fr auto',
        padding: `${space[3]}px 0`
    },
    summarySmallText: {
        fontSize: `${fontSizes['sm']}`
    },
    summaryDetailed: {
        fontSize: `${fontSizes['sm']}`,
        padding: `${space[2]}px 0`,
        position: 'relative'
    },
    summaryDescription: {
        maxWidth: '80%'
    },
    summaryDescpriptionValue: {
        right: 0,
        position: 'absolute',
        top: `${space[3]}px`
    },
    alignRight: {
        textAlign: 'right'
    },
    icon: {
        verticalAlign: 'middle',
        marginRight: `${space[3]}`,
        size: '2.25em'
    }
};

AutoReplenishment.propTypes = {
    viewMore: PropTypes.string.isRequired,
    needHelp: PropTypes.string.isRequired,
    viewFAQ: PropTypes.string.isRequired,
    deliveryFrequency: PropTypes.string.isRequired,
    autoReplenishSummary: PropTypes.string.isRequired,
    activeText: PropTypes.string.isRequired,
    pausedText: PropTypes.string.isRequired,
    canceledText: PropTypes.string.isRequired,
    viewShipments: PropTypes.string.isRequired,
    biPointsEarned: PropTypes.string.isRequired,
    totalSaving: PropTypes.string.isRequired,
    points: PropTypes.string.isRequired,
    hasNext: PropTypes.bool,
    active: PropTypes.number,
    paused: PropTypes.number,
    cancelled: PropTypes.number,
    subscriptions: PropTypes.array,
    totalAggregateDiscount: PropTypes.string,
    firstName: PropTypes.string.isRequired,
    profileId: PropTypes.string.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    displaySignIn: PropTypes.bool.isRequired,
    biPoints: PropTypes.number.isRequired,
    loadSubscriptions: PropTypes.func.isRequired,
    openFAQModal: PropTypes.func.isRequired,
    unsubscribeAutoReplenishment: PropTypes.func.isRequired,
    pauseAutoReplenishment: PropTypes.func.isRequired,
    openConfirmUnsubscribeModal: PropTypes.func.isRequired,
    openConfirmPausedSubscriptionModal: PropTypes.func.isRequired,
    updateAutoReplenishmentSubscription: PropTypes.func.isRequired,
    setDefaultCCOnProfileAndDelete: PropTypes.func.isRequired,
    resumeAutoReplenishment: PropTypes.func.isRequired
};

AutoReplenishment.defaultProps = {
    cmsData: Empty.Object,
    active: 0,
    paused: 0,
    cancelled: 0
};

export default wrapComponent(AutoReplenishment, 'AutoReplenishment', true);
