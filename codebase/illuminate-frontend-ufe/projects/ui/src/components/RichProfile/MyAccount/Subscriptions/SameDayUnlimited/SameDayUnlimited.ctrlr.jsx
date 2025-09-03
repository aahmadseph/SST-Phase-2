/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import urlUtils from 'utils/Url';
import errorsUtils from 'utils/Errors';
import RCPSCookies from 'utils/RCPSCookies';
import OrderUtils from 'utils/Order';
import creditCardUtils from 'utils/CreditCard';
import mediaUtils from 'utils/Media';
import PropTypes from 'prop-types';
import PaymentLogo from 'components/Checkout/PaymentLogo/PaymentLogo';
import BaseClass from 'components/BaseClass';
import AccountLayout from 'components/RichProfile/MyAccount/AccountLayout/AccountLayout';
import FeesAndFAQ from 'components/ProductPage/Type/DigitalProduct/SameDayUnlimitedLandingPage/FeesAndFAQ';
import AddPaymentMethodModal from 'components/GlobalModals/AddPaymentMethodModal';
import SubscriptionUpdatePaymentModal from 'components/GlobalModals/SubscriptionUpdatePaymentModal';
import Chevron from 'components/Chevron';
import BccComponentList from 'components/Bcc/BccComponentList/BccComponentList';
import PleaseSignInBlock from 'components/RichProfile/MyAccount/PleaseSignIn';
import ComponentList from 'components/Content/ComponentList';
import getModal from 'services/api/cms/getModal';
import { globalModals } from 'utils/globalModals';
import {
    space, fontSizes, colors, mediaQueries, lineHeights
} from 'style/config';
import {
    Image, Text, Grid, Box, Link, Flex
} from 'components/ui';
import SubscriptionTypes from 'constants/SubscriptionTypes';
import contentConstants from 'constants/content';

import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';

const {
    SUBSCRIPTION_TYPES: { SAME_DAY_UNLIMITED }
} = SubscriptionTypes;
const { SDU_ACCOUNT_PAGE_CONTENT } = globalModals;
const { Media } = mediaUtils;
const { CONTEXTS } = contentConstants;

class SameDayUnlimited extends BaseClass {
    state = {
        isHidden: true,
        currentSubscriptionPaymentInfo: {},
        showUpdatePaymentModal: false,
        showAddCardModal: false,
        showNotModifiableModal: false,
        allCreditCards: null,
        rawCreditCards: null,
        isEditMode: false,
        creditCardForEdit: null,
        currentSubscription: {},
        contentfulData: []
    };

    componentDidMount() {
        const { loadBCCContent, loadSDUSubscription, mediaId } = this.props;
        loadSDUSubscription();
        const { sid } = this.props.globalModals[SDU_ACCOUNT_PAGE_CONTENT] || {};

        if (sid) {
            const { country, channel, language } = Sephora.renderQueryParams;
            getModal({ country, language, channel, sid }).then(data => {
                this.setState({
                    contentfulData: data?.data?.items
                });
            });
        } else {
            loadBCCContent(mediaId);
        }

        if (Sephora.configurationSettings.isChasePaymentEnabled) {
            creditCardUtils.loadChaseTokenizer();
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.user?.beautyInsiderAccount?.biAccountId !== this.props.user?.beautyInsiderAccount?.biAccountId) {
            this.props.loadSDUSubscription();
        }

        if (prevProps.SDUSubscription !== this.props.SDUSubscription) {
            const { profileId, paymentId } = this.props.SDUSubscription;
            const { isUserSDUActive, isMemberInactive } = this.props;

            if ((isUserSDUActive || isMemberInactive) && profileId) {
                if (isMemberInactive) {
                    this.setState({
                        isHidden: false,
                        currentSubscription: this.props.SDUSubscription
                    });
                } else {
                    this.props.loadShippingAndPaymentInfo(profileId, null, paymentId, null, null, false).then(() => {
                        const logoFileName = creditCardUtils.creditCardLogos.get(this.props.creditCardName);
                        const cardNumber = this.props.creditCardToken;

                        this.setState({
                            isHidden: false,
                            currentSubscription: this.props.SDUSubscription,
                            currentSubscriptionPaymentInfo: {
                                logoFileName,
                                cardType: this.props.creditCardName,
                                cardNumber: cardNumber.substr(cardNumber.length - 4)
                            }
                        });
                    });
                }
            } else {
                this.setState({
                    isHidden: true
                });
            }

            if (!isUserSDUActive && !isMemberInactive) {
                urlUtils.redirectTo(this.props.SDUUrl);
            }
        }

        if (RCPSCookies.isRCPSFullProfileGroup() && !this.props.displaySignIn && this.props.displaySignIn !== prevProps.displaySignIn) {
            this.props.loadSDUSubscription();
        }
    }

