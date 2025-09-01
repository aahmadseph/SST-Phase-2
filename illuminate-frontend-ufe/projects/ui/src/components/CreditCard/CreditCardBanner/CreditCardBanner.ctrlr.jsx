import React from 'react';
import { wrapComponent } from 'utils/framework';
import {
    Box, Grid, Button, Text, Divider, Image
} from 'components/ui';
import BaseClass from 'components/BaseClass';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import Markdown from 'components/Markdown/Markdown';
import localeUtils from 'utils/LanguageLocale';
import basketUtils from 'utils/Basket';
import agentAwareUtils from 'utils/AgentAware';
import actions from 'Actions';
import BCC from 'utils/BCC';
import safelyReadProp from 'analytics/utils/safelyReadProperty';
import store from 'store/Store';
import userUtils from 'utils/User';
import { SHOW_BASKET_CC_BANNER_8_PERCENT_BACK } from 'constants/TestTarget';

import { TestTargetReady } from 'constants/events';
import RCPSCookies from 'utils/RCPSCookies';
import { globalModals, renderModal } from 'utils/globalModals';

const { TERMS_OF_SERVICE } = globalModals;
const { isPickup } = basketUtils;
const AB_TEST_EIGHT_PERCENT_BANNER_CONFIG = {
    title: 'Sephora Credit Card',
    text: 'Don’t forget! You earn 8% back on this order by combining credit card rewards^2^ and Beauty Insider points^i^ by using your Sephora credit card.',
    tcText: ''
};
const AB_TEST_EIGHT_PERCENT_BANNER_CONFIG_ALT = {
    title: 'Sephora Credit Card',
    text: 'Don’t forget! You earn $20 in savings for every $250 spent on your card at Sephora when you combine credit card rewards^2^ and Beauty Insider Cash^i^.',
    tcText: ''
};
const TT_CC_OFFER = 'CreditCardBannerOffer';
const TT_CC_BANNER_OFFER = 'creditCardBanners';

class CreditCardBanner extends BaseClass {
    state = {
        ccTargeters: {},
        firstBuyDiscountTotal: null,
        offers: null,
        targetBannerData: null,
        showCcBannerChallengerOne: false,
        showCcBannerChallengerTwo: false,
        hasSephoraCard: false
    };

    componentDidMount() {
        store.setAndWatch('basket', this, data => {
            let firstBuyDiscountTotal = data.basket.firstBuyOrderDiscount;

            if (isPickup()) {
                firstBuyDiscountTotal = data.basket.pickupBasket?.firstBuyOrderDiscount;
            }

            if (data.basket) {
                this.setState({ firstBuyDiscountTotal });
            }
        });
        store.setAndWatch('creditCard.ccTargeters', this, data => {
            this.setState({ ccTargeters: data.ccTargeters });
        });
        store.setAndWatch('testTarget.offers', this, null, true);

        Sephora.Util.onLastLoadEvent(window, [TestTargetReady], () => {
            store.setAndWatch('testTarget', this, newOffers => {
                const testBannerData = safelyReadProp('testTarget.offers.creditCardBanners.result', newOffers);
                const basketCcBanner8percentBackExperience = newOffers.testTarget.offers?.basketCreditCardBanner?.experience;
                const showCcBannerChallengerOne = basketCcBanner8percentBackExperience === SHOW_BASKET_CC_BANNER_8_PERCENT_BACK.CHALLENGER_ONE;
                const showCcBannerChallengerTwo = basketCcBanner8percentBackExperience === SHOW_BASKET_CC_BANNER_8_PERCENT_BACK.CHALLENGER_TWO;
                this.setState({
                    showCcBannerChallengerOne,
                    showCcBannerChallengerTwo
                });

                if (testBannerData?.bannerData && testBannerData?.isHidden) {
                    this.setState({
                        targetBannerData: {
                            attributes: testBannerData.bannerData,
                            isHidden: testBannerData.isHidden
                        }
                    });
                }
            });
        });
    }

    parseBccBannerData = bccData => {
        if (bccData && bccData.attributes) {
            const data = {};
            const { firstBuyDiscountTotal } = this.state;

            bccData.attributes.forEach(attr => {
                const keyValuePair = attr.split('=');

                if (keyValuePair.length === 2) {
                    data[keyValuePair[0]] = keyValuePair[1];
                } else if (keyValuePair.length === 3) {
                    //if icid2 url param has been included in attribute
                    data[keyValuePair[0]] = `${keyValuePair[1]}=${keyValuePair[2]}`;
                }
            });
            let text = data.Message;

            if (text.indexOf('{0}') !== -1) {
                text = firstBuyDiscountTotal ? data.Message.replace('{0}', firstBuyDiscountTotal) : '';
            }

            return {
                title: data.CreditCardName,
                text: text,
                imagePath: data.Icon,
                tcText: data.TermsAndConditions,
                buttonText: data.CTAText,
                buttonUrl: data.CTADestination
            };
        } else {
            return null;
        }
    };

