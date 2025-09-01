import React from 'react';
import { Box } from 'components/ui';
import FrameworkUtils from 'utils/framework';
import { colors, mediaQueries, site } from 'style/config';
import UIUtils from 'utils/UI';

const { wrapFunctionalComponent } = FrameworkUtils;
const { SKELETON_ANIMATION } = UIUtils;

const styles = {
    bannerSkeleton: {
        root: {
            background: colors.nearWhite
        },
        wrap: {
            position: 'relative',
            maxWidth: site.containerMax,
            marginLeft: 'auto',
            marginRight: 'auto'
        },
        ratio: {
            paddingBottom: 48,
            [mediaQueries.sm]: {
                paddingBottom: `${(60 / site.containerMax) * 100}%`
            }
        },
        inner: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
        },
        line: [
            {
                height: 8,
                borderRadius: 4,
                width: '100%'
            },
            SKELETON_ANIMATION
        ],
        lineTop: {
            maxWidth: '84%',
            [mediaQueries.sm]: {
                maxWidth: '65%'
            }
        },
        lineBottom: {
            maxWidth: '68%',
            marginTop: 6,
            [mediaQueries.sm]: {
                maxWidth: '52%',
                marginTop: 8
            }
        }
    }
};
const SkeletonBanner = ({ height }) => (
    <div css={styles.bannerSkeleton.root}>
        <Box
            css={styles.bannerSkeleton.wrap}
            height={height}
        >
            <Box
                css={!height && styles.bannerSkeleton.ratio}
                paddingBottom={height}
            />
            <div css={styles.bannerSkeleton.inner}>
                <div css={[styles.bannerSkeleton.line, styles.bannerSkeleton.lineTop]} />
                <div css={[styles.bannerSkeleton.line, styles.bannerSkeleton.lineBottom]} />
            </div>
        </Box>
    </div>
);

export default wrapFunctionalComponent(SkeletonBanner, 'SkeletonBanner');
