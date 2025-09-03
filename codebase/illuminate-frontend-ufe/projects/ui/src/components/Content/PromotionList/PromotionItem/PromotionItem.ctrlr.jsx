import React from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { space, buttons, radii } from 'style/config';
import {
    Button, Flex, Text, Icon, Link
} from 'components/ui';
import promoUtils from 'utils/Promos';
import uiUtils from 'utils/UI';
import Flag from 'components/Flag';
import Media from 'components/Content/Media';
import Action from 'components/Content/Action';
import Markdown from 'components/Markdown/Markdown';
import { CARD_WIDTH, IMAGE_HEIGHT, BUTTON_WIDTH } from 'constants/promotionCard';

import { PostLoad } from 'constants/events';
import anaConsts from 'analytics/constants';
import analyticsUtils from 'analytics/utils';
import processEvent from 'analytics/processEvent';
import store from 'store/Store';
import Actions from 'actions/Actions';
import Location from 'utils/Location';
import PromotionItemBindings from 'analytics/bindingMethods/components/Content/Promotion/PromotionItemBindings';
import constants from 'constants/content';

const { ACTION_TYPES } = constants;
const { SKELETON_ANIMATION } = uiUtils;
const ActionFlex = Action(Flex);
const ActionLink = Action(Link);

const CTA_PROPS = {
    size: 'sm',
    variant: 'secondary',
    minWidth: BUTTON_WIDTH
};

const ONE_DAY = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

class PromotionItem extends BaseClass {
    fireTileTrackingEvent = (eventName, promo, promoLocationId) => {
        const locationId = !promoLocationId ? `promotion-item-${digitalData?.page?.pageInfo?.pageName || ''}` : promoLocationId;

        const eventData = {
            actionInfo: eventName,
            promotionId: promo?.promoId || '',
            promotionName: promo?.sid || '',
            creativeName: promo?.media?.src || '',
            creativeSlot: promo?.slot || '',
            locationId,
            specificEventName: eventName
        };

        processEvent.process(
            anaConsts.PROMO_LINK_TRACKING_EVENT,
            { data: { ...eventData, finishEventWithoutTimeout: true } },
            { specificEventName: eventName }
        );
    };

    getTimerFlag = (endDate, localization) => {
        const date1 = new Date();
        const date2 = new Date(endDate);
        const daysLeft = Math.round((date2.getTime() - date1.getTime()) / ONE_DAY);

        if (daysLeft < 8) {
            return (
                <Flag
                    backgroundColor={daysLeft < 4 ? 'red' : 'black'}
                    css={{
                        position: 'absolute',
                        top: space[1],
                        left: space[1]
                    }}
                >
                    {daysLeft <= 0 ? localization.lastDay : `${daysLeft} ${daysLeft === 1 ? localization.dayLeft : localization.daysLeft}`}
                </Flag>
            );
        } else {
            return null;
        }
    };

    handleViewableImpression = (promo, promoLocationId) => {
        const eventName = 'viewableImpression';

        const self = this;

        // Waits until the page is completely loaded to fire the event for Signal/TMS.
        Sephora.Util.onLastLoadEvent(window, [PostLoad], () => {
            self.fireTileTrackingEvent(eventName, promo, promoLocationId);
        });
    };

    handleTriggerEvent = async nextPageData => {
        const { promoLocationId, triggerClickEvent, promo } = this.props;

        if (triggerClickEvent) {
            await triggerClickEvent(promo, this.props.position);
        }

        const eventName = 'promotionClick';
        const { promoId } = promo;

        // Determines if the promo needs to be tracked.
        if (promo && promoId) {
            store.dispatch(Actions.showContentModal({ isOpen: false }));

            this.fireTileTrackingEvent(eventName, promo, promoLocationId);
        }

        if (nextPageData) {
            analyticsUtils.setNextPageData(nextPageData);
        }
    };

    handleTriggerEventClick = async nextPageData => async () => await this.handleTriggerEvent(nextPageData);

    getNextPageData = internalCampaign => {
        if (internalCampaign) {
            return {
                internalCampaign: internalCampaign.toLowerCase()
            };
        }

        return null;
    };

    componentDidMount() {
        const { promo, promoLocationId } = this.props;
        const { promoId } = promo;

        // Determines if the promo needs to be tracked.
        if (promo && promoId) {
            this.handleViewableImpression(promo, promoLocationId);
        }
    }

