import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Text, Flex, Box, Button, Divider
} from 'components/ui';
import { mediaQueries, space } from 'style/config';
import BeautyInsiderModuleLayout from 'components/Content/BeautyInsider/BeautyInsiderModuleLayout/BeautyInsiderModuleLayout';
import analyticsUtils from 'analytics/utils';
import analyticsConstants from 'analytics/constants';
import urlUtils from 'utils/Url';
import BasketUtils from 'utils/Basket';
import localeUtils from 'utils/LanguageLocale';
import promoUtils from 'utils/Promos';
import rougeUtils from 'utils/rougeExclusive';
import InfoButton from 'components/InfoButton/InfoButton';
import RougeExclusiveBadge from 'components/Badges/RougeExclusiveBadge';
import resourceWrapper from 'utils/framework/resourceWrapper';
import { globalModals, renderModal } from 'utils/globalModals';

const { BEAUTY_INSIDER_CASH_INFO } = globalModals;
const { getLocaleResourceFile } = localeUtils;
const {
    LinkData: { BI_CASH_APPLY }
} = analyticsConstants;

const style = {
    biCashOptionContainer: { flex: '1' },
    biCashCardContainer: {
        justifyContent: 'space-between',
        [mediaQueries.xsMax]: {
            flexDirection: 'column'
        }
    },
    biCashValueContainer: {
        display: 'flex',
        alignItems: 'baseline',
        gap: space[2]
    }
};

const getText = resourceWrapper(
    getLocaleResourceFile('components/Content/BeautyInsider/BeautyInsiderModules/BiCashOptions/locales', 'BiCashOptions')
);

const getEligibleDollarValue = eligibleValue => {
    const isFrench = localeUtils.isFrench();
    const eligibleValueNum = Number(BasketUtils.removeCurrency(eligibleValue));

    const dollarSign = (
        <Text
            key='dollarSign'
            fontSize={[32, 40]}
            children={'$'}
        />
    );

    return (
        <Text
            is='p'
            fontSize={[32, 40]}
            fontWeight='bold'
        >
            {isFrench || dollarSign}
            {eligibleValueNum}
            {isFrench && dollarSign}
            <Text
                letterSpacing='normal'
                fontSize={24}
                children={` ${getText('off')}`}
            />
        </Text>
    );
};

const pointsMessage = numberOfPoints => (
    <Text is='p'>
        {getText('apply')}{' '}
        <Text
            fontWeight='bold'
            children={getText('pointsNumber', false, numberOfPoints)}
        />{' '}
        {getText('purchase')}
    </Text>
);

const BiCashOptionsTable = ({ availablePromotions }) => (
    <Box
        backgroundColor='nearWhite'
        height='100%'
        borderRadius={2}
        css={style.biCashOptionContainer}
    >
        <Box padding={4}>
            <Text
                fontWeight='bold'
                data-at={Sephora.debug.dataAt('bi_cash_options_table_label')}
                children={getText('BICashOptions')}
            />
            {availablePromotions.map(biCashOption => (
                <div
                    data-at={Sephora.debug.dataAt('bi_cash_option_label')}
                    key={`bi_cash_${biCashOption.value}_value`}
                >
                    <Divider marginY={3} />
                    <b>{`${biCashOption.value} ${getText('off')}`}:</b> {getText('pointsNumber', false, biCashOption.point)}{' '}
                    {biCashOption.segmentExclusive && rougeUtils.isRougeCashFlagEnabled ? <RougeExclusiveBadge /> : null}
                </div>
            ))}
        </Box>
    </Box>
);

const contentZone = ({
    eligibleCBRCount, eligiblePoint, eligibleValue, missingPoints, thresholdValue, availablePromotions
}) => {
    const messages = [];

    if (eligibleCBRCount > 0) {
        messages[0] = pointsMessage(eligiblePoint);
        messages[1] = getEligibleDollarValue(eligibleValue);
    } else {
        // if user is ${thresholdValue} points away or less from the lowest CBR available
        if (missingPoints <= thresholdValue) {
            messages[0] = getText(
                'missingPointsClose',
                false,
                missingPoints,
                missingPoints > 1 ? getText('pointsText') : getText('pointText'),
                eligibleValue
            );
            messages[1] = getText('onceYouEarn', false, eligiblePoint, eligibleValue);
            // if user is more than ${thresholdValue} points away from the lowest CBR available
        } else {
            messages[0] = getText('onceYouEarn', false, eligiblePoint, eligibleValue);
            messages[1] = getText('cashWillApplyHere');
        }

        messages[0] = (
            <Text
                is='h3'
                fontSize='md'
                children={messages[0]}
            />
        );
        messages[1] = (
            <Text
                is={'div'}
                marginTop={4}
                marginBottom={2}
                children={messages[1]}
            />
        );
    }

    const [ctaLabel, ctaHref, ctaDataAt] =
        eligibleCBRCount > 0 ? ['applyInBasket', '/basket', 'bi_cash_apply_btn'] : ['shopToEarnPoints', '/', 'bi_cash_shop_btn'];
    const isElegibleBiCashOptionExclusive =
        promoUtils.isElegibleBiCashOptionExclusive({ eligibleCBRCount, availablePromotions, eligiblePoint }) && rougeUtils.isRougeCashFlagEnabled;

    const biCashCardCallToAction = () => {
        analyticsUtils.setNextPageData({ linkData: BI_CASH_APPLY });
        urlUtils.redirectTo(ctaHref);
    };

    const BiCashValue = () => (
        <Box css={style.biCashValueContainer}>
            {messages[1]}
            {isElegibleBiCashOptionExclusive && <RougeExclusiveBadge />}
        </Box>
    );

    return (
        <Flex
            width={['100%', 'auto']}
            css={style.biCashCardContainer}
        >
            <Box css={style.biCashOptionContainer}>
                {messages[0]}
                <BiCashValue />
                <Button
                    variant='secondary'
                    hasMinWidth={true}
                    onClick={biCashCardCallToAction}
                    name='applyBtn'
                    marginTop={4}
                    marginBottom={[4, 0]}
                    data-at={Sephora.debug.dataAt(ctaDataAt)}
                    children={getText(ctaLabel)}
                    width={['100%', 'auto']}
                />
            </Box>
            {eligibleCBRCount > 0 && availablePromotions?.length > 1 && <BiCashOptionsTable availablePromotions={availablePromotions} />}
        </Flex>
    );
};

const BiCashOptions = ({ content, showTermsAndConditionsModal, globalModals: globalModalsData }) => {
    const headerCtaTitle = () => {
        return (
            <InfoButton
                onClick={() => renderModal(globalModalsData[BEAUTY_INSIDER_CASH_INFO], showTermsAndConditionsModal)}
                size={20}
            />
        );
    };

    return (
        <BeautyInsiderModuleLayout
            title={getText('BICash')}
            headerCtaTitle={headerCtaTitle}
            isSingleContentZone={true}
            content={contentZone(content)}
        />
    );
};

export default wrapFunctionalComponent(BiCashOptions, 'BiCashOptions');