    parseBannerData = data => {
        if (data && data.items?.length > 0) {
            const { firstBuyDiscountTotal } = this.state;
            const formattedData = data.items.reduce((acc, curr) => {
                acc[curr.key] = curr.value;

                return acc;
            }, {});

            let text = formattedData.Message || '';

            if (text.indexOf('{0}') !== -1) {
                text = firstBuyDiscountTotal ? formattedData.Message.replace('{0}', firstBuyDiscountTotal) : '';
            }

            return {
                title: formattedData.CreditCardName,
                text: text,
                imagePath: formattedData.Icon,
                tcText: formattedData.TermsAndConditions,
                buttonText: formattedData.CTAText,
                buttonUrl: formattedData.CTADestination
            };
        }

        return null;
    };

    openMediaModal = () => {
        renderModal(this.props.globalModals[TERMS_OF_SERVICE], () => {
            const mediaId = BCC.MEDIA_IDS.REWARDS_TERMS_AND_CONDITIONS;
            store.dispatch(
                actions.showMediaModal({
                    isOpen: true,
                    mediaId
                })
            );
        });
    };

    getStoredBccBasketBanner = () => {
        const { source } = this.props;
        const { ccTargeters } = this.state;

        let data;

        switch (source) {
            case 'basket':
                data = ccTargeters.CCDynamicMessagingBasketTargeter && ccTargeters.CCDynamicMessagingBasketTargeter[0];

                break;
            case 'inline':
                data = ccTargeters.CCDynamicMessagingInlineBasketTargeter && ccTargeters.CCDynamicMessagingInlineBasketTargeter[0];

                break;
            case 'checkout':
                data = ccTargeters.CCDynamicMessagingCheckoutTargeter && ccTargeters.CCDynamicMessagingCheckoutTargeter[0];

                break;
            default:
                data = null;
        }

        return data;
    };

    openCreditCardModal = () => {
        store.dispatch(
            actions.showCreditCardOfferModal({
                isOpen: true,
                isBasketPageTest: true
            })
        );
    };

