import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Box, Flex, Button, Grid, Link, Text
} from 'components/ui';
import localeUtils from 'utils/LanguageLocale';
import store from 'store/Store';
import actions from 'Actions';
import { COLORIQ_BP_PAGE_COMPONENT_NAME } from 'constants/beautyPreferences';
import ColorIQContentWorld from 'components/BeautyPreferencesWorld/Refinement/ColorIQContentWorld';

function ColorIQRefinementDisplay({ colorIQ, showSkip, onSkipClick, isExpanded }) {
    const getColorMatchUrl = colorIQData => {
        if (colorIQData.length > 0 && colorIQData[0].labValue) {
            const [l, a, b] = colorIQData[0].labValue.split(',');

            return `/beauty/makeup-color-match?l=${l}&a=${a}&b=${b}`;
        }

        return '/beauty/makeup-color-match';
    };

    const noColorIQSavedView = () => {
        const getText = localeUtils.getLocaleResourceFile('components/BeautyPreferencesWorld/Refinement/locales', 'Refinement');

        const openShadeFinderModal = () => {
            store.dispatch(actions.showWizard(true, undefined, COLORIQ_BP_PAGE_COMPONENT_NAME));
        };

        return (
            <Flex
                flexDirection='column'
                justifyContent={['center', null, 'flex-start']}
                alignItems={['center', null, 'flex-start']}
                width='100%'
                height='100%'
                css={{ display: 'inline-flex' }}
            >
                <Box width={['343px', null, '455px']}>
                    <Text as='span'>{getText('useOur')}</Text>
                    <Text as='span'>
                        <Link
                            color='blue'
                            underline={true}
                            onClick={openShadeFinderModal}
                            css={styles.skipLinkButton}
                        >
                            {getText('shadeFinder')}
                        </Link>
                        {getText('toDiscover')}
                    </Text>
                </Box>

                {showSkip && (
                    <Flex
                        width={['343px', null, '450px']}
                        justifyContent='center'
                        alignItems='center'
                    >
                        <Button
                            variant='link'
                            onClick={onSkipClick}
                            css={styles.skipLinkButton}
                        >
                            {getText('skipThisQuestion')}
                        </Button>
                    </Flex>
                )}
            </Flex>
        );
    };

    // Filter for recent Color IQ entries if the data includes isRecent flags
    const recentColorIQ =
        colorIQ && Array.isArray(colorIQ)
            ? colorIQ.filter(item => {
                const hasIsRecentProp = Object.prototype.hasOwnProperty.call(item, 'isRecent');
                const isRecentValue = item.isRecent;
                const passesFilter = !hasIsRecentProp || isRecentValue === 'Y' || isRecentValue === true;

                return passesFilter;
            })
            : [];

    const hasColorIQ = recentColorIQ.length > 0;
    const hasColorIQExpandedView = () => {
        const getText = localeUtils.getLocaleResourceFile('components/BeautyPreferencesWorld/Refinement/locales', 'Refinement');

        const openShadeFinderModal = () => {
            store.dispatch(actions.showWizard(true, undefined, COLORIQ_BP_PAGE_COMPONENT_NAME));
        };

        return (
            <Flex
                flexDirection='column'
                justifyContent={['center', null, 'flex-start']}
                alignItems={['center', null, 'flex-start']}
                width='100%'
                height='100%'
                css={{ display: 'inline-flex' }}
            >
                <Box
                    width={['343px', null, '450px']}
                    css={styles.shareFinderBox}
                >
                    <Text as='span'>
                        {getText('useOur')}
                        <Button
                            onClick={openShadeFinderModal}
                            css={styles.linkButton}
                        >
                            {getText('shadeFinder')}
                        </Button>
                        {getText('toDiscover')}
                    </Text>
                </Box>

                {/* Color IQ Cards */}
                <Box
                    width='100%'
                    marginBottom='16px'
                >
                    <Grid
                        columns={[1, null, 2]}
                        columnGap={4}
                        maxWidth='100%'
                    >
                        <ColorIQContentWorld
                            colorIQ={recentColorIQ}
                            allColorIQ={colorIQ}
                        />
                    </Grid>
                </Box>

                {/* Shop Matching Products Link */}
                <Box
                    width='100%'
                    css={styles.shopLinkContainer}
                >
                    <Link
                        href={getColorMatchUrl(recentColorIQ)}
                        variant='link'
                        style={styles.shopLink}
                    >
                        {getText('colorIQLink')}
                    </Link>
                </Box>
            </Flex>
        );
    };

    // When expanded and has Color IQ data, show the expanded view
    if (isExpanded && hasColorIQ) {
        return <>{hasColorIQExpandedView()}</>;
    }

    // Show saved Color IQ data when available (collapsed view)
    if (hasColorIQ) {
        return (
            <Grid
                columns={[1, null, 2]}
                columnGap={4}
                maxWidth='100%'
            >
                <ColorIQContentWorld
                    colorIQ={recentColorIQ}
                    allColorIQ={colorIQ}
                />
            </Grid>
        );
    }

    // Show the no Color IQ saved view
    return <>{noColorIQSavedView()}</>;
}

const styles = {
    shareFinderBox: {
        color: '#666',
        fontSize: '14px',
        fontFamily: 'Helvetica Neue',
        fontWeight: '400',
        lineHeight: '18px',
        wordWrap: 'break-word',
        marginBottom: '16px'
    },
    linkButton: {
        background: 'none',
        border: 'none',
        color: '#136BEA',
        fontSize: '14px',
        fontFamily: 'Helvetica Neue',
        fontWeight: '400',
        textDecoration: 'underline',
        lineHeight: '18px',
        wordWrap: 'break-word',
        cursor: 'pointer',
        padding: 0,
        margin: '0 0 -1rem 0'
    },
    skipLinkButton: {
        textDecoration: 'none',
        borderBottom: '0',
        borderBottomColor: 'transparent',
        borderBottomStyle: 'none',
        cursor: 'pointer',
        '&:hover': { textDecoration: 'underline' }
    },
    shopLinkContainer: {
        color: '#136BEA',
        fontSize: '12px',
        fontFamily: 'Helvetica Neue',
        fontWeight: '400',
        lineHeight: '14px',
        wordWrap: 'break-word'
    },
    shopLink: {
        color: '#136BEA',
        fontSize: '12px',
        fontFamily: 'Helvetica Neue',
        fontWeight: '400',
        lineHeight: '14px',
        textDecoration: 'underline',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        margin: 0
    }
};

export default wrapFunctionalComponent(ColorIQRefinementDisplay, 'ColorIQRefinementDisplay');
