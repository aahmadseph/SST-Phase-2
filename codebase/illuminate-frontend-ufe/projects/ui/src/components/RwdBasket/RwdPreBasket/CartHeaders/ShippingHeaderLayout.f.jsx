import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

import {
    Grid, Text, Icon, Flex
} from 'components/ui';
import InfoButton from 'components/InfoButton/InfoButton';

import isFunction from 'utils/functions/isFunction';

function ShippingHeaderLayout({
    iconName, title, infoOnClick, subHeader = null, dataAt
}) {
    return (
        <Grid
            columns='auto 1fr'
            alignItems='flex-start'
            gap={3}
        >
            <Icon name={iconName} />
            <div>
                <Text
                    is={'p'}
                    fontWeight={'bold'}
                    fontSize={['base', 'md']}
                >
                    <Flex
                        gap={'6px'}
                        alignItems={'center'}
                        data-at={Sephora.debug.dataAt(dataAt?.basketLabel)}
                    >
                        {title}
                        {isFunction(infoOnClick) && (
                            <InfoButton
                                size={16}
                                onClick={infoOnClick}
                                data-at={Sephora.debug.dataAt(dataAt?.infoIcon)}
                            />
                        )}
                    </Flex>
                </Text>
                {subHeader}
            </div>
        </Grid>
    );
}

export default wrapFunctionalComponent(ShippingHeaderLayout, 'ShippingHeaderLayout');
