/* eslint-disable eqeqeq */

import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Flex, Icon } from 'components/ui';
import languageLocale from 'utils/LanguageLocale';
import store from 'Store';
import skuHelpers from 'utils/skuHelpers';

const getText = languageLocale.getLocaleResourceFile('components/Product/ProductLovesCount/locales', 'ProductLovesCount');

class ProductLovesCount extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            lovesCount: props.product.lovesCount
        };
    }

    render() {
        const { lovesCount } = this.state;
        const { isCountOnly, dataAt, ...props } = this.props;

        return isCountOnly ? (
            <Flex
                alignItems='center'
                {...props}
            >
                <Icon
                    name='heart'
                    size='1em'
                />
                <span
                    css={{
                        marginLeft: '.5em',
                        fontWeight: 'var(--font-weight-normal)'
                    }}
                >
                    <span
                        data-at={Sephora.debug.dataAt(dataAt)}
                        children={lovesCount}
                    />
                </span>
            </Flex>
        ) : (
            <Flex
                alignItems='center'
                {...props}
            >
                <Icon
                    name='heart'
                    size='1.125em'
                />
                <span css={{ marginLeft: '.5em' }}>
                    <span
                        data-at={Sephora.debug.dataAt(dataAt)}
                        children={lovesCount}
                    />
                    {getText(lovesCount === 1 ? 'love' : 'loves')}
                </span>
            </Flex>
        );
    }

    componentDidMount() {
        /**
         * API doesn't respond immediately with proper count of product loves.
         * Count will be updated on server side only in 3 hours,
         * so we need to listen for user loves actions and mimic the effect of
         * immediate updating of Product loves count
         */
        store.setAndWatch('loves.shoppingListIds', this, () => {
            this.setState({ lovesCount: skuHelpers.getProductLovesCount(this.props.product) });
        });
    }
}

export default wrapComponent(ProductLovesCount, 'ProductLovesCount', true);
