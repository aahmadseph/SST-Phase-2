import React from 'react';
import store from 'Store';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Box, Flex } from 'components/ui';
import ProductDisplayName from 'components/Product/ProductDisplayName/ProductDisplayName';
import ProductImage from 'components/Product/ProductImage/ProductImage';
import AddToBasketButton from 'components/AddToBasketButton';
import IconCheckmark from 'components/LegacyIcon/IconCheckmark';
import localeUtils from 'utils/LanguageLocale';
import basketUtils from 'utils/Basket';
import { getImageAltText } from 'utils/Accessibility';
import skuHelpers from 'utils/skuHelpers';

const ADD_BUTTON_TYPE = basketUtils.ADD_TO_BASKET_TYPES;

class PromoItem extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            isInMsgPromoSkuList: false,
            maxPromoQtyReached: false
        };
    }
    render() {
        const getText = localeUtils.getLocaleResourceFile('components/Product/PromoItem/locales', 'PromoItem');
        const currentSku = Object.assign({}, this.props);
        const { isInMsgPromoSkuList } = this.state;

        return (
            <Flex
                flexDirection='column'
                width='100%'
                textAlign='center'
            >
                <div>
                    <ProductImage
                        altText={getImageAltText(currentSku)}
                        marginX='auto'
                        marginBottom={3}
                        id={currentSku.skuId}
                        src={currentSku.image}
                        size={currentSku.imageSize}
                    />
                    <ProductDisplayName
                        numberOfLines={4}
                        brandName={currentSku.brandName}
                        productName={currentSku.productName}
                    />
                </div>
                <Box
                    paddingTop={3}
                    paddingBottom={1}
                    marginTop='auto'
                >
                    {isInMsgPromoSkuList && (
                        <Flex
                            fontWeight='bold'
                            lineHeight='tight'
                            data-at={Sephora.debug.dataAt('applied_promo')}
                            alignItems='center'
                            justifyContent='center'
                        >
                            <IconCheckmark
                                fontSize='xs'
                                marginRight={1}
                            />
                            {getText('addedText')}
                        </Flex>
                    )}
                    <AddToBasketButton
                        data-at={Sephora.debug.dataAt(isInMsgPromoSkuList ? 'promo_item_remove_button' : 'promo_item_add_button')}
                        promoPanel={this.props.type}
                        sku={currentSku}
                        {...(isInMsgPromoSkuList && {
                            minHeight: 0,
                            paddingY: 2,
                            marginY: -2
                        })}
                        variant={isInMsgPromoSkuList ? ADD_BUTTON_TYPE.LINK : ADD_BUTTON_TYPE.SECONDARY}
                        disabled={!isInMsgPromoSkuList && this.state.maxPromoQtyReached}
                        text={isInMsgPromoSkuList ? getText('remove') : getText('add')}
                    />
                </Box>
            </Flex>
        );
    }

    componentDidMount() {
        const setMsgPromos = promos =>
            this.setState({
                promosList: promos.msgPromosSkuList,
                maxPromoQtyReached: this.isMaxPromosReached(),
                isInMsgPromoSkuList: skuHelpers.isInMsgPromoSkuList(this.props.skuId),
                promoError: promos.promoError
            });

        store.setAndWatch('promo', this, value => {
            setMsgPromos(value.promo);
        });
    }

    isMaxPromosReached = () => {
        const { msgPromosSkuList } = store.getState().promo;
        const selectedSkuList = msgPromosSkuList.filter(elem => elem.couponCode === this.props.couponCode);

        return selectedSkuList.length >= this.props.maxMsgSkusToSelect;
    };
}

export default wrapComponent(PromoItem, 'PromoItem', true);
