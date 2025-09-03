import React from 'react';
import Card from 'components/Card';
import PropTypes from 'prop-types';
import { site } from 'style/config';
import { space } from 'style/config';
import Carousel from 'components/Carousel';
import Copy from 'components/Content/Copy';
import FrameworkUtils from 'utils/framework';
import Action from 'components/Content/Action';
import Banner from 'components/Content/Banner';
import ContentConstants from 'constants/content';
import RichText from 'components/Content/RichText';
import {
    Box, Text, Grid, Link, Flex
} from 'components/ui';

const ActionLink = Action(Link);
const { wrapFunctionalComponent } = FrameworkUtils;
const { SECTION_COMPONENTS_TYPE, SECTION_LAYOUT_TYPE } = ContentConstants;

const Section = props => {
    const { datasource, parameters, items, customStyles = {} } = props;
    const {
        title, text, actionLabel, action, sid
    } = datasource;
    const {
        items: itemsSmallUi, itemsLargeUi, isMainSection, layout, rowSpace, rowSpaceLgui
    } = parameters;

    // Avoid rendering a "SectionRendering" component if the items array is empty.
    if (!items.length) {
        return null;
    }

    const isMixedCardLayout = items[0]?.parameters?.layout === 'mixed' || items[0]?.parameters?.layoutLgui === 'mixed';
    const CARDS_PER_SLIDE = 3;
    const CARD_GAP = [2, 3];
    const DEFAULT_CARD_WIDTH = isMixedCardLayout ? 300 : 246;
    const CARD_WIDTH = [DEFAULT_CARD_WIDTH, (site.containerMax - space[CARD_GAP[1]] * (CARDS_PER_SLIDE - 1)) / CARDS_PER_SLIDE];
    const defaultGapSpace = `${space[4]}px ${space[4]}px`;

    return (
        <Box css={styles.title}>
            {title && (
                <Flex
                    marginTop={[4, 5]}
                    marginBottom={2}
                    gap={2}
                    justifyContent={'space-between'}
                    alignItems='baseline'
                    width={'100%'}
                >
                    <Text
                        is={isMainSection ? 'h1' : 'h2'}
                        fontSize={[isMainSection ? 'lg' : 'md', isMainSection ? 'xl' : 'lg']}
                        lineHeight='none'
                        fontWeight='bold'
                        css={{ ...styles.titleText, ...customStyles?.section }}
                    >
                        {title}
                    </Text>

                    {actionLabel && (
                        <ActionLink
                            sid={sid}
                            action={action}
                            color='blue'
                            css={styles.viewAll}
                            maxWidth={['120px', '100%']}
                            children={actionLabel}
                        />
                    )}
                </Flex>
            )}

            {text && <RichText content={text} />}

            {layout === SECTION_LAYOUT_TYPE.GRID && (
                <Grid
                    columns={[`repeat(${itemsSmallUi}, 1fr)`, `repeat(${itemsLargeUi}, 1fr)`]}
                    marginTop={5}
                    gap={[rowSpace >= 0 ? `${rowSpace}px` : defaultGapSpace, rowSpaceLgui >= 0 ? `${rowSpaceLgui}px` : defaultGapSpace]}
                >
                    {items.map(item => {
                        if (item.type === SECTION_COMPONENTS_TYPE.CARD) {
                            return (
                                <Card
                                    customStyles={customStyles?.card}
                                    {...item}
                                    key={item.sid}
                                    parentPageType={'happening'}
                                    eventType={'service'}
                                />
                            );
                        } else if (item.type === SECTION_COMPONENTS_TYPE.COPY) {
                            return (
                                <Copy
                                    {...item}
                                    key={item.sid}
                                    marginTop={0}
                                    marginBottom={0}
                                />
                            );
                        } else if (item.type === SECTION_COMPONENTS_TYPE.BANNER) {
                            return (
                                <Banner
                                    {...item}
                                    key={item.sid}
                                    marginTop={0}
                                    marginBottom={0}
                                />
                            );
                        } else {
                            return null;
                        }
                    })}
                </Grid>
            )}

            {layout === SECTION_LAYOUT_TYPE.CAROUSEL && (
                <Grid
                    marginTop={5}
                    gap={`${space[6]}px ${space[5]}px`}
                >
                    {items[0]?.type === SECTION_COMPONENTS_TYPE.COPY ? (
                        <Copy
                            {...items[0]}
                            key={items[0].sid}
                            marginTop={0}
                            marginBottom={0}
                        />
                    ) : (
                        <Carousel
                            gap={CARD_GAP}
                            paddingY={4}
                            marginX='-container'
                            scrollPadding={[2, 'container']}
                            itemWidth={CARD_WIDTH}
                            hasShadowHack={true}
                            items={items.map(itemValue => (
                                <Card
                                    customStyles={customStyles?.card}
                                    {...itemValue}
                                    key={itemValue.sid}
                                />
                            ))}
                        />
                    )}
                </Grid>
            )}
        </Box>
    );
};

Section.propTypes = {
    type: PropTypes.string,
    datasource: PropTypes.shape({
        type: PropTypes.string,
        title: PropTypes.string
    }),
    parameters: PropTypes.shape({
        layout: PropTypes.oneOf(['grid', 'carousel']),
        items: PropTypes.number,
        itemsLargeUi: PropTypes.number,
        isMainSection: PropTypes.bool
    }),
    items: PropTypes.array
};

Section.defaultProps = {
    type: null,
    datasource: {
        type: null,
        title: null
    },
    parameters: {
        layout: 'grid',
        items: 1,
        itemsLargeUi: 4
    },
    items: []
};

const styles = {
    viewAll: {
        zIndex: 1,
        textAlign: 'right',
        whiteSpace: 'nowrap'
    },
    title: {
        position: 'relative'
    },
    titleText: {
        flex: 1
    }
};

export default wrapFunctionalComponent(Section, 'Section');
