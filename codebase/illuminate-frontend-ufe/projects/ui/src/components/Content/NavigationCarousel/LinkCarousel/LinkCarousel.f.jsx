import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Text, Link } from 'components/ui';
import {
    radii, lineHeights, space, mediaQueries, fontSizes, colors, borders
} from 'style/config';
import Action from 'components/Content/Action';
import Carousel from 'components/Carousel';

const ActionLink = Action(Link);

const LinkCarousel = ({ navigation }) => {
    const { items, backgroundColor, action } = navigation;

    const buildLinkItems = () => {
        const linkItems = [];

        linkItems.push(
            <ActionLink
                key={'overview'}
                action={action}
                aria-label={'overview'}
                backgroundColor={backgroundColor}
                css={styles.link}
            >
                <Text>Overview</Text>
            </ActionLink>
        );

        items?.map(item =>
            linkItems.push(
                <ActionLink
                    key={item.label}
                    action={item.action}
                    aria-label={item.label}
                    backgroundColor={item.backgroundColor}
                    css={[styles.link, item.action?.isCurrent && styles.isActive]}
                >
                    <Text>{item.label}</Text>
                </ActionLink>
            )
        );

        return linkItems;
    };

    const linkItems = buildLinkItems();

    return (
        <Carousel
            itemWidth={'unset'}
            itemFlexGrow={1}
            gap={2}
            paddingY={1} //makes focus outline visible
            items={linkItems.map(item => item)}
        />
    );
};

const styles = {
    link: {
        borderRadius: radii[2],
        lineHeight: lineHeights.tight,
        flex: 1,
        minWidth: 'max-content',
        padding: `${space[2]}px ${space[3]}px`,
        fontSize: `${fontSizes.base}px`,
        height: '32px',
        [mediaQueries.sm]: {
            minWidth: '149px',
            padding: `${space[3]}px ${space[4]}px`,
            fontSize: 'unset',
            display: 'flex',
            alignItems: 'center',
            height: '44px'
        }
    },
    isActive: {
        border: `${borders[2]} ${colors.black}`,
        paddingTop: '6px' //compensate for 2px from border
    }
};

LinkCarousel.propTypes = {
    navigation: PropTypes.object
};

export default wrapFunctionalComponent(LinkCarousel, 'LinkCarousel');
