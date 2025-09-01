import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import {
    Box, Flex, Text, Grid, Button, Icon, Link
} from 'components/ui';
import TextInput from 'components/Inputs/TextInput/TextInput';
import { colors } from 'style/config';
import Chiclet from 'components/Chiclet';
import BasketUtils from 'utils/Basket';
import promoUtils from 'utils/Promos';
import ReCaptcha from 'components/ReCaptcha/ReCaptcha';
import chekoutUtils from 'utils/Checkout';
import ErrorsUtils from 'utils/Errors';
import Location from 'utils/Location';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import orderUtils from 'utils/Order';
import localeUtils from 'utils/LanguageLocale';
import { DebouncedResize } from 'constants/events';
import Empty from 'constants/empty';

const {
    MESSAGE_CONTEXT: { PROMO_MESSAGES, RRC_REMAINING_BALANCE }
} = chekoutUtils;
const { hasHalAddress } = orderUtils;
const getText = localeUtils.getLocaleResourceFile('components/RwdBasket/RwdBasketLayout/BIBenefits/FeaturedOffers/locales', 'FeaturedOffers');

const isAllSkuPromoAreGlobal = basketPromosList => {
    let allSkuPromoAreGlobal = !!basketPromosList.length;
    basketPromosList.forEach(skuPromo => {
        if (!skuPromo.isGlobalPromotion) {
            allSkuPromoAreGlobal = false;
        }
    });

    return allSkuPromoAreGlobal;
};

class FeaturedOffers extends BaseClass {
    state = {
        basketPromosList: [],
        errorMessage: null,
        errorCode: null,
        warningMessage: null,
        hasError: false,
        isAllPromoCodesModalOpen: false,
        RrcAppliedManually: false,
        isErrorHidden: false,
        gridWidth: null,
        canCollapsePromoField: true
    };

    promoInput = null;
    reCaptcha = null;
    containerRef = null;

    calculateGridWidth = () => {
        this.setState({ gridWidth: this.containerRef?.clientWidth });
    };

    componentDidMount() {
        window.addEventListener(DebouncedResize, this.calculateGridWidth);
        this.handleBasketChange();
        this.handlePromotionChange();
        this.handleError();
        this.setState({ isMounted: true, gridWidth: this.containerRef?.clientWidth });
    }

    componentDidUpdate(prevProps) {
        if (this.props.error !== prevProps.error) {
            this.handleError();
        }

        if (this.props.promotion !== prevProps.promotion) {
            this.handlePromotionChange();
        }

        if (this.props.basket !== prevProps.basket || this.props.bopisFeaturedOffers !== prevProps.bopisFeaturedOffers) {
            this.handleBasketChange();
        }
    }

    hideError = hideError => {
        this.setState({ isErrorHidden: hideError });
    };

    checkPromoType = appliedPromos => {
        const isCBRPromo = appliedPromos.find(promo => promo.promotionType === promoUtils.PROMO_TYPES.CBR);

        return isCBRPromo ? promoUtils.PROMO_TYPES.CBR : promoUtils.PROMO_TYPES.PROMO;
    };

    handlePromotionChange = () => {
        if (Location.isCheckout()) {
            const promoType = this.checkPromoType(this.props.promotion.appliedPromotions);
            this.setPromos(promoUtils.getAppliedPromotions(promoType, this.props.promotion));
        }
    };

    handleBasketChange = () => {
        const { basket, bopisFeaturedOffers } = this.props;

        const promoType = this.checkPromoType(bopisFeaturedOffers ? basket.pickupBasket.appliedPromotions : basket.appliedPromotions);

        if (!Location.isCheckout()) {
            this.setPromos(promoUtils.getAppliedPromotions(promoType, bopisFeaturedOffers ? basket.pickupBasket : basket));
        }

        promoUtils.updateMsgPromosIfSkuAutoRemoved(basket);
        this.setBasketWarnings(bopisFeaturedOffers ? basket.pickupBasket : basket);
    };

