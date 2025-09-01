/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';

import { wrapFunctionalComponent } from 'utils/framework';
import { Box, Text } from 'components/ui';
import localeUtils from 'utils/LanguageLocale';
import uiUtils from 'utils/UI';

import RMN_BANNER_TYPES from 'components/Rmn/constants';

const { getLocaleResourceFile } = localeUtils;
const { SKELETON_ANIMATION } = uiUtils;
const { TYPES } = RMN_BANNER_TYPES;
const getText = getLocaleResourceFile('components/Rmn/locales', 'RmnBanner');

const PLACEHOLDER_IMG = '/img/ufe/placeholder_grey.svg';

const RmnBannerStyle = React.forwardRef((props, ref) => {
    const {
        type, position = 0, bannerData, showSkeleton, handleClick, slot, useFallback
    } = props;
    const hasBannerData = bannerData && Object.keys(bannerData).length !== 0;

    if (!Sephora.configurationSettings.RMNEnableDisplay) {
        return null;
    }

    const isFallbackBanner = bannerData?.isFallbackBanner || false;

    // Verifies if the fallback banner should be displayed
    if ((isFallbackBanner && !useFallback) || (!hasBannerData && !useFallback)) {
        return <div ref={ref}></div>;
    }

    const handleBannerClick = event => {
        event.preventDefault();
        event.stopPropagation();
        handleClick({ event, bannerData });
    };

    return hasBannerData || showSkeleton ? (
        <Box
            display={TYPES[type].DISPLAY}
            marginX={props?.isCentered && 'auto'}
            marginTop={props?.marginTop}
            marginBottom={props?.marginBottom}
            width='100%'
            maxWidth={TYPES[type].WIDTH}
            ref={ref}
            id={`${slot}-${position}`}
            className='rmn-banner'
        >
            <div
                css={[
                    {
                        position: 'relative',
                        overflow: 'visible', // Changed this property to fix LCP selection
                        paddingBottom: `${Math.round((TYPES[type].HEIGHT / TYPES[type].WIDTH) * 100)}%`
                    },
                    !hasBannerData && SKELETON_ANIMATION
                ]}
            >
                <a
                    onClick={hasBannerData ? handleBannerClick : undefined}
                    css={styles.anchor}
                >
                    <img
                        src={hasBannerData ? bannerData.asset_url : PLACEHOLDER_IMG}
                        width={TYPES[type].WIDTH}
                        height={TYPES[type].HEIGHT}
                        css={styles.img}
                        alt={getText('alt')}
                    />
                </a>
            </div>
            <Text
                is='p'
                color='gray'
                fontSize='sm'
                lineHeight='tight'
                marginTop={2}
                children={getText('sponsored')}
                style={!hasBannerData ? { visibility: 'hidden' } : null}
            />
        </Box>
    ) : null;
});

const styles = {
    anchor: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        cursor: 'pointer'
    },
    img: {
        display: 'block',
        objectFit: 'cover',
        width: '100%',
        height: '100%'
    }
};

RmnBannerStyle.propTypes = {
    type: PropTypes.oneOf([TYPES.SUPER_LEADERBOARD.NAME, TYPES.MOBILE_LEADERBOARD.NAME, TYPES.WIDE_SIDESCRAPER.NAME]),
    bannerData: PropTypes.shape({
        asset_url: PropTypes.string
    }),
    marginTop: PropTypes.number,
    marginBottom: PropTypes.number,
    isCentered: PropTypes.bool,
    handleClick: PropTypes.func.isRequired,
    showSkeleton: PropTypes.bool.isRequired
};

export default wrapFunctionalComponent(RmnBannerStyle, 'RmnBannerStyle');
