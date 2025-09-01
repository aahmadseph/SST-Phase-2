/* eslint-disable class-methods-use-this */
import React from 'react';

import BaseClass from 'components/BaseClass';
import FrameworkUtils from 'utils/framework';
import {
    Box, Flex, Text, Grid, Button, Divider, Icon, Link
} from 'components/ui';
import TextInput from 'components/Inputs/TextInput/TextInput';
import IconCheckmark from 'components/LegacyIcon/IconCheckmark';
import MobilePromoList from 'components/Checkout/PromoSection/MobilePromoList';
import BasketUtils from 'utils/Basket';
import promoUtils from 'utils/Promos';
import ReCaptcha from 'components/ReCaptcha/ReCaptcha';
import localeUtils from 'utils/LanguageLocale';
import CheckoutUtils from 'utils/Checkout';
import Debounce from 'utils/Debounce';
import ErrorsUtils from 'utils/Errors';
import Location from 'utils/Location';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import OrderUtils from 'utils/Order';

const { wrapComponent } = FrameworkUtils;
const {
    MESSAGE_CONTEXT: { PROMO_MESSAGES }
} = CheckoutUtils;
const { hasHalAddress } = OrderUtils;

const DEBOUNCE_TEXT_CHANGE = 300;

const getText = localeUtils.getLocaleResourceFile('components/Checkout/PromoSection/locales', 'PromoSection');

const isAllSkuPromoAreGlobal = basketPromosList => {
    let allSkuPromoAreGlobal = !!basketPromosList.length;
    basketPromosList.forEach(skuPromo => {
        if (!skuPromo.isGlobalPromotion) {
            allSkuPromoAreGlobal = false;
        }
    });

    return allSkuPromoAreGlobal;
};

class PromoSection extends BaseClass {
    state = {
        basketPromosList: [],
        promoStartsToApply: false,
        errorMessage: null,
        errorCode: null,
        warningMessage: null,
        hasError: false,
        isAllPromoCodesModalOpen: false,
        RrcAppliedManually: false
    };

    promoInput = null;
    reCaptcha = null;

    componentDidMount() {
        this.handleBasketChange();
        this.handlePromotionChange();
        this.handleError();

        this.setState({ isMounted: true });
    }

    componentDidUpdate(prevProps) {
        if (this.props.error !== prevProps.error) {
            this.handleError();
        }

        if (this.props.promotion !== prevProps.promotion) {
            this.handlePromotionChange();
        }

        if (this.props.basket !== prevProps.basket || this.props.isBopis !== prevProps.isBopis) {
            this.handleBasketChange();
        }
    }

    handlePromotionChange = () => {
        if (Location.isCheckout()) {
            this.setPromos(promoUtils.getAppliedPromotions(promoUtils.PROMO_TYPES.PROMO, this.props.promotion));
        }
    };

    handleBasketChange = () => {
        const { basket, isBopis } = this.props;

        if (!Location.isCheckout()) {
            this.setPromos(promoUtils.getAppliedPromotions(promoUtils.PROMO_TYPES.PROMO, isBopis ? basket.pickupBasket : basket));
        }

        this.setBasketWarnings(isBopis ? basket.pickupBasket : basket);
    };