    handleError = () => {
        const { isMounted } = this.state;
        const { error } = this.props;
        const stateObj = {};

        if (
            error &&
            error.errorMessages &&
            // contains no promocode or cta is not specified
            (!error.promoCode || !error.appliedAt || error.appliedAt === promoUtils.CTA_TYPES.TEXT)
        ) {
            isMounted && this.hideError(false);

            if (error.errorCode !== promoUtils.ERROR_CODES.PROMO_OVER_LIMIT) {
                this.showErrorPromoMessage(error);
                stateObj.errorMessage = null;
                stateObj.errorCode = null;
                stateObj.hasError = true;
            } else {
                ErrorsUtils.clearErrors();
                stateObj.errorMessage = error.errorMessages.join('.');
                stateObj.errorCode = error.errorCode;
                stateObj.hasError = true;
            }
        }

        stateObj.isAllPromoCodesModalOpen = false;

        this.setState(stateObj);

        if (this.reCaptcha) {
            this.reCaptcha.reset();
        }
    };

    setPromos = basketPromosList => {
        this.setState(
            {
                basketPromosList,
                errorMessage: null,
                errorCode: null
            },
            () => {
                this.promoInput && this.promoInput.empty();
            }
        );
    };

    setBasketWarnings = basket => {
        const { basketLevelMessages, promoWarning } = basket;
        const promoMessage =
            basketLevelMessages?.filter(item => item.messageContext === PROMO_MESSAGES && item.type === 'error').map(promo => promo.messages) ||
            Empty.Array;

        if (promoWarning && promoWarning !== this.state.warningMessage) {
            this.props.refreshBasket();
            promoUtils.showWarningMessage(promoWarning);
        } else if (promoMessage.length) {
            promoUtils.showWarningMessage(promoMessage[0]);
        }

        this.setState({
            warningMessage: basket.promoWarning,
            basketLevelMessages
        });
    };

    setRrcLabelVisibility = visibility => {
        this.setState({ RrcAppliedManually: visibility });
    };

    applyPromoCode = (captchaToken, promoType) => {
        const promoCode = this.promoInput.getValue().trim();
        promoUtils.applyPromo(promoCode, captchaToken);

        if (promoType === promoUtils.PROMO_TYPES.RRC) {
            this.setRrcLabelVisibility(true);
        }
    };

    showErrorPromoMessage = errorData => {
        if (errorData.promoCode) {
            this.promoInput?.setValue(errorData.promoCode);
        }

        ErrorsUtils.collectAndValidateBackEndErrors(errorData, this);
    };

    showError = (message, value, errorKey) => {
        this.promoInput?.showError(message, null, errorKey);
    };

    removePromoCode = (e, couponCode, promoType) => {
        e.preventDefault();
        promoUtils.removePromo(couponCode);

        if (promoType === promoUtils.PROMO_TYPES.RRC) {
            this.setRrcLabelVisibility(false);
        }
    };

    fireAnalytics = () => {
        if (Location.isCheckout() || Location.isBasketPage()) {
            // Analytics - ILLUPH-95714 and UBS-319
            const pageType = Location.isCheckout() ? anaConsts.PAGE_TYPES.CHECKOUT : anaConsts.PAGE_TYPES.BASKET;
            const pageDetail = 'view promo code modal';
            const eventData = {
                pageName: `${pageType}:${anaConsts.ACTION_INFO.VIEW_PROMO_CODE_MODAL}`,
                pageType: pageType,
                pageDetail: pageDetail,
                linkData: `${pageType}:view promo codes`,
                actionInfo: `${pageType}:${anaConsts.ACTION_INFO.VIEW_PROMO_CODES}`
            };

            if (Location.isCheckout()) {
                // Analytics https://jira.sephora.com/browse/ET-398
                eventData.eventStrings = [];
                eventData.eventStrings.push(anaConsts.Event.SC_CHECKOUT);

                if (hasHalAddress()) {
                    eventData.eventStrings.push(anaConsts.Event.EVENT_247);
                }
            }

            processEvent.process(anaConsts.ASYNC_PAGE_LOAD, { data: eventData });
        }
    };

    handleFocus = () => {
        if (this.state.hasError) {
            this.promoInput && this.promoInput.empty();
            this.setState({ hasError: false });
        }
    };

