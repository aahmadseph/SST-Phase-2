import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Text, Box, Grid } from 'components/ui';
import { radii, mediaQueries } from 'style/config';
import helpersUtils from 'utils/Helpers';
import checkoutUtils from 'utils/Checkout';

import SplitEDDShippingMethod from 'components/SharedComponents/SplitEDD/SplitEDDShippingMethod';

const BORDER_RADIUS = 2;
const BORDER_WIDTH = 1;

function ShippingMethodOption(props) {
    const { setShippingMethod, shippingMethod, isSelected, shippingGroup } = props;

    const shippingFee = checkoutUtils.setShippingFee(shippingMethod.shippingFee) || '';
    const capitalizedShippingFee = helpersUtils.capitalizeFirstLetter(shippingFee, true);
    const promiseDateSplitCutOffDescription = checkoutUtils.getPromiseDateCutOffDescription(shippingMethod.promiseDateSplitCutOffDescription);

    return (
        <Box
            display={[null, 'contents']}
            borderRadius={[BORDER_RADIUS, null]}
            borderWidth={[BORDER_WIDTH, null]}
            borderColor={['midGray', null]}
            position='relative'
        >
            <Grid
                is='label'
                padding={2}
                borderRadius={[null, BORDER_RADIUS]}
                borderWidth={[null, BORDER_WIDTH]}
                borderColor={[null, 'midGray']}
                minHeight={[null, '74px']}
                columns={['1fr auto', 1]}
                alignItems={['center', 'start']}
                gridTemplateRows={[null, '1fr auto']}
                css={{
                    [mediaQueries.sm]: {
                        position: 'relative'
                    },
                    cursor: isSelected ? 'default' : 'pointer',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        border: `${BORDER_WIDTH + 1}px solid`,
                        inset: -BORDER_WIDTH,
                        borderRadius: radii[BORDER_RADIUS],
                        transition: 'opacity .2s',
                        zIndex: 1,
                        opacity: isSelected ? 1 : 0
                    }
                }}
            >
                <Box lineHeight='tight'>
                    <Text fontWeight='bold'>{shippingMethod.shippingMethodType}</Text>
                    <Text
                        fontSize='sm'
                        display='block'
                        css={{
                            [mediaQueries.xsMax]: {
                                display: isSelected ? 'block' : 'none'
                            },
                            visibility: isSelected ? 'visible' : 'hidden'
                        }}
                    >
                        {promiseDateSplitCutOffDescription}
                    </Text>
                </Box>
                <Box>
                    <Text fontWeight='bold'>{capitalizedShippingFee}</Text>
                </Box>
                <input
                    type='radio'
                    name='shippingMethodRadio'
                    value={shippingMethod.shippingMethodId}
                    checked={isSelected}
                    onChange={setShippingMethod}
                    css={{
                        position: 'absolute',
                        opacity: 0
                    }}
                />
            </Grid>
            <Box
                order='1'
                padding={2}
                backgroundColor='nearWhite'
                css={{
                    [mediaQueries.sm]: {
                        borderRadius: radii[BORDER_RADIUS]
                    },
                    display: !isSelected ? 'none' : null,
                    gridColumn: '1 / -1'
                }}
            >
                <SplitEDDShippingMethod
                    marginTop={0}
                    showDescription={false}
                    shippingMethod={shippingMethod}
                    shippingGroup={shippingGroup}
                />
            </Box>
        </Box>
    );
}

ShippingMethodOption.propTypes = {
    items: PropTypes.array,
    shippingMethod: PropTypes.shape({})
};

ShippingMethodOption.defaultProps = {
    items: [],
    shippingMethod: {}
};

export default wrapFunctionalComponent(ShippingMethodOption, 'ShippingMethodOption');