    // eslint-disable-next-line complexity
    render() {
        /* eslint-disable prefer-const */
        let {
            testTarget = null,
            bannerData = {},
            variant, // `centered` || `row`
            isInlineBasket,
            source,
            isMobile,
            isBopis,
            gap = '16',
            marginX = '',
            personalizedComponent,
            ...props
        } = this.props;
        /* eslint-enable prefer-const */

        const { targetBannerData, showCcBannerChallengerOne, showCcBannerChallengerTwo } = this.state;

        if (!localeUtils.isUS()) {
            return null;
        }

        const { isGlobalEnabled, isMarketingEnabled } = Sephora.fantasticPlasticConfigurations;

        if (!isGlobalEnabled || !isMarketingEnabled) {
            return null;
        }

        if (testTarget) {
            if (testTarget[TT_CC_OFFER]) {
                bannerData = Object.assign({}, bannerData, testTarget[TT_CC_OFFER]);
            } else if (testTarget[TT_CC_BANNER_OFFER]) {
                if (RCPSCookies.isRCPSCCAP()) {
                    bannerData = Object.assign({}, bannerData, this.parseBannerData(personalizedComponent));
                } else {
                    bannerData = Object.assign({}, bannerData, this.parseBccBannerData(this.getStoredBccBasketBanner()));
                }
            }
        } else {
            if (RCPSCookies.isRCPSCCAP()) {
                bannerData = Object.assign({}, bannerData, this.parseBannerData(personalizedComponent));
            } else {
                bannerData = Object.assign({}, bannerData, this.parseBccBannerData(this.getStoredBccBasketBanner()));
            }
        }

        if (targetBannerData) {
            bannerData = Object.assign({}, bannerData, targetBannerData.attributes);
        }

        if (targetBannerData?.isHidden[source] || !bannerData.text || !bannerData.title || !bannerData.imagePath) {
            return null;
        }

        const { buttonText, buttonUrl, imagePath } = bannerData;
        let { title, text, tcText } = bannerData;
        let isCcBasketBannerTest;

        if (userUtils.isSephoraCreditCardHolder()) {
            isCcBasketBannerTest = showCcBannerChallengerOne || showCcBannerChallengerTwo;

            if (showCcBannerChallengerOne) {
                ({ title, text, tcText } = AB_TEST_EIGHT_PERCENT_BANNER_CONFIG);
            }

            if (showCcBannerChallengerTwo) {
                ({ title, text, tcText } = AB_TEST_EIGHT_PERCENT_BANNER_CONFIG_ALT);
            }
        }

        if (isInlineBasket) {
            return (
                <React.Fragment>
                    <Divider
                        marginY={3}
                        marginX={-4}
                    />
                    <Grid
                        gap={3}
                        columns='auto 1fr'
                        alignItems='flex-start'
                        lineHeight='tight'
                        fontSize='sm'
                        className={agentAwareUtils.applyHideAgentAwareClass()}
                    >
                        <Image
                            src='/img/ufe/icons/cc-outline.svg'
                            size={20}
                        />
                        <div>
                            {title && (
                                <Text
                                    is='h2'
                                    fontWeight='bold'
                                    children={title}
                                />
                            )}
                            {text && <Markdown content={text} />}
                            {buttonUrl && buttonText ? (
                                <Button
                                    size='sm'
                                    marginTop={2}
                                    variant='secondary'
                                    href={buttonUrl}
                                    children={buttonText}
                                />
                            ) : null}
                            {tcText && (
                                <Markdown
                                    marginTop={2}
                                    fontSize='xs'
                                    color='gray'
                                    content={tcText}
                                />
                            )}
                        </div>
                    </Grid>
                </React.Fragment>
            );
        }

        const isCentered = variant === 'centered';
        const isRow = variant === 'row';

        const bannerImage = imagePath ? (
            <Image
                src={imagePath}
                width={38}
                height={32}
                display='block'
                {...(isCentered && {
                    marginBottom: 2,
                    marginX: 'auto'
                })}
            />
        ) : null;

        return (
            <Box
                className={agentAwareUtils.applyHideAgentAwareClass()}
                {...props}
            >
                <React.Fragment>
                    {isBopis ? (
                        <Grid
                            gap={gap}
                            marginX={marginX}
                            columns={isMobile ? 'auto 1fr' : 'auto 1fr auto'}
                            alignItems='flex-start'
                            lineHeight='tight'
                        >
                            <Image
                                src='/img/ufe/icons/cc-outline.svg'
                                size={24}
                            />
                            <div>
                                {title && (
                                    <Text
                                        is='h2'
                                        fontWeight='bold'
                                        children={title}
                                    />
                                )}
                                {text && (
                                    <Markdown
                                        marginTop={2}
                                        content={text}
                                    />
                                )}
                                {tcText && (
                                    <Markdown
                                        marginTop={2}
                                        fontSize='xs'
                                        color='gray'
                                        content={tcText}
                                    />
                                )}
                                {isMobile && buttonUrl && buttonText ? (
                                    <Button
                                        size='sm'
                                        marginTop={2}
                                        variant='secondary'
                                        href={!isCcBasketBannerTest && buttonUrl}
                                        onClick={isCcBasketBannerTest && this.openCreditCardModal}
                                        children={buttonText}
                                    />
                                ) : null}
                            </div>
                            {isMobile || (
                                <Grid
                                    gap={null}
                                    height='100%'
                                    alignItems='center'
                                >
                                    {buttonUrl && buttonText ? (
                                        <Button
                                            size='sm'
                                            variant='secondary'
                                            href={!isCcBasketBannerTest && buttonUrl}
                                            onClick={isCcBasketBannerTest && this.openCreditCardModal}
                                            children={buttonText}
                                        />
                                    ) : null}
                                </Grid>
                            )}
                        </Grid>
                    ) : (
                        <LegacyGrid
                            gutter={4}
                            lineHeight='tight'
                            alignItems='center'
                            textAlign={isCentered && 'center'}
                        >
                            <LegacyGrid.Cell width='fill'>
                                {bannerImage && isCentered && bannerImage}
                                {title && (
                                    <Text
                                        is='h2'
                                        fontSize={isRow || 'md'}
                                        marginBottom={isCentered ? 2 : 1}
                                        fontWeight='bold'
                                        children={title}
                                    />
                                )}
                                <LegacyGrid
                                    gutter={3}
                                    alignItems='center'
                                >
                                    {bannerImage && !isCentered && <LegacyGrid.Cell width='fit'>{bannerImage}</LegacyGrid.Cell>}
                                    <LegacyGrid.Cell width='fill'>{text && <Markdown content={text} />}</LegacyGrid.Cell>
                                </LegacyGrid>
                                {tcText && (
                                    <Markdown
                                        marginTop={2}
                                        fontSize='sm'
                                        color='gray'
                                        content={tcText}
                                    />
                                )}
                            </LegacyGrid.Cell>
                            {buttonUrl && buttonText && (
                                <LegacyGrid.Cell
                                    width={isRow && 'fit'}
                                    marginTop={isRow || 2}
                                >
                                    <Button
                                        size='sm'
                                        variant='secondary'
                                        block={!isRow}
                                        href={!isCcBasketBannerTest && buttonUrl}
                                        onClick={isCcBasketBannerTest && this.openCreditCardModal}
                                        children={buttonText}
                                    />
                                </LegacyGrid.Cell>
                            )}
                        </LegacyGrid>
                    )}
                </React.Fragment>
            </Box>
        );
    }
}

export default wrapComponent(CreditCardBanner, 'CreditCardBanner', true);
