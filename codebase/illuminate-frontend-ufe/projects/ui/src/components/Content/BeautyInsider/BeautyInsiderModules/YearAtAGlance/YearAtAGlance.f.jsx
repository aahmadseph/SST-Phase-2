import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Box, Image, Text, Button, Grid, Flex
} from 'components/ui';
import { space } from 'style/config';
import urlUtils from 'utils/Url';
import BeautyInsiderModuleLayout from 'components/Content/BeautyInsider/BeautyInsiderModuleLayout/BeautyInsiderModuleLayout';
import localeUtils from 'utils/LanguageLocale';
import { IGNORE_YEAR_AT_A_GLANCE_ITEMS } from 'constants/beautyInsiderModules';

const imageSources = {
    cashApplied: '/img/ufe/icons/points-cash.svg',
    dollarsSaved: '/img/ufe/icons/saving.svg',
    referralPtsEarned: '/img/ufe/icons/refer.svg',
    rougeRcDollar: '/img/ufe/icons/rouge-rewards.svg',
    ccRewards: '/img/ufe/icons/cc.svg'
};
const getText = localeUtils.getLocaleResourceFile('components/Content/BeautyInsider/BeautyInsiderModules/YearAtAGlance/locales', 'YearAtAGlance');

const renderItem = (key, item) => {
    return (
        <Flex
            alignItems='center'
            flexBasis='auto'
        >
            <Image
                src={imageSources[key]}
                width={32}
                height={32}
            />
            <span css={styles.label}>{getText(key)}</span>
            <span css={styles.pts}>{item.text}</span>
        </Flex>
    );
};

const contentZone = (shouldDisplayDefault, itemsToRender, content) => {
    if (shouldDisplayDefault) {
        return (
            <Box>
                <Image
                    size={[48, 120]}
                    marginBottom={2}
                    src='/img/ufe/no-rewards.svg'
                />
                <Text
                    is='p'
                    children={getText('yearEarnings', [content.year])}
                />
                <Text
                    is='p'
                    marginTop={3}
                    children={getText('keepShopping')}
                />
                <Button
                    variant='secondary'
                    hasMinWidth={true}
                    onClick={() => {
                        urlUtils.redirectTo('/');
                    }}
                    name='applyBtn'
                    marginTop={3}
                    marginBottom={[4, 0]}
                    children={getText('shopNow')}
                    width={['100%', 'auto']}
                />
            </Box>
        );
    } else {
        return (
            <Box>
                <Grid
                    gridAutoFlow={['row', 'column']}
                    css={{
                        gridTemplateRows: 'repeat(3, 1fr)'
                    }}
                    gap={4}
                >
                    {Object.keys(itemsToRender).map(item => renderItem(item, itemsToRender[item]))}
                </Grid>
            </Box>
        );
    }
};

const YearAtAGlance = ({ content, bankRewards }) => {
    const rewardsTotal = bankRewards?.ytdRewardsEarned || bankRewards?.YTDRewardsEarned;

    if (!content) {
        return null;
    }

    const { rougeRcDollar = {}, dollarsSaved = {}, cashApplied = {}, referralPtsEarned = {} } = content || {};
    const rougeRcDollarValue = rougeRcDollar.value;
    const dollarsSavedValue = dollarsSaved.value;
    const cashAppliedValue = cashApplied.value;
    const referralPointsEarned = referralPtsEarned.value;
    const hasCCRewards = rewardsTotal > 0;

    const itemsToRender = {};

    Object.keys(content || {})?.forEach(item => {
        if (content[item].value && !IGNORE_YEAR_AT_A_GLANCE_ITEMS.includes(item)) {
            itemsToRender[item] = content[item];
        }
    });

    if (hasCCRewards) {
        itemsToRender.ccRewards = {
            text: `$${rewardsTotal}`,
            value: rewardsTotal
        };
    }

    const shouldDisplayDefault = !rougeRcDollarValue && !dollarsSavedValue && !cashAppliedValue && !referralPointsEarned && !hasCCRewards;

    return (
        <BeautyInsiderModuleLayout
            title={getText('yearGlance', [content.year])}
            isSingleContentZone={true}
            content={contentZone(shouldDisplayDefault, itemsToRender, content)}
        />
    );
};

const styles = {
    label: {
        flex: 1,
        textAlign: 'left',
        marginLeft: space[3],
        marginRight: space[3]
    },
    pts: {
        fontWeight: 'var(--font-weight-bold)',
        textAlign: 'right'
    }
};

export default wrapFunctionalComponent(YearAtAGlance, 'YearAtAGlance');