    validateCaptchaAndApplyPromo = e => {
        e.preventDefault();

        const captchaPromoPatternList = Sephora.configurationSettings.captchaApplyPromotionPatternsList || [];
        const promoCode = this.promoInput.getValue().toUpperCase().trim();
        const promoType = promoUtils.getPromoType(promoCode);

        if (promoCode === '') {
            return;
        }

        let isCaptchaPromo = false;

        for (let i = 0; i < captchaPromoPatternList.length; i++) {
            if (promoCode.match(new RegExp(captchaPromoPatternList[i]))) {
                isCaptchaPromo = true;

                break;
            }
        }

        if (this.reCaptcha && isCaptchaPromo) {
            this.reCaptcha.execute();
        } else {
            this.applyPromoCode(undefined, promoType);
        }
    };

    onCaptchaTokenReady = token => {
        if (token) {
            this.applyPromoCode(token);
        }

        this.reCaptcha.reset();
    };

    onChallengerShow = () => {
        return null;
    };

    onChallengerDismiss = () => {
        return null;
    };

    showPromoCodeFiled = () => {
        this.setState({ canCollapsePromoField: false });
    };

    render() {
        const isFPGlobalEnabled = Sephora.fantasticPlasticConfigurations.isGlobalEnabled;
        const promoLabelText = isFPGlobalEnabled ? getText('ccPromoLabel') : getText('promoLabel');
        const isCanada = localeUtils.isCanada();

        const {
            basketPromosList = [],
            errorMessage,
            errorCode,
            basketLevelMessages,
            RrcAppliedManually,
            gridWidth,
            canCollapsePromoField
        } = this.state;

        const coupons = basketPromosList.reduce((acc, promo) => {
            const couponCode = promo.couponCode;
            (acc[couponCode] = acc[couponCode] || []).push(promo);

            return acc;
        }, {});

        const { bopisFeaturedOffers, infoModalCallbacks, featuredOffersMissing, isFrictionlessCheckout } = this.props;

        const isPromoCaptchaEnabled = Sephora.configurationSettings.captchaApplyPromotionEnabled;

        const promoApplied = basketPromosList.length;
        const allSkuPromoAreGlobal = isAllSkuPromoAreGlobal(basketPromosList);

        const promoMessage =
            (basketLevelMessages &&
                basketLevelMessages
                    .filter(
                        item => (item.messageContext === PROMO_MESSAGES && item.type !== 'error') || item.messageContext === RRC_REMAINING_BALANCE
                    )
                    .map(item => item.messages)) ||
            [];

        if (bopisFeaturedOffers && promoMessage.length === 0) {
            promoMessage.push(getText('youCanAddPromos'));
        }

        const PromoDescription =
            promoMessage.length > 0
                ? promoMessage.flat().map((message, index) => (
                    <Flex
                        key={index}
                        lineHeight='tight'
                    >
                        <Text
                            fontSize='sm'
                            marginTop={3}
                            color='gray'
                            flex={1}
                            alignSelf='center'
                            data-at={Sephora.debug.dataAt('promo_label')}
                        >
                            {message}
                        </Text>
                    </Flex>
                ))
                : null;

        const frictionlessChecekoutAndCollapsePromoField = isFrictionlessCheckout && canCollapsePromoField;

        return (
            <Box
                borderRadius={2}
                width='100%'
                display='block'
                paddingX={3}
                paddingY={frictionlessChecekoutAndCollapsePromoField ? 4 : 3}
                lineHeight='tight'
                marginTop={3}
                backgroundColor={colors.white}
            >
                {canCollapsePromoField && isCanada ? (
                    <Link
                        {...(!isFrictionlessCheckout && { marginY: -2, marginRight: -2, marginLeft: 1 })}
                        fontSize={14}
                        color='blue'
                        onClick={this.showPromoCodeFiled}
                    >
                        {!isFrictionlessCheckout ? getText('collapsePromoField') : getText('enterPromoCode')}
                    </Link>
                ) : (
                    <>
                        {!featuredOffersMissing && (
                            <Link
                                margin={-2}
                                fontSize='sm'
                                color='blue'
                                onClick={() => {
                                    infoModalCallbacks.featuredOffers();
                                    this.fireAnalytics();
                                }}
                                marginLeft={1}
                                marginBottom={2}
                            >
                                {getText('viewFeaturedOffers')}
                            </Link>
                        )}
                        {allSkuPromoAreGlobal ? null : (
                            <React.Fragment>
                                <Grid
                                    ref={comp => {
                                        this.containerRef = comp;
                                    }}
                                    is='form'
                                    gridTemplateColumns='1fr auto'
                                    onSubmit={this.validateCaptchaAndApplyPromo}
                                >
                                    <TextInput
                                        id='promoInput'
                                        autoOff={true}
                                        onFocus={() => this.handleFocus()}
                                        style={{ borderRadius: '4px' }}
                                        ref={c => {
                                            if (c !== null) {
                                                this.promoInput = c;
                                            }
                                        }}
                                        customStyle={{
                                            message: {
                                                width: gridWidth
                                            }
                                        }}
                                        marginBottom={null}
                                        label={promoLabelText}
                                        data-at={Sephora.debug.dataAt('bsk_promo_input')}
                                    />
                                    <Button
                                        variant='primary'
                                        type='submit'
                                        data-at={Sephora.debug.dataAt('apply_btn')}
                                    >
                                        {getText('applyText')}
                                    </Button>
                                </Grid>
                                {errorCode === promoUtils.ERROR_CODES.PROMO_OVER_LIMIT && !this.state.isErrorHidden ? (
                                    <Flex
                                        lineHeight='tight'
                                        backgroundColor='nearWhite'
                                        marginY={3}
                                        paddingX={3}
                                        paddingY={2}
                                        borderRadius={2}
                                    >
                                        <Icon
                                            name='alert'
                                            color='midGray'
                                            marginRight={2}
                                            size={18}
                                        />
                                        <Text
                                            is='p'
                                            flex={1}
                                            alignSelf='center'
                                            data-at={Sephora.debug.dataAt('warning_label')}
                                        >
                                            {errorMessage}{' '}
                                            <Link
                                                color='blue'
                                                underline={true}
                                                padding={2}
                                                margin={-2}
                                                onClick={() => this.hideError(true)}
                                                children={getText('gotIt')}
                                            ></Link>
                                        </Text>
                                    </Flex>
                                ) : null}
                                {PromoDescription}
                                {promoApplied ? (
                                    <Flex
                                        gap={2}
                                        flexWrap='wrap'
                                        marginTop={3}
                                    >
                                        {Object.keys(coupons).map(couponCode => {
                                            const couponPromos = coupons[couponCode];
                                            const promoTexts = couponPromos.map(x => {
                                                const isNumberAmmount = x.discountAmount && Number(BasketUtils.removeCurrency(x.discountAmount));
                                                const postfix = isNumberAmmount ? ` (${x.discountAmount})` : '';

                                                return `${x.displayName}${postfix}`;
                                            });

                                            const couponType = promoUtils.getPromoType(couponCode);

                                            if (couponType === promoUtils.PROMO_TYPES.PFD) {
                                                return null;
                                            }

                                            if (couponType === promoUtils.PROMO_TYPES.RRC && !RrcAppliedManually) {
                                                return null;
                                            }

                                            return (
                                                <>
                                                    {promoTexts.map(promoText => (
                                                        <Chiclet
                                                            css={{ whiteSpace: 'wrap' }}
                                                            width='fit-content'
                                                            variant='fill'
                                                            backgroundColor='nearWhite'
                                                            paddingX={3}
                                                            showX={true}
                                                            onClick={e => this.removePromoCode(e, couponCode, couponType)}
                                                            children={promoText}
                                                            {...(isFrictionlessCheckout && { maxWidth: '100%' })}
                                                        />
                                                    ))}
                                                </>
                                            );
                                        })}
                                    </Flex>
                                ) : null}
                            </React.Fragment>
                        )}
                        {isPromoCaptchaEnabled && (
                            <ReCaptcha
                                ref={c => {
                                    if (c !== null) {
                                        this.reCaptcha = c;
                                    }
                                }}
                                onChange={this.onCaptchaTokenReady}
                                onChallengerShow={this.onChallengerShow}
                                onChallengerDismiss={this.onChallengerDismiss}
                            />
                        )}{' '}
                    </>
                )}
            </Box>
        );
    }
}

export default wrapComponent(FeaturedOffers, 'FeaturedOffers', true);