    /* eslint-disable-next-line complexity */
    render() {
        const {
            isSkeleton, promo, isApplied, isPageRenderImg, localization
        } = this.props;

        const {
            sid,
            action,
            actionLabel,
            description,
            detailsAction,
            detailsActionLabel,
            eligibility,
            endDate,
            eligibilityEndDate,
            legalCopy,
            media,
            promoCode,
            threshold,
            title,
            personalizedPromoName
        } = promo;

        const insider = eligibility.includes('Insider');
        const vib = eligibility.includes('VIB');
        const isBiExclusive = eligibility.includes('Rouge', 'VIB', 'Insider');
        const apps = eligibility.includes('Apps');
        const inStore = eligibility.includes('In Store');
        const online = eligibility.includes('Online');
        const appOnly = apps && !online && !inStore;
        const storeOnly = !apps && !online && inStore;
        const onlineOnly = !apps && online && !inStore;
        const inStoreOrOnline = !apps && online && inStore;
        const hasChannel = appOnly || storeOnly || onlineOnly || inStoreOrOnline;

        const hasLink = Boolean(action?.targetUrl || action?.page);

        const localEndDate = new Date(endDate).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
        const localEligibilityEndDate = new Date(eligibilityEndDate).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
        const showMarkdown = !!Sephora.configurationSettings.isMarkdownLabelsEnabled;

        return (
            <ActionFlex
                // prevent button element if modal is set since there may be nested buttons
                is={hasLink ? 'a' : 'div'}
                sid={sid}
                height='100%'
                action={action}
                position='relative'
                flexDirection='column'
                fontSize='base'
                lineHeight='tight'
                backgroundColor='white'
                borderRadius={2}
                textAlign='left'
                boxShadow='light'
                overflow='hidden'
                minHeight={413}
                css={action ? styles.rootTransition : null}
                eventClick={async () => this.handleTriggerEventClick(this.getNextPageData(title || sid))}
            >
                {isSkeleton ? (
                    <div css={[styles.skeleton.image, SKELETON_ANIMATION]} />
                ) : (
                    <Media
                        {...media}
                        // override any size values producers may have set
                        width={CARD_WIDTH}
                        height={IMAGE_HEIGHT}
                        isContained={true}
                        isPageRenderImg={isPageRenderImg}
                    />
                )}
                <Flex
                    paddingTop={3}
                    paddingX={4}
                    paddingBottom={4}
                    flexDirection='column'
                    flex={1}
                >
                    <div>
                        {(title || isSkeleton) &&
                            (showMarkdown ? (
                                <Markdown
                                    fontWeight='bold'
                                    marginBottom={1}
                                    css={isSkeleton && [styles.skeleton.text, SKELETON_ANIMATION]}
                                    content={isSkeleton ? '&nbsp;' : title}
                                />
                            ) : (
                                <Text
                                    is='h3'
                                    fontWeight='bold'
                                    marginBottom={1}
                                    css={isSkeleton && [styles.skeleton.text, SKELETON_ANIMATION]}
                                    dangerouslySetInnerHTML={{
                                        __html: isSkeleton ? '&nbsp;' : title
                                    }}
                                />
                            ))}
                        {(description || isSkeleton) &&
                            (showMarkdown ? (
                                <Markdown
                                    marginBottom='.5em'
                                    css={isSkeleton && [styles.skeleton.text, SKELETON_ANIMATION]}
                                    content={isSkeleton ? '&nbsp;' : description}
                                />
                            ) : (
                                <Text
                                    is='p'
                                    marginBottom='.5em'
                                    css={isSkeleton && [styles.skeleton.text, SKELETON_ANIMATION]}
                                    dangerouslySetInnerHTML={{
                                        __html: isSkeleton ? '&nbsp;' : description
                                    }}
                                />
                            ))}
                        {(threshold || isSkeleton) && (
                            <Text
                                is='p'
                                color='gray'
                                fontSize='sm'
                                css={isSkeleton && [styles.skeleton.text, SKELETON_ANIMATION]}
                                dangerouslySetInnerHTML={{
                                    __html: isSkeleton ? '&nbsp;' : threshold
                                }}
                            />
                        )}
                        {isBiExclusive && (
                            <Text
                                is='p'
                                color='gray'
                                fontSize='sm'
                                letterSpacing={insider && '-.01em'}
                                children={insider ? localization.insider : vib ? localization.vib : localization.rouge}
                            />
                        )}
                        {(hasChannel || eligibilityEndDate) && (
                            <Text
                                is='p'
                                marginTop='.5em'
                                color='gray'
                                fontSize='sm'
                            >
                                {hasChannel && appOnly
                                    ? localization.appOnly
                                    : storeOnly
                                        ? localization.storeOnly
                                        : onlineOnly
                                            ? localization.onlineOnly
                                            : localization.inStoreOrOnline}
                                {hasChannel && eligibilityEndDate && ' • '}
                                {eligibilityEndDate && `${localization.ends} ${localEligibilityEndDate.split(',')[0]}`}
                            </Text>
                        )}
                        {(legalCopy || isSkeleton) &&
                            (showMarkdown ? (
                                <Markdown
                                    marginTop={!hasChannel && !endDate && '.5em'}
                                    color='gray'
                                    fontSize='sm'
                                    css={isSkeleton && [styles.skeleton.text, SKELETON_ANIMATION]}
                                    content={isSkeleton ? '&nbsp;' : legalCopy}
                                />
                            ) : (
                                <Text
                                    is='p'
                                    marginTop={!hasChannel && !endDate && '.5em'}
                                    color='gray'
                                    fontSize='sm'
                                    css={isSkeleton && [styles.skeleton.text, SKELETON_ANIMATION]}
                                    dangerouslySetInnerHTML={{
                                        __html: isSkeleton ? '&nbsp;' : legalCopy
                                    }}
                                />
                            ))}
                    </div>
                    <Flex
                        paddingTop={4}
                        marginTop='auto'
                        alignItems='center'
                        justifyContent='space-between'
                        minHeight={buttons.HEIGHT_SM + space[4]}
                    >
                        {isSkeleton && <div css={[styles.skeleton.button, SKELETON_ANIMATION]} />}
                        {promoCode && (
                            <Button
                                {...CTA_PROPS}
                                disabled={appOnly || storeOnly}
                                onClick={e => {
                                    e.preventDefault();

                                    // Prevent event bubbling and consequently
                                    // unintended page jump when applying/removing promo
                                    e.stopPropagation();

                                    if (isApplied) {
                                        promoUtils.removePromo(promoCode.toLowerCase(), null, title.toLowerCase(), sid);
                                    } else {
                                        this.handleTriggerEvent();
                                        promoUtils.applyPromo(
                                            promoCode.toLowerCase(),
                                            null,
                                            null,
                                            true,
                                            title.toLowerCase(),
                                            null,
                                            personalizedPromoName,
                                            sid
                                        );
                                    }
                                }}
                                paddingY={0}
                                css={{ position: 'relative' }}
                            >
                                {appOnly ? (
                                    localization.ctaAppOnly
                                ) : storeOnly ? (
                                    localization.ctaStoreOnly
                                ) : isApplied ? (
                                    <span>
                                        <Icon
                                            name='checkmark'
                                            size='1em'
                                            css={{
                                                position: 'absolute',
                                                transform: `translateX(calc(-100% - ${space[1]}px))`
                                            }}
                                        />
                                        {localization.ctaApplied}
                                        <Text
                                            fontSize='xs'
                                            fontWeight='normal'
                                            display='block'
                                            color='blue'
                                            children={localization.ctaRemove}
                                        />
                                    </span>
                                ) : (
                                    localization.ctaApply
                                )}
                            </Button>
                        )}
                        {hasLink && !promoCode && (
                            <Button
                                {...CTA_PROPS}
                                is='span'
                                children={actionLabel || action.title || localization.ctaUrl}
                                onClick={this.handleTriggerEvent}
                            />
                        )}
                        {detailsAction && (
                            <ActionLink
                                // prevent anchor within anchor (root element)
                                {...(hasLink && {
                                    useRedirect: true,
                                    eventClick: async e => {
                                        e.preventDefault();
                                        await this.handleTriggerEvent();
                                        e.stopPropagation();
                                    }
                                })}
                                {...(!hasLink &&
                                    detailsAction?.type === ACTION_TYPES.MODAL && {
                                    onClick: () => {
                                        Location.isOffersPage() && PromotionItemBindings.fireModalTracking(title || sid);
                                    }
                                })}
                                action={detailsAction}
                                analyticsNextPageData={this.getNextPageData(title || sid)}
                                color='blue'
                                paddingY={2}
                                marginLeft='auto'
                                textAlign='right'
                                lineHeight='none'
                                children={detailsActionLabel || detailsAction.title || localization.seeDetails}
                            />
                        )}
                    </Flex>
                </Flex>
                {endDate && this.getTimerFlag(localEndDate, localization)}
            </ActionFlex>
        );
    }
}

PromotionItem.propTypes = {
    promo: PropTypes.shape({
        action: PropTypes.object,
        description: PropTypes.string,
        detailsAction: PropTypes.object,
        eligibility: PropTypes.array,
        endDate: PropTypes.string,
        legalCopy: PropTypes.string,
        media: PropTypes.object,
        promoCode: PropTypes.string,
        promoId: PropTypes.string,
        sid: PropTypes.string,
        threshold: PropTypes.string,
        title: PropTypes.string
    }),
    localization: PropTypes.object.isRequired,
    isApplied: PropTypes.bool,
    isSkeleton: PropTypes.bool,
    isPageRenderImg: PropTypes.bool
};

PromotionItem.defaultProps = {};

const styles = {
    rootTransition: {
        '.no-touch &': {
            transition: 'transform .2s',
            '&:hover': {
                transform: `translateY(-${space[1]}px)`
            }
        }
    },
    skeleton: {
        image: {
            height: IMAGE_HEIGHT
        },
        text: {
            borderRadius: radii.full
        },
        button: {
            borderRadius: radii.full,
            height: buttons.HEIGHT_SM,
            width: BUTTON_WIDTH
        }
    }
};

export default wrapComponent(PromotionItem, 'PromotionItem', true);
