import analyticsConstants from 'analytics/constants';
import analyticsUtils from 'analytics/utils';
import BeautyInsiderModuleLayout from 'components/Content/BeautyInsider/BeautyInsiderModuleLayout/BeautyInsiderModuleLayout';
import Flag from 'components/Flag/Flag';
import {
    Box, Button, Divider, Text
} from 'components/ui';
import React from 'react';
import stringUtils from 'utils/String';
import urlUtils from 'utils/Url';
import { wrapFunctionalComponent } from 'utils/framework';

const {
    LinkData: { PFD_APPLY }
} = analyticsConstants;

const handleApplyClick = () => {
    const prop55 = PFD_APPLY;
    analyticsUtils.setNextPageData({
        pageName: digitalData.page.attributes.sephoraPageInfo.pageName,
        pageType: digitalData.page.category.pageType,
        linkData: prop55
    });
    urlUtils.redirectTo('/basket');
};

const leftContentZone = (eligiblePoint, eligibleValue, promoEndDate, localization) => {
    const { ends, eligible, points, apply } = localization;

    return (
        <Box width={['100%', 'auto']}>
            <Flag children={stringUtils.format(ends, promoEndDate)} />
            <Text
                is='p'
                marginTop={3}
                children={eligible}
            />
            <Text
                is='p'
                fontSize={[32, 40]}
                fontWeight='bold'
                marginTop={1}
                marginBottom={4}
                data-at={Sephora.debug.dataAt('max_pfd_eligible_value')}
            >
                {eligibleValue}
                <Text
                    children=' off'
                    fontSize={24}
                />
                <Text
                    children={` (${eligiblePoint} ${points})`}
                    fontSize='base'
                    fontWeight='normal'
                />
            </Text>
            <Button
                variant='secondary'
                hasMinWidth={true}
                onClick={() => {
                    handleApplyClick();
                }}
                name='applyBtn'
                marginBottom={[4, 4, 0]}
                width={['100%', 'auto']}
                data-at={Sephora.debug.dataAt('pfd_apply_in_basket')}
                children={apply}
            />
        </Box>
    );
};

const rightContentZone = (availablePFDPromotions = [], localization) => {
    const { eventDetails, points } = localization;

    return (
        <Box
            backgroundColor='nearWhite'
            height='100%'
            borderRadius={2}
        >
            <Box padding={4}>
                <Text
                    is='h4'
                    fontWeight='bold'
                    children={eventDetails}
                />
                {availablePFDPromotions.map(promotion => (
                    <div
                        data-at={Sephora.debug.dataAt('pfd_points_label')}
                        key={`pfd_${promotion.point}_level`}
                    >
                        <Divider marginY={3} />
                        <Text is='p'>
                            <Text fontWeight='bold'>{`${promotion.value} off:`}</Text>
                            <Text children={` ${promotion.point} ${points}`} />
                        </Text>
                    </div>
                ))}
            </Box>
        </Box>
    );
};

const PointsForDiscount = ({ content, showMediaModal, localization }) => {
    return (
        <BeautyInsiderModuleLayout
            title={localization.pointsForDiscountEventTitle}
            headerCtaTitle={localization.viewDetails}
            headerCta={showMediaModal}
            leftContentZone={leftContentZone(content.eligiblePoint, content.eligibleValue, content.pfdPromoEndDate, localization)}
            rightContentZone={rightContentZone(content.availablePFDPromotions, localization)}
        />
    );
};

export default wrapFunctionalComponent(PointsForDiscount, 'PointsForDiscount');
