import React from 'react';
import FrameworkUtils from 'utils/framework';
import BaseClass from 'components/BaseClass';

import store from 'store/Store';
import addToBasketActions from 'actions/AddToBasketActions';

import snbApi from 'services/api/search-n-browse';

import {
    Text, Image, Flex, Box
} from 'components/ui';
import Select from 'components/Inputs/Select/Select';

import { colors, space, screenReaderOnlyStyle } from 'style/config';

import localeUtils from 'utils/LanguageLocale';
import skuUtils from 'utils/Sku';
import uIUtils from 'utils/UI';
import agentAwareUtils from 'utils/AgentAware';

import analyticsUtils from 'analytics/utils';

const getText = localeUtils.getLocaleResourceFile('components/RwdBasket/RwdBasketLayout/GiftCardQuickAdd/locales', 'GiftCardQuickAdd');

const { wrapComponent } = FrameworkUtils;

// This is used to populate the dropdown and so we can mark the ones unavailable according to API response.
const GIFT_CARD_SKUS = [
    {
        skuId: '00510',
        listPrice: '10'
    },
    {
        skuId: '00520',
        listPrice: '25'
    },
    {
        skuId: '00530',
        listPrice: '40'
    },
    {
        skuId: '00540',
        listPrice: '50'
    },
    {
        skuId: '00550',
        listPrice: '75'
    },
    {
        skuId: '00560',
        listPrice: '100'
    },
    {
        skuId: '00570',
        listPrice: '150'
    },
    {
        skuId: '00580',
        listPrice: '200'
    },
    {
        skuId: '00590',
        listPrice: '250'
    }
];

const GIFT_CARD_PRODUCT_ID = 'P510100';

class GiftCardQuickAdd extends BaseClass {
    state = {
        selectedSku: GIFT_CARD_SKUS[3]?.skuId || '',
        availableSkus: [],
        productId: ''
    };

    addGiftCardToBasket = e => {
        e?.preventDefault();
        const { selectedSku, productId } = this.state;

        const selectedGiftCardSku = GIFT_CARD_SKUS.find(sku => sku.skuId === selectedSku);
        const products = [{ sku: { skuId: selectedSku } }];

        const analyticsData = {
            isGiftCardQuickAdd: true,
            productName: 'Gift Card',
            brandName: 'SEPHORA COLLECTION',
            productStrings: [analyticsUtils.buildProductStrings({ products })]
        };

        store.dispatch(
            addToBasketActions.addToBasket(
                {
                    skuId: selectedSku,
                    variationValue: `$${selectedGiftCardSku.listPrice}`,
                    listPrice: selectedGiftCardSku.listPrice,
                    type: skuUtils.skuTypes.GC
                },
                false,
                1,
                this.onAddToBasket,
                undefined,
                undefined,
                analyticsData,
                false,
                false,
                '',
                productId
            )
        );
    };

    onAddToBasket = () => {
        uIUtils.scrollToTop();
    };

    handleSelectSku = skuId => {
        this.setState({ selectedSku: skuId });
    };

    componentDidMount() {
        const { selectedSku } = this.state;

        snbApi
            .getProductDetails(GIFT_CARD_PRODUCT_ID, selectedSku, {
                addCurrentSkuToProductChildSkus: true
            })
            .then(product => {
                const availableGiftCardSkus = product?.regularChildSkus?.filter(sku => !sku?.isOutOfStock).map(sku => sku.skuId);

                const availableSkus = GIFT_CARD_SKUS.map(sku => {
                    if (availableGiftCardSkus.indexOf(sku.skuId) !== -1) {
                        sku.isAvailable = true;

                        return sku;
                    }

                    return sku;
                });

                this.setState({
                    availableSkus,
                    productId: product?.productDetails?.productId || ''
                });
            })
            .catch(e => {
                // eslint-disable-next-line no-console
                console.log(e);
            });
    }

    render() {
        const { availableSkus } = this.state;
        const { showBasketGreyBackground, backgroundColor } = this.props;

        return (
            <>
                {availableSkus.length > 0 ? (
                    <Flex
                        borderRadius={2}
                        width={'100%'}
                        display={'block'}
                        padding={'16px 24px 24px 24px'}
                        flexDirection={'column'}
                        alignItems={'flex-start'}
                        gap={'10px'}
                        lineHeight={'tight'}
                        boxShadow={'light'}
                        order={this.props.order}
                        {...(showBasketGreyBackground && { backgroundColor: backgroundColor })}
                    >
                        <Flex
                            alignItems={'center'}
                            gap={4}
                            lineHeight={'tight'}
                            className={agentAwareUtils.applyHideAgentAwareClass()}
                        >
                            <Image
                                disableLazyLoad={true}
                                height={[52, 60]}
                                width={[52, 60]}
                                src={'/img/ufe/payments/giftCard.svg'}
                            />
                            <div>
                                <Text
                                    is={'h2'}
                                    fontSize={['base', 'md']}
                                    fontWeight={'bold'}
                                >
                                    {getText('addMessage')}
                                </Text>
                                <Text
                                    is={'p'}
                                    fontSize={'sm'}
                                >
                                    {getText('addSubMessage')}
                                </Text>
                            </div>
                        </Flex>
                        <Flex
                            marginTop={[1, 3]}
                            borderRadius={16}
                            marginLeft={['68px', '76px']}
                            gap={'1px'}
                            width={'fit-content'}
                            border={`2px solid ${colors.black}`}
                        >
                            <label
                                css={screenReaderOnlyStyle}
                                htmlFor='giftCard_select_amount_select'
                                id='giftCard_select_amount_label'
                                children={getText('selectGiftCardAmount')}
                            />

                            <Select
                                id='giftCard_select_amount_select'
                                aria-labelledby='giftCard_select_amount_label'
                                size={'sm'}
                                isInline={true}
                                value={this.state.selectedSku}
                                onChange={e => this.handleSelectSku(e.target.value)}
                                marginBottom={null}
                                customStyle={{
                                    root: {
                                        borderRight: `1px solid ${colors.black}`
                                    },
                                    input: {
                                        minWidth: 68,
                                        textAlign: 'center',
                                        borderTopRightRadius: '0px',
                                        borderBottomRightRadius: '0px',
                                        borderTopLeftRadius: '16px',
                                        borderBottomLeftRadius: '16px',
                                        border: 0,
                                        paddingRight: space[3]
                                    },
                                    svg: {
                                        right: 10
                                    }
                                }}
                            >
                                {availableSkus.map((sku, index) => (
                                    <option
                                        disabled={!sku.isAvailable}
                                        key={sku?.skuId || `giftCardSku-${index}`}
                                        value={sku?.skuId}
                                    >
                                        {localeUtils.getFormattedPrice(sku?.listPrice, false, false)}
                                    </option>
                                ))}
                            </Select>
                            <Box
                                paddingLeft={4}
                                paddingRight={5}
                                onClick={this.addGiftCardToBasket}
                            >
                                {getText('add')}
                            </Box>
                        </Flex>
                    </Flex>
                ) : null}
            </>
        );
    }
}

export default wrapComponent(GiftCardQuickAdd, 'GiftCardQuickAdd', true);
