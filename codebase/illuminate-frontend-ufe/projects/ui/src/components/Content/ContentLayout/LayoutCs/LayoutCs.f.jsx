import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Container, Text, Grid, Link, Box
} from 'components/ui';
import ComponentList from 'components/Content/ComponentList';
import contentConstants from 'constants/content';
import Breadcrumb from 'components/Content/Breadcrumb';
import Divider from 'components/Content/Divider';
import Action from 'components/Content/Action';
import {
    fontWeights, fontSizes, lineHeights, space, mediaQueries
} from 'style/config';

const { CONTEXTS } = contentConstants;
const ActionLink = Action(Link);

const LayoutCs = ({ content, navigation, breadcrumbs, localization }) => {
    const items = content.content;
    const isRoot = breadcrumbs ? breadcrumbs[0].action.isCurrent : true;
    const useSideNav = items && !isRoot;
    const LayoutComponent = useSideNav ? Grid : Box;

    return (
        <Container>
            {breadcrumbs && (
                <Breadcrumb
                    breadcrumbs={breadcrumbs}
                    localization={localization?.breadcrumb}
                    fontSize={fontSizes['sm-bg']}
                />
            )}
            <LayoutComponent css={useSideNav && styles.grid}>
                <Grid
                    css={styles.content}
                    gap={useSideNav && [4, 5]}
                    columnGap={!useSideNav && [4, 5]}
                >
                    {items && (
                        <ComponentList
                            enablePageRenderTracking={true}
                            trackingCount={1}
                            context={CONTEXTS.CONTAINER}
                            page='customer-service'
                            items={items}
                            removeLastItemMargin={true}
                            removeFirstItemMargin={true}
                        />
                    )}
                </Grid>
                {navigation && (
                    <>
                        {isRoot ? (
                            <>
                                <Divider />
                                <Text
                                    is='h3'
                                    css={styles.header}
                                    fontSize={[fontSizes['md-bg'], fontSizes['lg-bg']]}
                                >
                                    {localization.allTopics}
                                </Text>

                                {(navigation.items || []).map(parent => (
                                    <div
                                        key={`navParent_${parent.label}`}
                                        role='navigation'
                                        aria-label={parent.label}
                                    >
                                        <ActionLink action={parent.action}>
                                            <Text
                                                is='h4'
                                                css={styles.header}
                                                fontSize={[fontSizes['base-bg'], fontSizes['md-bg']]}
                                                marginY={space[4]}
                                                marginTop={space[6]}
                                            >
                                                {parent.label}
                                            </Text>
                                        </ActionLink>
                                        <Grid
                                            columns={[1, 4]}
                                            gap={5}
                                            rowGap={4}
                                        >
                                            {(parent.items || []).map(child => (
                                                <ActionLink
                                                    key={`navChild_${child.label}`}
                                                    action={child.action}
                                                >
                                                    <Text lineHeight={lineHeights.tight}>{child.label}</Text>
                                                </ActionLink>
                                            ))}
                                        </Grid>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div css={styles.sideNav}>
                                {useSideNav && (
                                    <Box css={styles.hideDivider}>
                                        <Divider />
                                    </Box>
                                )}
                                <Text
                                    is='h4'
                                    fontSize={[fontSizes['base-bg'], fontSizes['md-bg']]}
                                    fontWeight={fontWeights.demiBold}
                                    marginY={space[4]}
                                    marginTop={0}
                                >
                                    {navigation.label}
                                </Text>
                                <Grid
                                    columns={!items ? [1, 4] : 1}
                                    gap={5}
                                    rowGap={4}
                                    role='navigation'
                                    aria-label={navigation.label}
                                >
                                    {(navigation.items || []).map(child => (
                                        <ActionLink
                                            key={`navChild_${child.label}`}
                                            action={child.action}
                                        >
                                            <Text
                                                css={child.action.isCurrent && styles.active}
                                                lineHeight={lineHeights.tight}
                                            >
                                                {child.label}
                                            </Text>
                                        </ActionLink>
                                    ))}
                                </Grid>
                            </div>
                        )}
                    </>
                )}
            </LayoutComponent>
        </Container>
    );
};

const styles = {
    header: {
        fontWeight: fontWeights.demiBold,
        lineHeight: lineHeights.tight,
        display: 'block'
    },
    grid: {
        gridTemplateAreas: '"content" "sidebar"',
        columns: 1,
        [mediaQueries.sm]: {
            gridTemplateColumns: '208px 1fr',
            display: 'inline-grid',
            gridTemplateAreas: '"sidebar content"',
            columnGap: space[7]
        }
    },
    sideNav: {
        gridArea: 'sidebar'
    },
    content: {
        gridArea: 'content',
        gridTemplateColumns: 'repeat(6, 1fr)',
        '> div': {
            gridColumn: 'span 6'
        }
    },
    active: {
        fontWeight: fontWeights.demiBold
    },
    hideDivider: {
        [mediaQueries.sm]: {
            display: 'none'
        }
    }
};

LayoutCs.propTypes = {
    content: PropTypes.object.isRequired,
    breadcrumbs: PropTypes.array,
    navigation: PropTypes.object
};

LayoutCs.defaultProps = {
    breadcrumbs: null,
    navigation: null
};

export default wrapFunctionalComponent(LayoutCs, 'LayoutCs');
