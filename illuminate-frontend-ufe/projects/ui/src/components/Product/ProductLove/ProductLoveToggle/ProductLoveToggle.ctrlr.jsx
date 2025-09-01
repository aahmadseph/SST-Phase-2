import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Icon } from 'components/ui';
import localeUtils from 'utils/LanguageLocale';
import store from 'Store';
import { colors, radii } from 'style/config';
import myListsUtils from 'utils/MyLists';

const getText = localeUtils.getLocaleResourceFile('components/Product/ProductLove/ProductLoveToggle/locales', 'ProductLoveToggle');

class ProductLoveToggle extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            hasHeart: false
        };
    }

    initialize = () => {
        const isSharableListEnabled = myListsUtils.isSharableListEnabled();

        if (isSharableListEnabled) {
            store.setAndWatch('loves.loveListSkuProductIds', this, ({ loveListSkuProductIds }) => {
                const { skuId } = this.props.sku;
                const { productId } = this.props;
                const comboKey = `${skuId}-${productId}`;
                this.setState({ hasHeart: loveListSkuProductIds.includes(comboKey) });
            });
        } else {
            store.setAndWatch('loves.shoppingListIds', this, data => {
                const hasHeart = data.shoppingListIds.includes(this.props.sku.skuId);
                this.setState({
                    hasHeart: hasHeart
                });
            });
        }
    };

    componentDidMount() {
        this.initialize();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.sku !== this.props.sku) {
            this.initialize();
        }
    }

    render() {
        const {
            sku,
            skuLoveData,
            mouseEnter,
            mouseLeave,
            handleOnClick,
            isActive,
            width,
            height,
            size,
            isAnonymous,
            isCircle,
            dataConstructorButton
        } = this.props;

        const displayName = sku.brandName && sku.productName ? `${sku.brandName} ${sku.productName}` : sku.imageAltText;

        return (
            <button
                css={[
                    {
                        display: 'inline-block',
                        textAlign: 'center',
                        lineHeight: 0,
                        width,
                        height
                    },
                    isCircle && {
                        borderRadius: radii.full,
                        '.no-touch &:hover, :focus': {
                            backgroundColor: colors.nearWhite
                        }
                    }
                ]}
                aria-label={
                    isAnonymous
                        ? getText('signInAriaLabel', [displayName])
                        : `${isActive ? getText('unloveLabel') : getText('loveLabel')} ${displayName}`
                }
                data-at={Sephora.debug.dataAt(isActive ? 'loved' : 'unloved')}
                onClick={e => handleOnClick(e, skuLoveData)}
                data-love-source={sku.loveSource}
                onMouseEnter={mouseEnter}
                onMouseLeave={mouseLeave}
                data-cnstrc-btn={dataConstructorButton}
            >
                <Icon
                    size={size}
                    name={this.state.hasHeart ? 'heart' : 'heartOutline'}
                    color={this.state.hasHeart ? 'red' : 'black'}
                />
            </button>
        );
    }
}

export default wrapComponent(ProductLoveToggle, 'ProductLoveToggle', true);
