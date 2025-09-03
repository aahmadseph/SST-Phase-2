import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import content from 'constants/content';
import {
    modal, radii, colors, zIndices
} from 'style/config';
import {
    Box, Grid, Link, Text
} from 'components/ui';
import Carousel from 'components/Carousel';
import PromotionItem from 'components/Content/PromotionList/PromotionItem';
import MLActivatedInfo from 'components/Content/MLActivatedInfo';
import Location from 'utils/Location';
import anaUtils from 'analytics/utils';
import { CARD_GAP, CARD_WIDTH, CARDS_PER_SLIDE } from 'constants/promotionCard';

const OFFERS_URL = '/beauty/beauty-offers';
const { CONTEXTS, COMPONENT_SPACING } = content;

import constants from 'constants/content';
import anaConsts from 'analytics/constants';
import { sendCmsComponentEvent, matchContexts } from 'analytics/utils/cmsComponents';
import Empty from 'constants/empty';

const {
    COMPONENT_TYPES: { PROMOTION_LIST }
} = constants;

const {
    CMS_COMPONENT_EVENTS: { IMPRESSION, ITEM_CLICK }
} = anaConsts;

const PromotionList = ({
    context,
    sid,
    items,
    showSkeleton,
    title,
    page,
    appliedPromotions,
    localization,
    marginTop,
    marginBottom,
    areItemsPersonalized,
    personalization,
    metadata,
    showPersonalizationOverlay,
    isNBOEnabled,
    ...restOfProps
}) => {
    if (!showSkeleton && (!items || items?.length === 0)) {
        return null;
    }

    const mountPersonalization = (item, index) => {
        const personalizedContext = matchContexts(personalization);

        if (!Array.isArray(personalizedContext?.boPromotions) && !personalizedContext?.boPromotions?.[index]) {
            return item?.p13n || Empty.Object;
        }

        return {
            ...item.p13n,
            ...personalizedContext,
            context: personalizedContext?.context,
            variation: personalizedContext?.boPromotions[index],
            promoCode: item?.promoCode,
            promoId: item?.promoId
        };
    };

    const isModal = context === CONTEXTS.MODAL;

    const triggerClick = async (promotionItem, position) => {
        const eventName = ITEM_CLICK;
        const _items = promotionItem
            ? [
                {
                    ...promotionItem,
                    itemIndex: position,
                    p13n: mountPersonalization(promotionItem, position)
                }
            ]
            : items;

        await sendCmsComponentEvent({
            items: _items,
            eventName,
            title,
            sid,
            clickedSid: promotionItem.sid,
            component: PROMOTION_LIST,
            p13n: personalization
        });
    };

    const cardItems = showSkeleton ? [...Array(CARDS_PER_SLIDE).keys()] : items;
    const cards = cardItems.map((item, index) => {
        const promo = typeof item === 'object' ? item : {};

        // Analytics Data
        promo['slot'] = index;
        promo['personalizedPromoName'] = areItemsPersonalized ? promo?.sid : null;

        let locationId = page;

        if (page === 'home') {
            locationId = 'beauty offer:carousel';
        }

        return (
            <PromotionItem
                key={promo.sid || index}
                promoLocationId={locationId}
                personalization={personalization}
                sid={promo.sid}
                triggerClickEvent={triggerClick}
                position={index}
                isNBOEnabled={isNBOEnabled}
                {...(showSkeleton
                    ? {
                        isSkeleton: true,
                        promo: {
                            eligibility: []
                        }
                    }
                    : {
                        promo,
                        isApplied: appliedPromotions.some(e => e.couponCode === promo.promoCode?.toLowerCase())
                    })}
            />
        );
    });

    const showViewAllLink = !Location.isOffersPage() && !(Sephora.configurationSettings.isContentfulBasketEnabled && Location.isBasketPage());

    const triggerCMSImpression = targets => {
        const currentItems = items
            .map((item, index) => ({
                ...item,
                itemIndex: index,
                p13n: mountPersonalization(item, index)
            }))
            .filter((item, index) => targets.includes(index));

        const eventName = IMPRESSION;

        sendCmsComponentEvent({
            items: currentItems,
            p13n: personalization,
            component: PROMOTION_LIST,
            eventName,
            title,
            sid
        });
    };

    return (
        <Box
            id={sid}
            marginTop={marginTop}
            marginBottom={marginBottom}
        >
            {title && (
                <Grid
                    columns={showViewAllLink && '1fr auto'}
                    alignItems='baseline'
                >
                    <Text
                        is='h2'
                        marginBottom={4}
                        fontSize={['md', 'lg']}
                        fontWeight='bold'
                        dangerouslySetInnerHTML={{
                            __html: `${title} (${cards.length})`
                        }}
                    />
                    {showViewAllLink && (
                        <Link
                            href={OFFERS_URL}
                            onClick={e => {
                                if (page === 'home') {
                                    const linkData = 'beauty offer:carousel:view all';
                                    anaUtils.setNextPageData({
                                        linkData: linkData,
                                        internalCampaign: linkData
                                    });
                                }

                                Location.navigateTo(e, OFFERS_URL);
                            }}
                            color='blue'
                            padding={1}
                            margin={-1}
                            children={localization.viewAll}
                        />
                    )}
                </Grid>
            )}
            <Box
                className='promotion-list-carousel'
                position='relative'
                zIndex={1}
                css={showPersonalizationOverlay ? styles.personalizationOverlayContainer : {}}
            >
                <Carousel
                    id={sid}
                    isLoading={showSkeleton}
                    gap={CARD_GAP}
                    paddingY={4}
                    marginX={isModal ? modal.outdentX : '-container'}
                    scrollPadding={[2, isModal ? modal.paddingX[1] : 'container']}
                    itemWidth={CARD_WIDTH}
                    items={cards}
                    hasShadowHack={!isModal}
                    onImpression={triggerCMSImpression}
                />

                {showPersonalizationOverlay && (
                    <MLActivatedInfo
                        personalization={personalization}
                        metadata={{
                            cxsSD: restOfProps.cxsSD,
                            cxsED: restOfProps.cxsED
                        }}
                    />
                )}
            </Box>
        </Box>
    );
};

const styles = {
    skeleton: {
        title: {
            borderRadius: radii.full,
            width: 204
        }
    },
    personalizationOverlayContainer: {
        '::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            border: `4px solid ${colors.red}`,
            pointerEvents: 'none',
            zIndex: zIndices.fixedBar
        }
    }
};

PromotionList.propTypes = {
    context: PropTypes.oneOf([CONTEXTS.CONTAINER, CONTEXTS.MODAL]).isRequired,
    page: PropTypes.string,
    sid: PropTypes.string,
    appliedPromotions: PropTypes.array.isRequired,
    items: PropTypes.array,
    localization: PropTypes.object.isRequired,
    title: PropTypes.string,
    showSkeleton: PropTypes.bool,
    marginTop: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
    marginBottom: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
    areItemsPersonalized: PropTypes.bool,
    personalization: PropTypes.object,
    metadata: PropTypes.object,
    isNBOEnabled: PropTypes.bool
};

PromotionList.defaultProps = {
    sid: null,
    page: null,
    appliedPromotions: null,
    items: null,
    title: null,
    showSkeleton: null,
    marginTop: COMPONENT_SPACING.LG,
    marginBottom: COMPONENT_SPACING.LG,
    isNBOEnabled: false
};

export default wrapFunctionalComponent(PromotionList, 'PromotionList');