    handleError = () => {
        const { isMounted } = this.state;
        const { hideError, error } = this.props;
        const stateObj = {};

        if (
            error &&
            error.errorMessages &&
            // contains no promocode or cta is not specified
            (!error.promoCode || !error.appliedAt || error.appliedAt === promoUtils.CTA_TYPES.TEXT)
        ) {
            isMounted && typeof hideError === 'function' && hideError(false);

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
                errorCode: null,
                promoStartsToApply: false
            },
            () => {
                this.promoInput && this.promoInput.empty();
            }
        );
    };

    setBasketWarnings = basket => {
        const { basketLevelMessages, promoWarning } = basket;

        if (promoWarning && promoWarning !== this.state.warningMessage) {
            this.props.refreshBasket();
            promoUtils.showWarningMessage(promoWarning);
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
        this.setState({ promoStartsToApply: false });
        this.promoInput?.showError(message, null, errorKey);
    };

    removePromoCode = (e, couponCode, promoType) => {
        e.preventDefault();
        promoUtils.removePromo(couponCode);

        if (promoType === promoUtils.PROMO_TYPES.RRC) {
            this.setRrcLabelVisibility(false);
        }
    };

    handleTextChange = e => {
        const promoCode = e.currentTarget.value;
        this.setState({ promoStartsToApply: promoCode.length > 0 });
    };

    debouncedHandleTextChange = Debounce.preventDoubleClick(this.handleTextChange, DEBOUNCE_TEXT_CHANGE);

    showPromoModal = () => {
        const contentfulData = {
            sid: 'basket_featured_offers_modal_us',
            title: 'Featured Offers',
            width: 3
        };

        if (localeUtils.isCanada()) {
            contentfulData.sid = 'basket_featured_offers_modal_ca';

            if (localeUtils.isFrench()) {
                contentfulData.title = 'Offres en vedette';
            }
        }

        this.props.showContentModal({
            isOpen: true,
            data: contentfulData
        });

        this.fireAnalytics();
    };

    fireAnalytics = () => {
        if (Location.isCheckout() || Location.isBasketPage()) {
            // Analytics - ILLUPH-95714 and UBS-319
            const pageType = Location.isCheckout() ? anaConsts.PAGE_TYPES.CHECKOUT : anaConsts.PAGE_TYPES.BASKET;
            const pageDetail = 'view promo code modal';
            const eventData = {
                pageName: `${pageType}:${pageDetail}:n/a:*`,
                pageType: pageType,
                pageDetail: pageDetail,
                linkData: `${pageType}:view promo codes`
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

    handleErrorMessageClick = () => {
        const { hideError } = this.props;

        if (typeof hideError === 'function') {
            hideError(true);
        }
    };

    render() {
        const isFPGlobalEnabled = Sephora.fantasticPlasticConfigurations.isGlobalEnabled;
        const promoLabelText = isFPGlobalEnabled ? getText('ccPromoLabel') : getText('promoLabel');

        const {
            basketPromosList = [], errorMessage, errorCode, promoStartsToApply, basketLevelMessages, RrcAppliedManually
        } = this.state;

        const coupons = basketPromosList.reduce((acc, promo) => {
            const couponCode = promo.couponCode;
            (acc[couponCode] = acc[couponCode] || []).push(promo);

            return acc;
        }, {});

        const { isErrorHidden, isBopis } = this.props;

        const isPromoCaptchaEnabled = Sephora.configurationSettings.captchaApplyPromotionEnabled;

        const promoApplied = basketPromosList.length;
        const allSkuPromoAreGlobal = isAllSkuPromoAreGlobal(basketPromosList);

        const promoMessage =
            (basketLevelMessages && basketLevelMessages.filter(item => item.messageContext === PROMO_MESSAGES).map(item => item.messages)) || [];

        if (isBopis && promoMessage.length === 0) {
            promoMessage.push(getText('youCanAddPromos'));
        }

        const PromoDescription =
            promoMessage.length > 0
                ? promoMessage.flat().map((message, index) => (
                    <Flex
                        key={index}
                        lineHeight='tight'
                        backgroundColor='nearWhite'
                        marginY={2}
                        paddingX={3}
                        paddingY={2}
                        borderRadius={2}
                    >
                        <Text
                            is='p'
                            flex={1}
                            alignSelf='center'
                            data-at={Sephora.debug.dataAt('promo_label')}
                        >
                            {message}
                        </Text>
                    </Flex>
                ))
                : null;

        return (
            <div data-at={Sephora.debug.dataAt('promotion_section')}>
                <Flex
                    marginBottom={1}
                    justifyContent='flex-end'
                >
                    <Link
                        padding={2}
                        margin={-2}
                        arrowDirection='right'
                        fontSize='sm'
                        onClick={this.showPromoModal}
                    >
                        {getText('viewPromoCodesText')}
                    </Link>
                </Flex>
                {Sephora.isMobile() && <MobilePromoList />}
                {allSkuPromoAreGlobal ? null : (
                    <React.Fragment>
                        <Grid
                            is='form'
                            columns='1fr auto'
                            gap={promoStartsToApply ? 2 : null}
                            onSubmit={this.validateCaptchaAndApplyPromo}
                        >
                            <TextInput
                                id='promoInput'
                                autoOff={true}
                                onFocus={this.handleFocus}
                                onChange={this.debouncedHandleTextChange}
                                ref={c => {
                                    if (c !== null) {
                                        this.promoInput = c;
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
                                style={!promoStartsToApply ? { display: 'none' } : null}
                            >
                                {getText('applyText')}
                            </Button>
                        </Grid>
                        {errorCode === promoUtils.ERROR_CODES.PROMO_OVER_LIMIT && !isErrorHidden ? (
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
                                        onClick={this.handleErrorMessageClick}
                                        children={getText('gotIt')}
                                    ></Link>
                                </Text>
                            </Flex>
                        ) : null}
                        {PromoDescription}
                        {promoApplied
                            ? Object.keys(coupons).map((couponCode, index) => {
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
                                    <Box
                                        marginTop={3}
                                        key={`promo${couponCode}`}
                                    >
                                        {index > 0 && <Divider marginY={3} />}
                                        <Flex
                                            lineHeight='tight'
                                            data-at={Sephora.debug.dataAt('basket_promo_item')}
                                        >
                                            <Box
                                                flex={1}
                                                data-at={Sephora.debug.dataAt('promo_info')}
                                                marginRight={4}
                                            >
                                                {promoTexts.map((promoText, promoIndex) => (
                                                    <Text
                                                        key={promoIndex}
                                                        is='p'
                                                        marginRight={1}
                                                        children={promoIndex !== promoTexts.length - 1 ? `${promoText},` : promoText}
                                                    />
                                                ))}
                                            </Box>
                                            <Box textAlign='right'>
                                                <Flex
                                                    fontWeight='bold'
                                                    data-at={Sephora.debug.dataAt('applied_promo')}
                                                    alignItems='center'
                                                >
                                                    <IconCheckmark
                                                        fontSize='.875em'
                                                        marginRight={1}
                                                    />
                                                    {getText('appliedText')}
                                                </Flex>
                                                <Link
                                                    color='blue'
                                                    padding={2}
                                                    margin={-2}
                                                    onClick={e => this.removePromoCode(e, couponCode, couponType)}
                                                    children={getText('removeText')}
                                                />
                                            </Box>
                                        </Flex>
                                    </Box>
                                );
                            })
                            : null}
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
                )}
            </div>
        );
    }
}

export default wrapComponent(PromoSection, 'PromoSection', true);
