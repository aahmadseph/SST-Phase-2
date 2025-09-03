import { Grid, Icon, Text } from 'components/ui';
import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    radii, colors, fontSizes
} from 'style/config';

const UpperFunnelTile = ({
    children, enabled, iconName, subTitle, title, dataAt, isDeliveryFilterApplied, removeGrayBgOnFulfillmentInfo
}) => {
    const isBgRemoved = removeGrayBgOnFulfillmentInfo && !isDeliveryFilterApplied;

    return (
        <Grid
            is='span'
            borderRadius={radii[1]}
            columns='auto 1fr'
            gap={'.1em .5em'}
            backgroundColor={!isBgRemoved && colors.nearWhite}
            paddingY={!isBgRemoved ? '.5em': '.1em'}
            paddingX={!isBgRemoved && ['.5em', '.75em']}
        >
            <Icon
                name={iconName}
                color={colors.gray}
                size='1.25em'
            />
            <Text
                numberOfLines={1}
                marginTop='.1em'
                children={title}
                data-at={Sephora.debug.dataAt(dataAt)}
            />
            {enabled && (
                <>
                    <span />
                    <Text fontSize='0.91em'>
                        <Text
                            fontSize={[fontSizes.xs, fontSizes.sm]}
                            display='block'
                            color={colors.green}
                            children={subTitle}
                        />
                        {children}
                    </Text>
                </>
            )}
        </Grid>
    );
};

UpperFunnelTile.defaultProps = { children: null, isDeliveryFilterApplied: false };

UpperFunnelTile.propTypes = {
    children: PropTypes.element,
    enabled: PropTypes.bool.isRequired,
    iconName: PropTypes.string.isRequired,
    subTitle: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
};

export default wrapFunctionalComponent(UpperFunnelTile, 'UpperFunnelTile');
