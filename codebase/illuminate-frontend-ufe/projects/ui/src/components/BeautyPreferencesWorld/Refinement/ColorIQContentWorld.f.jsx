import React from 'react';
import { wrapComponent } from 'utils/framework';
import { Text, Box, Flex } from 'components/ui';
import BaseClass from 'components/BaseClass';
import ColorIQHistoryWorld from 'components/BeautyPreferencesWorld/Refinement/ColorIQHistoryWorld';
import localeUtils from 'utils/LanguageLocale';
import DateUtils from 'utils/Date';

class ColorIQContentWorld extends BaseClass {
    state = {
        isColorIQHistoryOpen: false
    };

    openColorIQHistory = e => {
        e.stopPropagation();
        e.preventDefault();
        this.setState({ isColorIQHistoryOpen: true });
    };

    closeColorIQHistory = () => {
        this.setState({ isColorIQHistoryOpen: false });
    };

    render() {
        const { colorIQ, allColorIQ } = this.props;

        if (!colorIQ || !Array.isArray(colorIQ) || colorIQ.length === 0) {
            return null;
        }

        const latestColorIQ = colorIQ[0]; // Most recent Color IQ
        // Use allColorIQ (unfiltered) to determine if there are multiple entries total
        const hasMultipleColorIQ = (allColorIQ && allColorIQ.length > 1) || colorIQ.length > 1;
        const displayDate = latestColorIQ.createDate || latestColorIQ.creationDate;

        // Normalize to MM/DD/YYYY immediately so UI shows correct format without a page refresh
        const formattedDisplayDate = displayDate ? DateUtils.getDateInMDYFromString(displayDate) : '';

        const getText = localeUtils.getLocaleResourceFile('components/BeautyPreferencesWorld/Refinement/locales', 'Refinement');

        return (
            <>
                <Flex
                    boxShadow='light'
                    padding={3}
                    borderRadius={2}
                    alignItems='center'
                    backgroundColor='white'
                    width='100%'
                    position='relative'
                >
                    {/* Color Swatch */}
                    <Box
                        size={['24px', null, '36px']}
                        borderRadius='full'
                        backgroundColor={latestColorIQ.hexCode || latestColorIQ.hexValue}
                        flexShrink={0}
                        alignSelf='baseline'
                    />

                    {/* Shade Information */}
                    <Flex
                        flexDirection='column'
                        marginLeft={2}
                        flex={1}
                    >
                        <Text
                            fontWeight='normal'
                            fontSize='14px'
                            lineHeight='18px'
                            color='black'
                        >
                            {latestColorIQ.description || latestColorIQ.shadeDesc || latestColorIQ.value}
                        </Text>

                        {displayDate && (
                            <Text
                                color='gray'
                                fontSize={['sm', null, '11px']}
                                marginTop='.5em'
                                data-debug='Sam1'
                            >
                                {getText('captured')} {formattedDisplayDate || displayDate}
                                {latestColorIQ.storeName && ` at ${latestColorIQ.storeName}`}
                            </Text>
                        )}
                    </Flex>

                    {/* View All Link - shown when user has multiple Color IQ entries */}
                    {hasMultipleColorIQ && (
                        <Box
                            position='absolute'
                            bottom={2}
                            right={2}
                        >
                            <Text
                                color='#136BEA'
                                fontSize={['sm', null, '11px']}
                                underline={true}
                                fontWeight='normal'
                                cursor='pointer'
                                onClick={this.openColorIQHistory}
                            >
                                {getText('viewAll')}
                            </Text>
                        </Box>
                    )}
                </Flex>

                {/* Color IQ History Modal */}
                {hasMultipleColorIQ && (
                    <ColorIQHistoryWorld
                        colorIQ={allColorIQ || colorIQ}
                        close={this.closeColorIQHistory}
                        isOpen={this.state.isColorIQHistoryOpen}
                        colorIQHistoryTitle={getText('colorIQHistoryTitle')}
                        captured={getText('captured')}
                        latest={getText('latest')}
                        gotIt={getText('gotIt')}
                        colorIQLink={getText('colorIQLink')}
                    />
                )}
            </>
        );
    }
}

export default wrapComponent(ColorIQContentWorld, 'ColorIQContentWorld');
