import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    Text, Box, Grid, Divider
} from 'components/ui';
import * as rwdBasketConstants from 'constants/RwdBasket';
import CashBackRewards from 'components/RwdBasket/RwdBasketLayout/BIBenefits/CashBackRewards';
import CreditCardProgram from 'components/RwdBasket/RwdBasketLayout/BIBenefits/CreditCardProgram';
import RCPSCookies from 'utils/RCPSCookies';
import localeUtils from 'utils/LanguageLocale';
import BIBenefitsRewards from 'components/RwdBasket/RwdBasketLayout/BIBenefits/BIBenefitsRewards/BIBenefitsRewards';
import { BASKET_TYPES } from 'constants/RwdBasket';
import Empty from 'constants/empty';
import CCRewards from 'components/RwdBasket/RwdBasketLayout/BIBenefits/CCRewards/CCRewards';
import FeaturedOffers from 'components/RwdBasket/RwdBasketLayout/BIBenefits/FeaturedOffers';
import ErrorMessage from 'components/FrictionlessCheckout/ErrorMessage/ErrorMessage';
import ScrollAnchor from 'components/ScrollAnchor/ScrollAnchor';
import { SECTION_NAMES } from 'constants/frictionlessCheckout';

const {
    BI_BENEFITS_ITEM_TYPES: { BI_POINTS, ROUGE_REWARDS, CC_REWARDS },
    BASKET_RENDERING_TYPE_DYNAMIC_ATTRIBUTE: { ITEM_TYPE }
} = rwdBasketConstants;

class BIBenefits extends BaseClass {
    renderCCRewardsTile = (ccTargeters, ccBanner, ccRewards) => {
        let compToRender = null;

        const { biBenefitsInfo, basketType } = this.props;

        const { infoModalCallbacks } = biBenefitsInfo[basketType] || {};
        const creditCardRewardsModalData = infoModalCallbacks?.creditCardRewardsModal || {};

        if (localeUtils.isUS()) {
            if (ccRewards.showCCRewards) {
                compToRender = (
                    <CCRewards
                        {...ccRewards}
                        infoModalCallback={creditCardRewardsModalData}
                    />
                );
            } else {
                if (Sephora.isAgent) {
                    //do an early return if it is agent aware
                    return null;
                }

                if (RCPSCookies.isRCPSCCAP()) {
                    compToRender = ccBanner ? <CreditCardProgram ccTargeters={ccBanner} /> : null;
                } else {
                    compToRender = ccTargeters ? <CreditCardProgram ccTargeters={ccTargeters} /> : null;
                }
            }
        }

        return compToRender;
    };
    updateRougeRewards = () => {
        const { biBenefitsInfo, basketType } = this.props;
        const { rougeRewards } = biBenefitsInfo[basketType];

        const updatedRougeRewards = { ...rougeRewards, showChevron: rougeRewards.showRougeRewardsChevron && !rougeRewards.disableRougeRewards };

        return updatedRougeRewards;
    };

    renderBIBenefitsTiles = basket => {
        const {
            biBenefitsContentData, cbr, infoModalCallbacks, ccBanner, ccTargeters, ccRewards
        } = basket;
        const { localization, basketType } = this.props;
        const rougeRewards = basketType === BASKET_TYPES.DC_BASKET ? this.updateRougeRewards() : Empty.Object;

        const biBenefitsTiles = biBenefitsContentData
            ?.map(comp => {
                const itemType = comp.items?.find(item => item.key.toLowerCase() === ITEM_TYPE.toLowerCase())?.value || '';

                return (
                    itemType.length > 0 &&
                    {
                        [BI_POINTS]: cbr.isAvailable ? (
                            <CashBackRewards
                                {...cbr}
                                infoModalCallback={infoModalCallbacks.cbr}
                            />
                        ) : null,
                        [CC_REWARDS]: this.renderCCRewardsTile(ccTargeters, ccBanner, ccRewards),
                        [ROUGE_REWARDS]: rougeRewards?.showRougeRewardsUI ? (
                            <BIBenefitsRewards
                                {...rougeRewards}
                                onBasketSwitch={() => {}}
                                rougeInfoModalCallback={infoModalCallbacks.applyRougeRewards}
                                rougeBadgeText={localization.rougeBadge}
                                isCheckout
                            />
                        ) : null
                    }[itemType]
                );
            })
            .filter(value => value != null);

        return (
            <Grid
                borderRadius={2}
                width='100%'
                display='block'
                lineHeight='tight'
                marginTop={4}
                marginBottom={2}
                backgroundColor={'white'}
                gap={3}
                alignItems={'center'}
            >
                {biBenefitsTiles &&
                    biBenefitsTiles.map((tile, i) => (
                        <React.Fragment key={`bi_benefits_tile_${i}`}>
                            {tile}
                            {i < biBenefitsTiles.length - 1 && <Divider />}
                        </React.Fragment>
                    ))}
            </Grid>
        );
    };
    renderTitle = basket => {
        const {
            localization: { title },
            sectionLevelError,
            getText
        } = this.props;

        return (
            <>
                <Text
                    is='h2'
                    fontSize={['md', 'md', 'lg']}
                    fontWeight='bold'
                    lineHeight={['tight', 'tight', 'none']}
                >
                    {title}
                </Text>
                {(!sectionLevelError || sectionLevelError?.length === 0) && (
                    <Text
                        is='p'
                        marginTop={1}
                        marginBottom={4}
                        dangerouslySetInnerHTML={{
                            __html: getText('biPoints', [basket?.biAccount?.biPoints])
                        }}
                    />
                )}
            </>
        );
    };

    renderPromoCodeSection = basket => {
        const { infoModalCallbacks, bopisFeaturedOffers } = basket;

        const updatedInfoModalCallbacks = {
            ...infoModalCallbacks,
            featuredOffers: infoModalCallbacks?.biFeaturedOffers
        };

        return (
            <Box backgroundColor='white'>
                <FeaturedOffers
                    infoModalCallbacks={updatedInfoModalCallbacks}
                    bopisFeaturedOffers={bopisFeaturedOffers}
                    featuredOffersMissing={!updatedInfoModalCallbacks?.featuredOffers}
                    isFrictionlessCheckout
                />
            </Box>
        );
    };

    renderErrorMessage = sectionLevelError => {
        return <ErrorMessage message={sectionLevelError} />;
    };

    renderScrollAnchor = () => {
        return (
            <ScrollAnchor
                id={SECTION_NAMES.BI_BENEFITS}
                hasOffset={false}
            />
        );
    };

    render() {
        const { biBenefitsInfo, basketType, isGuestCheckout, sectionLevelError } = this.props;
        const basket = biBenefitsInfo[basketType] || {};

        return (
            <Box
                borderRadius={2}
                display='block'
                paddingX={[4, 4, 3]}
                paddingTop={!isGuestCheckout && 4}
                paddingBottom={4}
                lineHeight='tight'
                backgroundColor='nearWhite'
                marginX={['-container', 0]}
                aria-label={this.props.rougeBadge}
                role='region'
            >
                {this.renderScrollAnchor()}

                {!isGuestCheckout && this.renderTitle(basket)}

                <Box marginTop={1}>{sectionLevelError?.length > 0 && this.renderErrorMessage(sectionLevelError)}</Box>

                {this.renderBIBenefitsTiles(basket)}

                {this.renderPromoCodeSection(basket)}
            </Box>
        );
    }
}

export default wrapComponent(BIBenefits, 'BIBenefits');
