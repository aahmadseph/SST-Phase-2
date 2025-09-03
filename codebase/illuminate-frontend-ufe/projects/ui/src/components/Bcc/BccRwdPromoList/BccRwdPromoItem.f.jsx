import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { space, buttons, radii } from 'style/config';
import {
    Button, Flex, Image, Link, Text, Icon
} from 'components/ui';
import promoUtils from 'utils/Promos';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import store from 'Store';
import actions from 'Actions';
import UrlUtils from 'utils/Url';
import anaUtils from 'analytics/utils';
import UiUtils from 'utils/UI';
import Flag from 'components/Flag';
import anaConsts from 'analytics/constants';
import { CARD_WIDTH } from 'constants/promotionCard';
import ImageUtils from 'utils/Image';

const { getLocaleResourceFile } = LanguageLocaleUtils;
const { redirectTo, getLink, addInternalTracking } = UrlUtils;
const { SKELETON_ANIMATION } = UiUtils;
const { getImageSrc } = ImageUtils;

const getText = getLocaleResourceFile('components/Bcc/BccRwdPromoList/locales', 'BccRwdPromoItem');

const IMAGE_HEIGHT = 180;
const BUTTON_WIDTH = 112;

const CTA_PROPS = {
    size: 'sm',
    variant: 'secondary',
    minWidth: BUTTON_WIDTH
};

const ONE_DAY = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

function getTimerFlag(endDate) {
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
                {daysLeft <= 0 ? getText('lastDay') : `${daysLeft} ${getText(daysLeft === 1 ? 'dayLeft' : 'daysLeft')}`}
            </Flag>
        );
    } else {
        return null;
    }
}