    analyticsMap = {
        updatePayment: ({ showUpdatePaymentModal }) => ({
            prop55: showUpdatePaymentModal ? anaConsts.LinkData.SDU_UPDATE_PAYMENT_OPEN : anaConsts.LinkData.SDU_UPDATE_PAYMENT_CLOSE,
            pageDetail: showUpdatePaymentModal ? anaConsts.PAGE_DETAIL.UPDATE_PAYMENT : anaConsts.PAGE_NAMES.MY_ACCOUNT,
            pageTypeProp: showUpdatePaymentModal ? anaConsts.PAGE_TYPES.SAME_DAY_UNLIMITED : anaConsts.PAGE_TYPES.USER_PROFILE,
            context: showUpdatePaymentModal ? '' : anaConsts.CONTEXT.SAME_DAY_UNLIMITED,
            method: showUpdatePaymentModal ? anaConsts.ASYNC_PAGE_LOAD : anaConsts.LINK_TRACKING_EVENT
        }),
        closeUpdatePayment: ({ closeUpdatePaymentModal }) => ({
            prop55: closeUpdatePaymentModal ? anaConsts.LinkData.SDU_UPDATE_PAYMENT_OPEN : anaConsts.LinkData.SDU_UPDATE_PAYMENT_CLOSE,
            pageDetail: anaConsts.PAGE_NAMES.MY_ACCOUNT,
            context: anaConsts.CONTEXT.SAME_DAY_UNLIMITED,
            pageTypeProp: anaConsts.PAGE_TYPES.USER_PROFILE,
            method: anaConsts.LINK_TRACKING_EVENT
        }),
        addCard: ({ showAddCardModal }) => ({
            prop55: showAddCardModal ? anaConsts.LinkData.SDU_ADD_CARD_OPEN : anaConsts.LinkData.SDU_ADD_CARD_CLOSE,
            pageDetail: showAddCardModal ? anaConsts.PAGE_DETAIL.ADD_CARD : anaConsts.PAGE_DETAIL.UPDATE_PAYMENT,
            method: showAddCardModal ? anaConsts.ASYNC_PAGE_LOAD : anaConsts.LINK_TRACKING_EVENT,
            previousPageDetail: showAddCardModal ? anaConsts.PAGE_DETAIL.UPDATE_PAYMENT : anaConsts.PAGE_DETAIL.ADD_CARD
        }),
        editCard: ({ isEditMode }) => ({
            prop55: isEditMode ? anaConsts.LinkData.SDU_EDIT_CARD_OPEN : anaConsts.LinkData.SDU_EDIT_CARD_CLOSE,
            pageDetail: isEditMode ? anaConsts.PAGE_DETAIL.EDIT_CARD : anaConsts.PAGE_DETAIL.UPDATE_PAYMENT,
            method: isEditMode ? anaConsts.ASYNC_PAGE_LOAD : anaConsts.LINK_TRACKING_EVENT,
            previousPageDetail: isEditMode ? anaConsts.PAGE_DETAIL.UPDATE_PAYMENT : anaConsts.PAGE_DETAIL.EDIT_CARD
        }),
        removeCard: () => ({
            prop55: anaConsts.LinkData.SDU_REMOVE_CARD,
            pageDetail: anaConsts.PAGE_DETAIL.UPDATE_PAYMENT,
            method: anaConsts.LINK_TRACKING_EVENT,
            previousPageDetail: anaConsts.PAGE_DETAIL.UPDATE_PAYMENT
        }),
        deleteCard: () => ({
            prop55: anaConsts.LinkData.SDU_DELETE_CARD,
            pageDetail: anaConsts.PAGE_DETAIL.EDIT_CARD,
            method: anaConsts.LINK_TRACKING_EVENT,
            previousPageDetail: anaConsts.PAGE_DETAIL.UPDATE_PAYMENT
        }),
        saveUpdateMethod: () => ({
            prop55: anaConsts.LinkData.SDU_SAVE_CARD_UPDATE,
            pageDetail: anaConsts.PAGE_DETAIL.UPDATE_PAYMENT,
            method: anaConsts.LINK_TRACKING_EVENT,
            previousPageDetail: anaConsts.PAGE_DETAIL.UPDATE_PAYMENT
        }),
        saveEditedCard: () => ({
            prop55: anaConsts.LinkData.SDU_SAVE_CARD_EDIT,
            pageDetail: anaConsts.PAGE_DETAIL.EDIT_CARD,
            method: anaConsts.LINK_TRACKING_EVENT,
            previousPageDetail: anaConsts.PAGE_DETAIL.EDIT_CARD
        }),
        saveAddedCard: () => ({
            prop55: anaConsts.LinkData.SDU_SAVE_CARD_ADD,
            pageDetail: anaConsts.PAGE_DETAIL.ADD_CARD,
            method: anaConsts.LINK_TRACKING_EVENT,
            previousPageDetail: anaConsts.PAGE_DETAIL.ADD_CARD
        }),
        cancelSubscriptionOpen: (_state, { isTrialMember }) => ({
            prop55: isTrialMember ? anaConsts.LinkData.SDU_CANCEL_TRIAL_OPEN : anaConsts.LinkData.SDU_CANCEL_SUBSCRIPTION_OPEN,
            pageDetail: isTrialMember ? anaConsts.PAGE_DETAIL.CANCEL_TRIAL : anaConsts.PAGE_DETAIL.CANCEL_SUBSCRIPTION,
            method: anaConsts.LINK_TRACKING_EVENT
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
            prop55, pageDetail, pageTypeProp, context = '', method, previousPageDetail
        } = this.analyticsMap[type](this.state, this.props);
        const pageType = pageTypeProp ? pageTypeProp : anaConsts.PAGE_TYPES.SAME_DAY_UNLIMITED;
        const isErrorModal = type === anaConsts.EVENT_NAMES.GENERIC_ERROR_PAGE_LOAD || type === anaConsts.EVENT_NAMES.GENERIC_ERROR_TRACKING;
        const errorPageName = isErrorModal && `${pageType} ${anaConsts.EVENT_NAMES.ERROR}:${options.modalTitle.toLowerCase()}:n/a:*`;
        const previousPageName = previousPageDetail && `${pageType}:${previousPageDetail}:n/a:*`;
        processEvent.process(method, {
            data: {
                pageName: isErrorModal ? errorPageName : `${pageType}:${pageDetail}:n/a:*${context}`,
                pageDetail,

                ...(method === anaConsts.ASYNC_PAGE_LOAD && {
                    linkData: prop55,
                    previousPageName,
                    pageType
                }),

                ...(method === anaConsts.LINK_TRACKING_EVENT && {
                    linkName: prop55,
                    actionInfo: prop55,
                    previousPage: previousPageName,
                    previousPageName
                })
            }
        });
    };

    fireFormErrorAnalytics = (modalTitle, errorMessage) => {
        this.fireAnalytics('genericErrorTracking', { modalTitle, errorMessage });
    };

    fireGenericErrorAnalytics = (modalTitle, errorMessage) => {
        this.fireAnalytics('genericErrorPageLoad', { modalTitle, errorMessage });
        this.fireAnalytics('genericErrorTracking', { modalTitle, errorMessage });
    };

    toggleUpdatePaymentModal = (analyticsKey = 'updatePayment') => {
        const { displayGenericErrorModalAction, isModifiable } = this.props;

        if (isModifiable) {
            this.setState(
                {
                    showUpdatePaymentModal: !this.state.showUpdatePaymentModal
                },
                () => {
                    this.fireAnalytics(analyticsKey);

                    if (!this.state.showUpdatePaymentModal) {
                        digitalData.page.attributes.previousPageData.pageName = `${anaConsts.PAGE_NAMES.SAME_DAY_UNLIMITED}:${anaConsts.PAGE_DETAIL.UPDATE_PAYMENT}:n/a:*`;
                    }
                }
            );
        } else {
            displayGenericErrorModalAction();
        }
    };

    toggleAddCardModal = (isEditMode = false, analyticsKey = 'addCard') => {
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
                const pageName = this.state.showAddCardModal
                    ? anaConsts.PAGE_DETAIL.UPDATE_PAYMENT
                    : isEditMode
                        ? anaConsts.PAGE_DETAIL.EDIT_CARD
                        : anaConsts.PAGE_DETAIL.ADD_CARD;

                digitalData.page.attributes.previousPageData.pageName = `${anaConsts.PAGE_NAMES.SAME_DAY_UNLIMITED}:${pageName}:n/a:*`;
            }
        );
    };

    handleEditClick = () => {
        this.toggleUpdatePaymentModal();
    };

    handleRemove = (creditCard, creditCardList, analyticsKey) => {
        const { showAddCardModal, currentSubscription } = this.state;
        const isCardDefaultForDelete = creditCard.isDefault;

        if (isCardDefaultForDelete && creditCardList[1]) {
            const creditCardToDefaultAndDelete = {
                creditCardForDefault: creditCardList[1].creditCardId,
                profileId: currentSubscription.profileId,
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
            this.props.removeCreditCard(this.state.currentSubscription.profileId, creditCard.creditCardId).then(data => {
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

    render() {
        const {
            sameDayUnlimited,
            memberSinceText,
            cancelSubscription,
            paymentMethod,
            edit,
            sduLogo,
            displaySignIn,
            SDUSubscription,
            loadSDUSubscription,
            isLoggedIn,
            SDUPriceText,
            sduSavings,
            renewDate,
            renewsText,
            bccComps,
            membershipPerks,
            isMemberInactive,
            isTrialMember,
            cancelSubscriptionAction,
            isModifiable,
            enableReplenishmentPaymentModifiable,
            displayGenericErrorModalAction
        } = this.props;

        const {
            showUpdatePaymentModal,
            showAddCardModal,
            isEditMode,
            creditCardForEdit,
            allCreditCards,
            rawCreditCards,
            isHidden,
            currentSubscription,
            currentSubscriptionPaymentInfo,
            contentfulData
        } = this.state;

        const { paymentId } = currentSubscription;

        const handleCancelCLick = () => {
            if (isModifiable) {
                cancelSubscriptionAction(isTrialMember, sduSavings, renewDate, SDUSubscription.subscriptionId);
                this.fireAnalytics('cancelSubscriptionOpen');
            } else {
                displayGenericErrorModalAction();
            }
        };

        return (
            <AccountLayout
                section='account'
                title='Sephora Subscription'
                page='sameDayUnlimited'
            >
                {!isHidden && (
                    <>
                        {displaySignIn && <PleaseSignInBlock afterAuth={loadSDUSubscription} />}
                        {isLoggedIn && (
                            <div>
                                <Flex css={styles.tabContainer}>
                                    <Image
                                        disableLazyLoad={true}
                                        alt={sameDayUnlimited}
                                        src={sduLogo}
                                        width={42}
                                        height={54}
                                    />
                                    <Box css={styles.headerWrapper}>
                                        <Text
                                            css={{ ...styles.header, ...styles.boldText }}
                                            children={sameDayUnlimited}
                                        />
                                        <Text
                                            css={styles.subHeader}
                                            children={memberSinceText}
                                        />
                                    </Box>
                                </Flex>
                                <Box css={styles.subscriptionContainer}>
                                    <div>
                                        <Grid css={{ ...styles.rows, ...styles.firstRow }}>
                                            <div>
                                                <strong>{SDUPriceText}</strong>
                                                <Media lessThan='sm'>
                                                    <div css={styles.renewText}>{renewsText}</div>
                                                </Media>
                                            </div>
                                            <Media greaterThan='xs'>
                                                <div css={styles.renewText}>{renewsText}</div>
                                            </Media>
                                            {!isMemberInactive && (
                                                <div css={styles.verticalCenter}>
                                                    <Link
                                                        onClick={handleCancelCLick}
                                                        color={'blue'}
                                                        children={cancelSubscription}
                                                    />
                                                </div>
                                            )}
                                        </Grid>
                                    </div>
                                    {!isMemberInactive && (
                                        <div>
                                            <Grid css={isMemberInactive ? styles.secondRow : { ...styles.rows, ...styles.secondRow }}>
                                                <div css={styles.verticalCenter}>
                                                    <strong>{paymentMethod}</strong>
                                                </div>
                                                <div css={styles.payment}>
                                                    <PaymentLogo
                                                        width={42}
                                                        height={'auto'}
                                                        cardType={OrderUtils.getThirdPartyCreditCard(currentSubscriptionPaymentInfo)}
                                                        paymentGroupType={OrderUtils.PAYMENT_GROUP_TYPE.CREDIT_CARD}
                                                        listenToStore={false}
                                                    />
                                                    <Text
                                                        is='p'
                                                        css={styles.paymentMethod}
                                                    >
                                                        {`${currentSubscriptionPaymentInfo.cardType || ''} *${
                                                            currentSubscriptionPaymentInfo.cardNumber
                                                        }`}
                                                    </Text>
                                                </div>
                                                {enableReplenishmentPaymentModifiable && (
                                                    <div css={styles.verticalCenter}>
                                                        <Media greaterThan='xs'>
                                                            <Link
                                                                onClick={this.handleEditClick}
                                                                color={'blue'}
                                                                children={edit}
                                                            />
                                                        </Media>
                                                        <Media lessThan='sm'>
                                                            <Link onClick={this.handleEditClick}>
                                                                <Chevron direction='right' />
                                                            </Link>
                                                        </Media>
                                                    </div>
                                                )}
                                            </Grid>
                                        </div>
                                    )}
                                </Box>
                                <Text
                                    is='p'
                                    css={styles.perks}
                                    children={membershipPerks}
                                />
                                {contentfulData?.length ? (
                                    <ComponentList
                                        items={contentfulData}
                                        context={CONTEXTS.MODAL}
                                        removeFirstItemMargin={true}
                                        removeLastItemMargin={true}
                                    />
                                ) : (
                                    <BccComponentList
                                        context='modal'
                                        items={bccComps}
                                    />
                                )}

                                <Media lessThan='md'>
                                    <FeesAndFAQ
                                        hideAsteriscSection={true}
                                        openInModal={true}
                                    />
                                </Media>
                                <Media greaterThan='sm'>
                                    <FeesAndFAQ
                                        hideAsteriscSection={true}
                                        openInModal={true}
                                        alignLeft={true}
                                    />
                                </Media>
                            </div>
                        )}
                        {showUpdatePaymentModal && (
                            <SubscriptionUpdatePaymentModal
                                isOpen={showUpdatePaymentModal}
                                subscriptionType={SAME_DAY_UNLIMITED}
                                handleUpdatePaymentModal={this.handleUpdatePaymentModal}
                                updatePaymentSubscription={this.props.updateAutoReplenishmentSubscription}
                                onDismiss={this.toggleUpdatePaymentModal}
                                paymentId={paymentId}
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
                                subscriptionType={SAME_DAY_UNLIMITED}
                                currentSubscription={currentSubscription}
                                onDismiss={this.toggleAddCardModal}
                                isEditMode={isEditMode}
                                creditCardForEdit={isEditMode && creditCardForEdit}
                                handleRemove={this.handleRemove}
                                allCreditCards={allCreditCards}
                                rawCreditCards={rawCreditCards}
                                fireFormErrorAnalytics={this.fireFormErrorAnalytics}
                                fireGenericErrorAnalytics={this.fireGenericErrorAnalytics}
                                isSubscription={true}
                            />
                        )}
                    </>
                )}
                {isHidden && (
                    <>
                        <Media lessThan='md'>
                            <FeesAndFAQ
                                hideAsteriscSection={true}
                                openInModal={true}
                            />
                        </Media>
                        <Media greaterThan='sm'>
                            <FeesAndFAQ
                                hideAsteriscSection={true}
                                openInModal={true}
                                alignLeft={true}
                            />
                        </Media>
                    </>
                )}
            </AccountLayout>
        );
    }
}

const styles = {
    tabContainer: {
        alignItems: 'center',
        padding: `${space[4]}px 0`
    },
    subHeader: {
        lineHeight: `${lineHeights.tight}`,
        whiteSpace: 'normal',
        wordWrap: 'normal'
    },
    headerWrapper: {
        marginLeft: `${space[3]}px`
    },
    header: {
        lineHeight: `${lineHeights.none}`,
        fontSize: `${fontSizes.lg}px`,
        display: 'block',
        marginTop: '0'
    },
    boldText: {
        fontWeight: 'bold'
    },
    subscriptionContainer: {
        borderRadius: `${space[1]}px`,
        boxShadow: '0px 0px 6px rgba(0, 0, 0, 0.2)',
        marginBottom: `${space[5]}px`
    },
    secondRow: {
        borderTop: `1px solid ${colors.nearWhite}`,
        gridTemplateColumns: '30% 1fr auto',
        padding: `${space[4]}px ${space[4]}px ${space[5]}px ${space[4]}px`
    },
    payment: {
        display: 'flex',
        alignItems: 'center'
    },
    paymentMethod: {
        marginLeft: `${space[3]}px`
    },
    rows: {
        gridTemplateColumns: '1fr auto',
        [mediaQueries.sm]: {
            gridTemplateColumns: '23% 1fr auto'
        },
        padding: `${space[4]}px`
    },
    firstRow: {
        padding: `${space[5]}px ${space[4]}px ${space[3]}px ${space[4]}px`
    },
    verticalCenter: {
        display: 'flex',
        alignItems: 'center'
    },
    renewText: {
        color: `${colors.gray}`
    },
    perks: {
        fontWeight: 'bold'
    },
    faq: {
        paddingTop: `${space[3]}`
    },
    blueLink: {
        color: `${colors.blue}`,
        display: 'block',
        fontSize: `${fontSizes.sm}`,
        flexBasis: '100%',
        fontWeight: 'normal'
    }
};

SameDayUnlimited.propTypes = {
    sameDayUnlimited: PropTypes.string.isRequired,
    cancelSubscription: PropTypes.string.isRequired,
    paymentMethod: PropTypes.string.isRequired,
    edit: PropTypes.string.isRequired,
    membershipPerks: PropTypes.string.isRequired,
    memberSinceText: PropTypes.string.isRequired,
    sduLogo: PropTypes.string.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    displaySignIn: PropTypes.bool.isRequired,
    SDUSubscription: PropTypes.shape({}),
    isUserSDUActive: PropTypes.bool.isRequired,
    isMemberInactive: PropTypes.bool.isRequired,
    isTrialMember: PropTypes.bool.isRequired,
    SDUUrl: PropTypes.string.isRequired,
    SDUPriceText: PropTypes.string.isRequired,
    sduSavings: PropTypes.string.isRequired,
    renewDate: PropTypes.string.isRequired,
    renewsText: PropTypes.string.isRequired,
    creditCardName: PropTypes.string,
    creditCardToken: PropTypes.string,
    isModifiable: PropTypes.bool,
    enableReplenishmentPaymentModifiable: PropTypes.bool,
    bccComps: PropTypes.array,
    mediaId: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired
};

export default wrapComponent(SameDayUnlimited, 'SameDayUnlimited', true);
