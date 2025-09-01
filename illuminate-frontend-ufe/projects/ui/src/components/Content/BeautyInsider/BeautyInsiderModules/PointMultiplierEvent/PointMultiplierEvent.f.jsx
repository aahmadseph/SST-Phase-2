import BeautyInsiderModuleLayout from 'components/Content/BeautyInsider/BeautyInsiderModuleLayout/BeautyInsiderModuleLayout';
import Flag from 'components/Flag/Flag';
import IconCheckmark from 'components/LegacyIcon/IconCheckmark';
import Markdown from 'components/Markdown/Markdown';
import {
    Box, Button, Divider, Flex, Image, Link, Text
} from 'components/ui';
import React from 'react';
import helpersUtils from 'utils/Helpers';
import promoUtils from 'utils/Promos';
import stringUtils from 'utils/String';
import analyticsConstants from 'analytics/constants';
import { wrapFunctionalComponent } from 'utils/framework';

const { replaceDoubleAsterisks } = helpersUtils;
const {
    ACTION_INFO: { APPLY_PROMO_POINTS_MULTIPLIER }
} = analyticsConstants;

import { globalModals, renderModal } from 'utils/globalModals';
const { POINT_MULTIPLIER_EVENT_INFO } = globalModals;

const removePromo = promoCode => {
    promoUtils.removePromo(promoCode);
};

const applyPromo = promoCode => {
    const { getBasicAnalyticsData } = promoUtils;
    promoUtils.getBasicAnalyticsData = (...args) => ({
        ...getBasicAnalyticsData(...args),
        actionInfo: APPLY_PROMO_POINTS_MULTIPLIER
    });
    const restoreOriginalFunction = () => (promoUtils.getBasicAnalyticsData = getBasicAnalyticsData);
    promoUtils
        .applyPromo(promoCode)
        .then(() => {
            restoreOriginalFunction();
        })
        .catch(restoreOriginalFunction);
};

const renderCallToAction = (isPromoCodeApplied, promoCode, localization) => {
    const { applied, remove, apply } = localization;

    return isPromoCodeApplied ? (
        <Button
            variant='secondary'
            hasMinWidth={true}
            onClick={e => {
                e.stopPropagation();
                removePromo(promoCode);
            }}
            name='applyBtn'
            marginTop={4}
            marginBottom={[4, 0]}
            width={['100%', 'auto']}
            data-at={Sephora.debug.dataAt('pfd_apply_in_basket')}
        >
            <Box>
                <Flex>
                    <IconCheckmark
                        fontSize='.875em'
                        marginRight={1}
                    />
                    <Text
                        css={{ textTransform: 'capitalize' }}
                        data-at={Sephora.debug.dataAt('pm_applied_label')}
                        fontWeight='bold'
                        children={applied}
                    />
                </Flex>
                <Link
                    color='blue'
                    padding={2}
                    margin={-2}
                    css={{ textTransform: 'capitalize' }}
                    fontWeight='normal'
                    onClick={e => {
                        e.stopPropagation();
                        removePromo(promoCode);
                    }}
                    data-at={Sephora.debug.dataAt('pm_remove_label')}
                    children={remove}
                />
            </Box>
        </Button>
    ) : (
        <Button
            variant='secondary'
            hasMinWidth={true}
            onClick={() => {
                applyPromo(promoCode);
            }}
            name='applyBtn'
            marginTop={4}
            marginBottom={[4, 0]}
            width={['100%', 'auto']}
            data-at={Sephora.debug.dataAt('pfd_apply_in_basket')}
            children={apply}
        />
    );
};

const leftContentZone = (content, isPromoCodeApplied, localization) => {
    const { promoEndDate, promoCode, userMultiplier, pointMultiplierContentMsg } = content;
    const { perDollar, ends } = localization;

    return (
        <Box width={['100%', 'auto']}>
            <Flag children={stringUtils.format(ends, promoEndDate)} />
            <Image
                display='block'
                height={20}
                marginTop={3}
                src={`/img/ufe/bi/BI-${userMultiplier?.userType.toLowerCase()}.svg`}
                data-at={Sephora.debug.dataAt('pm_user_status')}
                alt={userMultiplier.userType}
            />
            <Text
                is='p'
                fontSize={[32, 40]}
                fontWeight='bold'
                marginTop={1}
                data-at={Sephora.debug.dataAt('max_pfd_eligible_value')}
            >
                {userMultiplier.multiplier}
                <Text
                    children={` ${perDollar}`}
                    fontSize='base'
                    fontWeight='normal'
                />
            </Text>
            <Markdown
                marginTop={3}
                data-at={Sephora.debug.dataAt('pm_coupon_msg')}
                content={replaceDoubleAsterisks(pointMultiplierContentMsg)}
            />
            {renderCallToAction(isPromoCodeApplied, promoCode, localization)}
        </Box>
    );
};

const rightContentZone = (content, localization) => {
    const { pointMultiplierHeading, userLevelPointMultiplier } = content;

    return (
        <Box
            backgroundColor='nearWhite'
            height='100%'
            borderRadius={2}
        >
            <Box padding={4}>
                <Markdown
                    data-at={Sephora.debug.dataAt('pm_event_details_label')}
                    content={replaceDoubleAsterisks(pointMultiplierHeading)}
                />
                {userLevelPointMultiplier.map(userLevel => (
                    <div
                        data-at={Sephora.debug.dataAt('pfd_points_label')}
                        key={`pm_${userLevel.userType.toLowerCase()}_level`}
                    >
                        <Divider marginY={3} />
                        <b>{userLevel.userType}:</b> {userLevel.multiplier}{' '}
                        <Text
                            css={{ textTransform: 'lowercase' }}
                            children={` ${localization.perDollar}`}
                        />
                    </div>
                ))}
            </Box>
        </Box>
    );
};

const PointMultiplierEvent = ({
    content, showMediaModal, isPromoCodeApplied, localization, globalModals: globalModalsData
}) => {
    const headerCta = () => renderModal(globalModalsData[POINT_MULTIPLIER_EVENT_INFO], showMediaModal);

    return (
        <BeautyInsiderModuleLayout
            title={localization.pointMultiplierEventTitle}
            headerCtaTitle={localization.details}
            headerCta={headerCta}
            leftContentZone={leftContentZone(content, isPromoCodeApplied, localization)}
            rightContentZone={rightContentZone(content, localization)}
        />
    );
};

export default wrapFunctionalComponent(PointMultiplierEvent, 'PointMultiplierEvent');