/* eslint-disable-next-line complexity */
function BccRwdPromoItem({
    isSkeleton, promo, isApplied, isPageRenderImg, offerCategoryTitle, isPersonalizedBeautyOffers
}) {
    const {
        titleText,
        description,
        threshold,
        promoCode,
        rouge,
        vib,
        insider,
        legalCopy,
        endDate,
        seeDetails,
        modalComponent,
        apps,
        online,
        inStore,
        name,
        ctaButtonName
    } = promo;

    const isBiExclusive = rouge || vib || insider;
    const appOnly = apps && !online && !inStore;
    const storeOnly = !apps && !online && inStore;
    const onlineOnly = !apps && online && !inStore;
    const inStoreAndOnline = !apps && online && inStore;
    const hasChannel = appOnly || storeOnly || onlineOnly || inStoreAndOnline;
    const categoryTitle = isPersonalizedBeautyOffers ? anaConsts.CONTEXT.BEAUTY_OFFERS : offerCategoryTitle?.toLowerCase();

    const redirectWithTracking = seeDetailsUrl => {
        anaUtils.setNextPageData({
            internalCampaign: titleText.toLowerCase()
        });

        store.dispatch(actions.showContentModal({ isOpen: false }));
        redirectTo(seeDetailsUrl);
    };

    let { targetUrl } = promo;

    if (targetUrl?.indexOf('icid2=') === -1) {
        targetUrl = addInternalTracking(targetUrl, [name]);
    }

    const localEndDate = isPersonalizedBeautyOffers ? endDate : new Date(endDate).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
    const formattedLocalDate = isPersonalizedBeautyOffers ? localEndDate?.split(' ')[0] : localEndDate?.split(',')[0];

    return (
        <Flex
            href={getLink(targetUrl)}
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
            css={{
                '.no-touch &': {
                    transition: 'transform .2s',
                    '&:hover': {
                        transform: `translateY(-${space[1]}px)`
                    }
                }
            }}
        >
            {isSkeleton ? (
                <div css={[styles.skeleton.image, SKELETON_ANIMATION]} />
            ) : (
                <Image
                    src={getImageSrc(promo.imagePath, CARD_WIDTH)}
                    srcSet={getImageSrc(promo.imagePath, CARD_WIDTH, true)}
                    alt={promo.imageAltTxt}
                    display='block'
                    width='100%'
                    height={IMAGE_HEIGHT}
                    css={{ objectFit: 'contain' }}
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
                    {(titleText || isSkeleton) && (
                        <Text
                            is='h3'
                            fontWeight='bold'
                            marginBottom={1}
                            css={isSkeleton && [styles.skeleton.text, SKELETON_ANIMATION]}
                            dangerouslySetInnerHTML={{
                                __html: isSkeleton ? '&nbsp;' : titleText
                            }}
                        />
                    )}
                    {(description || isSkeleton) && (
                        <Text
                            is='p'
                            marginBottom='.5em'
                            css={isSkeleton && [styles.skeleton.text, SKELETON_ANIMATION]}
                            dangerouslySetInnerHTML={{
                                __html: isSkeleton ? '&nbsp;' : description
                            }}
                        />
                    )}
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
                            children={getText(insider ? 'insider' : vib ? 'vib' : 'rouge')}
                        />
                    )}
                    {(hasChannel || endDate) && (
                        <Text
                            is='p'
                            marginTop='.5em'
                            color='gray'
                            fontSize='sm'
                        >
                            {hasChannel && getText(appOnly ? 'appOnly' : storeOnly ? 'storeOnly' : onlineOnly ? 'onlineOnly' : 'inStoreAndOnline')}
                            {hasChannel && endDate && ' • '}
                            {endDate && `${getText('ends')} ${formattedLocalDate}`}
                        </Text>
                    )}
                    {(legalCopy || isSkeleton) && (
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
                    )}
                </div>
                <Flex
                    paddingTop={4}
                    marginTop='auto'
                    alignItems='center'
                    justifyContent='space-between'
                >
                    {isSkeleton && <div css={[styles.skeleton.button, SKELETON_ANIMATION]} />}
                    {promoCode && (
                        <Button
                            {...CTA_PROPS}
                            disabled={appOnly || storeOnly}
                            onClick={e => {
                                e.preventDefault();
                                promoUtils[isApplied ? 'removePromo' : 'applyPromo'](
                                    promoCode.toLowerCase(),
                                    null,
                                    null,
                                    true,
                                    titleText.toLowerCase(),
                                    categoryTitle
                                );
                            }}
                            paddingY={0}
                            css={{ position: 'relative' }}
                        >
                            {appOnly ? (
                                getText('ctaAppOnly')
                            ) : storeOnly ? (
                                getText('ctaStoreOnly')
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
                                    {getText('ctaApplied')}
                                    <Text
                                        fontSize='xs'
                                        fontWeight='normal'
                                        display='block'
                                        color='blue'
                                        children={getText('ctaRemove')}
                                    />
                                </span>
                            ) : (
                                getText('ctaApply')
                            )}
                        </Button>
                    )}
                    {targetUrl && !promoCode && (
                        <Button
                            {...CTA_PROPS}
                            is='span'
                            children={ctaButtonName || getText('ctaUrl')}
                        />
                    )}
                    {(seeDetails || modalComponent) && (
                        <Link
                            // prevent anchor within anchor (root element)
                            {...(targetUrl || modalComponent
                                ? {
                                    onClick: e => {
                                        e.preventDefault();

                                        if (modalComponent) {
                                            store.dispatch(
                                                actions.showBccModal({
                                                    isOpen: true,
                                                    bccModalTemplate: modalComponent
                                                })
                                            );
                                        } else {
                                            redirectWithTracking(seeDetails);
                                        }
                                    }
                                }
                                : {
                                    onClick: e => {
                                        e.preventDefault();
                                        redirectWithTracking(seeDetails);
                                    }
                                })}
                            color='blue'
                            padding={2}
                            margin={-2}
                            textAlign='right'
                            lineHeight='none'
                            children={getText('seeDetails')}
                        />
                    )}
                </Flex>
            </Flex>
            {endDate && getTimerFlag(localEndDate)}
        </Flex>
    );
}

const styles = {
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

export default wrapFunctionalComponent(BccRwdPromoItem, 'BccRwdPromoItem');
