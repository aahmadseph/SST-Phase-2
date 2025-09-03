import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    space, fontSizes, mediaQueries, lineHeights, fontWeights
} from 'style/config';
import { Container, Box, Flex } from 'components/ui';
import Breadcrumb from 'components/Content/Breadcrumb';
import NavigationCarousel from 'components/Content/NavigationCarousel';
import PageCard from 'components/Content/PageCard';
import NAVIGATION_CAROUSEL_CONSTS from 'components/Content/NavigationCarousel/constants';

const LayoutDirectory = ({
    pageHeader, localization = {}, navigation = {}, seo = {}, breadcrumbs = {}
}) => {
    const pageTitle = pageHeader || seo.header1;
    const isChild = breadcrumbs.length > 1;

    return (
        <Container paddingX={[0, 4]}>
            <Container paddingX={[4, 0]}>
                <Breadcrumb
                    breadcrumbs={breadcrumbs}
                    localization={localization?.breadcrumb}
                    fontSize='sm-bg'
                />
                {pageTitle && <p css={styles.pageTitle}>{pageTitle}</p>}
            </Container>
            {navigation && (
                <>
                    {!isChild ? (
                        <>
                            {navigation.items &&
                                navigation.items.map((section, sectionIndex) => {
                                    const isFirstCarousel = sectionIndex === 0;

                                    return (
                                        <Box
                                            key={`Directory_Navigation_carousel_${sectionIndex.toString()}`}
                                            sid={section.sid}
                                        >
                                            <NavigationCarousel
                                                variant={
                                                    isFirstCarousel
                                                        ? NAVIGATION_CAROUSEL_CONSTS.VARIANTS.HIGHLIGHT
                                                        : NAVIGATION_CAROUSEL_CONSTS.VARIANTS.CARD
                                                }
                                                title={section.label}
                                                action={section.action}
                                                navigation={{ items: section.items }}
                                            />
                                        </Box>
                                    );
                                })}
                        </>
                    ) : (
                        <Flex
                            rowGap={6}
                            columnGap={5}
                            flexWrap={'wrap'}
                            marginBottom={6}
                            paddingX={[4, 0]}
                        >
                            {navigation.items &&
                                navigation.items.map((item, itemIndex) => (
                                    <PageCard
                                        variant={'grid'}
                                        key={`Directory_Grid_${itemIndex.toString()}`}
                                        sid={item.sid}
                                        media={item.media}
                                        label={item.label}
                                        description={item.description}
                                        action={item.action}
                                        pageLayout={item.action?.page?.layout?.type || ''}
                                    />
                                ))}
                        </Flex>
                    )}
                </>
            )}
        </Container>
    );
};

const styles = {
    pageTitle: {
        marginBottom: space[5],
        fontSize: fontSizes['xl-bg'],
        lineHeight: lineHeights.tight,
        [mediaQueries.lg]: {
            fontSize: fontSizes['2xl-bg']
        },
        fontWeight: fontWeights.demiBold
    }
};

LayoutDirectory.propTypes = {
    navigation: PropTypes.object.isRequired,
    seo: PropTypes.object,
    localization: PropTypes.object,
    breadcrumbs: PropTypes.array
};

export default wrapFunctionalComponent(LayoutDirectory, 'LayoutDirectory');
