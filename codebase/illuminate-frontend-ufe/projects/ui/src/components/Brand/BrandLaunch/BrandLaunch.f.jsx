import React from 'react';
import FrameworkUtils from 'utils/framework';
import PropTypes from 'prop-types';
import {
    Box, Container, Divider, Grid, Text
} from 'components/ui';
import { site, breakpoints } from 'style/config';
import BccRwdComponentList from 'components/Bcc/BccRwdComponentList';
import ImageUtils from 'utils/Image';
import BccUtils from 'utils/BCC';
import BrandLaunchLogin from './BrandLaunchLogin';

const LG_IMG_SIZE = 506;

const { wrapFunctionalComponent } = FrameworkUtils;
const { getImageSrc } = ImageUtils;
const { COMPONENT_NAMES } = BccUtils;

function BrandLaunch({ contentStoreData }) {
    const { regions, seoTitle } = contentStoreData;

    let banner;
    let hasValidBanner;
    let content = regions?.zoneOne;

    if (regions?.zoneOne?.[0].componentType === COMPONENT_NAMES.RWD_BANNER) {
        banner = regions.zoneOne[0];
        content = regions.zoneOne.slice(1);
        hasValidBanner = Boolean(
            banner.imageSmallViewPortSource &&
                banner.imageSmallViewPortHeight &&
                banner.imageSmallViewPortWidth &&
                banner.imageLargeViewPortSource &&
                banner.imageLargeViewPortHeight &&
                banner.imageLargeViewPortWidth
        );
    }

    return (
        <Container>
            <Grid
                gap={[4, 5]}
                marginTop={[null, 5]}
                marginBottom={[4, 5]}
                columns={[null, `${(LG_IMG_SIZE / site.containerMax) * 100}% 1fr`]}
                lineHeight='tight'
            >
                <Box marginX={['-container', 0]}>
                    {hasValidBanner && (
                        <Box
                            is='picture'
                            position='relative'
                            paddingBottom={
                                banner && [
                                    `${(banner.imageSmallViewPortHeight / banner.imageSmallViewPortWidth) * 100}%`,
                                    `${(banner.imageLargeViewPortHeight / banner.imageLargeViewPortWidth) * 100}%`
                                ]
                            }
                        >
                            <source
                                media={breakpoints.xsMax}
                                srcSet={getImageSrc(banner.imageSmallViewPortSource, parseInt(breakpoints[0]) - 1, true)}
                            />
                            <img
                                src={getImageSrc(banner.imageLargeViewPortSource, LG_IMG_SIZE, true)}
                                alt={banner.imageAltText}
                                css={styles.image}
                            />
                        </Box>
                    )}
                </Box>
                <div>
                    {(banner?.markdownText || seoTitle) && (
                        <Text
                            is='h1'
                            fontSize='lg'
                            fontWeight='bold'
                            children={banner?.markdownText || seoTitle}
                        />
                    )}
                    <BrandLaunchLogin />
                </div>
            </Grid>
            {content && (
                <>
                    <Divider marginY={[4, 5]} />
                    <BccRwdComponentList
                        enablePageRenderTracking={true}
                        context='container'
                        items={content}
                    />
                </>
            )}
        </Container>
    );
}

const styles = {
    image: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    }
};

BrandLaunch.propTypes = {
    contentStoreData: PropTypes.object.isRequired
};

export default wrapFunctionalComponent(BrandLaunch, 'BrandLaunch');
