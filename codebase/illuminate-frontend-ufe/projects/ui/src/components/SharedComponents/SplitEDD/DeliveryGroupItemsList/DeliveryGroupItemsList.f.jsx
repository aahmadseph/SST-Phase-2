import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Text, Box, Grid, Icon, Divider
} from 'components/ui';
import OrderItem from 'components/OrderConfirmation/OrderItemList/OrderItem/OrderItem';
import * as orderConfirmationConstants from 'components/OrderConfirmation/constants';
import * as productListItemConstants from 'components/Product/ProductListItem/constants';
import { radii } from 'style/config';
import LocaleUtils from 'utils/LanguageLocale';
const getText = LocaleUtils.getLocaleResourceFile('components/SharedComponents/SplitEDD/DeliveryGroupItemsList/locales', 'DeliveryGroupItemsList');

const FIRST_ITEM_INDEX = 0;

function DeliveryGroupItemsList(props) {
    const {
        shipmentNumber,
        isOrderDetail,
        deliveryGroup,
        totalDeliveryGroups,
        shippingMethodType,
        orderItemComponentProps,
        productListItemForSplitEDD,
        showHeader
    } = props;
    const { itemWidths } = isOrderDetail ? productListItemConstants : orderConfirmationConstants;

    return (
        <Box
            paddingBottom={[0, 5]}
            {...(isOrderDetail && { boxShadow: 'light', marginBottom: 4, borderRadius: radii[1] })}
        >
            {!isOrderDetail && (
                <Divider
                    height={[3, 2]}
                    marginX={[-4, 0]}
                    marginBottom={[4, 5]}
                    color={['nearWhite', 'black']}
                />
            )}
            <Grid
                columns='auto 1fr'
                alignItems='center'
                borderBottom={[1, 0]}
                borderColor='lightGray'
                paddingBottom={4}
                {...(isOrderDetail && {
                    columns: 1,
                    padding: 4,
                    display: showHeader ? 'grid' : 'none'
                })}
            >
                {!isOrderDetail && <Icon name='truck' />}
                <Box lineHeight='tight'>
                    <Text
                        fontWeight='bold'
                        className='shippingMethodType'
                        display='none'
                    >
                        {shippingMethodType}
                    </Text>

                    <Grid columns='1fr auto'>
                        <Text
                            {...(isOrderDetail && {
                                color: 'green',
                                fontWeight: 'bold'
                            })}
                        >
                            {deliveryGroup.showEstimatedDeliveryDateRange
                                ? deliveryGroup.estimatedDeliveryDateRange
                                : `${deliveryGroup.promiseDateLabel} ${deliveryGroup.promiseDateValue}`}
                        </Text>
                        <Text
                            padding={1}
                            lineHeight='none'
                            fontSize='xs'
                            fontWeight='bold'
                            backgroundColor='lightGray'
                            borderRadius={2}
                            css={{
                                borderRadius: radii[2],
                                textTransform: 'uppercase'
                            }}
                        >
                            {getText('shipmentNumber', [shipmentNumber, totalDeliveryGroups])}
                        </Text>
                    </Grid>
                </Box>
            </Grid>
            <Grid
                gap={0}
                gridTemplateColumns={`${itemWidths.DESC} ${itemWidths.PRICE} ${itemWidths.QTY} ${itemWidths.AMOUNT}`}
                paddingY={4}
                borderX={0}
                borderWidth={1}
                borderColor='lightGray'
                fontWeight={!isOrderDetail && 'bold'}
                display={['none', 'grid']}
            >
                <Box paddingX={4}>{getText('item')}</Box>
                <Box paddingX={4}>{getText('price')}</Box>
                <Box paddingX={4}>{getText('qty')}</Box>
                <Box
                    textAlign='right'
                    paddingX={isOrderDetail ? 4 : 0}
                >
                    {getText('amount')}
                </Box>
            </Grid>
            <Box
                css={{
                    '& > :last-child': {
                        border: 0
                    }
                }}
            >
                {deliveryGroup.items.map((item, index) => {
                    return (
                        <Box
                            borderBottom={1}
                            borderColor='lightGray'
                            padding={isOrderDetail ? 4 : 0}
                            paddingY={4}
                        >
                            {isOrderDetail ? (
                                productListItemForSplitEDD(item)
                            ) : (
                                <OrderItem
                                    isPageRenderImg={index === FIRST_ITEM_INDEX}
                                    loveSource='purchaseHistory'
                                    item={item}
                                    {...orderItemComponentProps}
                                />
                            )}
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
}

DeliveryGroupItemsList.propTypes = {
    isOrderDetail: PropTypes.bool,
    shipmentNumber: PropTypes.number,
    totalDeliveryGroups: PropTypes.number,
    shippingMethodType: PropTypes.string,
    orderItemComponentProps: PropTypes.shape({}),
    productListItemForSplitEDD: PropTypes.func,
    deliveryGroup: PropTypes.shape({}),
    showHeader: PropTypes.bool
};

DeliveryGroupItemsList.defaultProps = {
    isOrderDetail: false,
    shipmentNumber: 0,
    totalDeliveryGroups: 0,
    shippingMethodType: '',
    orderItemComponentProps: {},
    productListItemForSplitEDD: () => {},
    deliveryGroup: {},
    showHeader: true
};

export default wrapFunctionalComponent(DeliveryGroupItemsList, 'DeliveryGroupItemsList');
