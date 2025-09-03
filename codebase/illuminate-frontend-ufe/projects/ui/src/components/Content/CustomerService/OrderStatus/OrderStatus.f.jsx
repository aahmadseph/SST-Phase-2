import React from 'react';
import { Box } from 'components/ui';
import { wrapFunctionalComponent } from 'utils/framework';
import OrderStatusLookup from 'components/RichProfile/MyAccount/OrderStatusLookup';
import {
    fonts, fontSizes, fontWeights, lineHeights, space
} from 'style/config';

const OrderStatus = () => {
    return (
        <Box
            backgroundColor='#F6F6F8'
            gridColumn={['span 6 !important', 'span 3 !important']}
            borderRadius={2}
            padding={[4, 5]}
            css={style.container}
        >
            <OrderStatusLookup />
        </Box>
    );
};

const style = {
    container: {
        '> div': {
            padding: 0,
            border: 'none',
            maxWidth: 'none',
            '> h2': {
                fontFamily: fonts.base,
                fontWeight: fontWeights.bold,
                fontSize: fontSizes['xl-bg'],
                marginBottom: space[3],
                lineHeight: lineHeights.base
            },
            '> p': {
                maxWidth: 'none'
            },
            '> form button': {
                width: 136
            }
        }
    }
};

export default wrapFunctionalComponent(OrderStatus, 'OrderStatus');
