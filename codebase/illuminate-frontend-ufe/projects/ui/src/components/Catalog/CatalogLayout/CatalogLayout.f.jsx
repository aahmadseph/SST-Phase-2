import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import analyticsConsts from 'analytics/constants';
import { Container, Grid, Divider } from 'components/ui';
import { mediaQueries, space, site } from 'style/config';
import BackToTopButton from 'components/BackToTopButton';
import contentConstants from 'constants/content';

const { FILTERS_SIDEBAR_WIDTH } = contentConstants;

function getAnalyticsLinkName(pageNumber, isBrandPage, isSearch) {
    const { SHOP_PAGE, BRAND_PAGE, SEARCH_PAGE, PRODUCTS_BACK_TO_TOP } = analyticsConsts.LinkData;
    let pageType = '';

    if (isBrandPage) {
        pageType = BRAND_PAGE;
    } else if (isSearch) {
        pageType = SEARCH_PAGE;
    } else {
        pageType = SHOP_PAGE;
    }

    return `${pageType} ${pageNumber}:${PRODUCTS_BACK_TO_TOP}`;
}

const Main = memo(({ content }) => {
    return <main css={styles.main}>{content.main}</main>;
});

const Bottom = memo(({ content }) => {
    return (
        <>
            {content.bottom && (
                <>
                    <Divider
                        marginTop={[5, 7]}
                        marginBottom={4}
                    />
                    {content.bottom}
                </>
            )}
        </>
    );
});

function CatalogLayout({
    content = {},
    alignItems,
    currentPage,
    isBrand,
    isSearch,
    columnWidth = FILTERS_SIDEBAR_WIDTH.DEFAULT,
    backToTopPosition = site.headerHeight,
    showDynamicStickyFilter = false
}) {
    return (
        <Container>
            <div css={styles.top}>{content.top}</div>
            <Grid
                alignItems={[null, null, alignItems]}
                gap={[3, null, columnWidth === FILTERS_SIDEBAR_WIDTH.STICKY ? '20px' : 7]}
                columns={[null, null, `${columnWidth}px 1fr`]}
            >
                {content.sidebar}
                <Main content={content} />
            </Grid>
            <Bottom content={content} />
            <BackToTopButton
                topPosition={backToTopPosition}
                analyticsLinkName={getAnalyticsLinkName(currentPage, isBrand, isSearch)}
                showDynamicStickyFilter={showDynamicStickyFilter}
            />
        </Container>
    );
}

CatalogLayout.SideBar = ({ shouldStickySideBar, children }) => {
    return <div css={[styles.sidebar, shouldStickySideBar && styles.sidebarSticky]}>{children}</div>;
};

const styles = {
    top: {
        minHeight: space[4],
        [mediaQueries.sm]: {
            minHeight: space[5]
        },
        [mediaQueries.md]: {
            minHeight: space[6]
        }
    },
    sidebar: {
        [mediaQueries.smMax]: {
            display: 'contents'
        }
    },
    sidebarSticky: {
        [mediaQueries.md]: {
            position: 'sticky',
            top: 5,
            alignSelf: 'start',
            maxHeight: '100vh',
            overflow: 'auto',
            paddingRight: 16,
            paddingLeft: 5,
            scrollbarWidth: 'thin'
        }
    },
    main: {
        [mediaQueries.smMax]: {
            display: 'contents'
        }
    }
};

CatalogLayout.propTypes = {
    content: PropTypes.object.isRequired,
    currentPage: PropTypes.number,
    isBrand: PropTypes.bool,
    shouldStickySideBar: PropTypes.bool
};

CatalogLayout.defaultProps = {
    shouldStickySideBar: false
};

export default wrapFunctionalComponent(CatalogLayout, 'CatalogLayout');
