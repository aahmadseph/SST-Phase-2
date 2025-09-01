import React from 'react';
import { Image } from 'components/ui';
import ProductImage from 'components/Product/ProductImage/ProductImage';
import FrameworkUtils from 'utils/framework';
import {
    colors, space, mediaQueries, lineHeights
} from 'style/config';

const { wrapFunctionalComponent } = FrameworkUtils;

const styles = {
    result: {
        display: 'flex',
        alignItems: 'center',
        minWidth: '100%',
        paddingTop: space[2],
        paddingBottom: space[2],
        lineHeight: lineHeights.tight,
        [mediaQueries.xsMax]: {
            marginLeft: -space.container,
            marginRight: -space.container,
            paddingLeft: space.container,
            paddingRight: space.container
        },
        [mediaQueries.sm]: {
            paddingLeft: space[4],
            paddingRight: space[4]
        }
    },
    resultHover: {
        backgroundColor: colors.nearWhite
    },
    resultHeader: {
        color: colors.gray
    }
};

function SearchItem({
    index = -1,
    isActive = false,
    value = '',
    productId = '',
    iconPath = '',
    defaultSku,
    sectionTitle = '',
    onMouseEnter = () => '',
    handleItemClick = () => ''
}) {
    return sectionTitle ? (
        <li
            css={[styles.result, styles.resultHeader]}
            children={sectionTitle}
        />
    ) : (
        <li
            key={productId || index}
            role='option'
            aria-selected={isActive}
            id={`site_search_result${index}`}
            css={[styles.result, isActive && styles.resultHover]}
            onMouseEnter={onMouseEnter}
            onClick={handleItemClick}
        >
            {iconPath ? (
                <Image
                    src={iconPath}
                    size={16}
                    css={{
                        marginRight: space[3],
                        marginTop: '.25em'
                    }}
                />
            ) : null}
            {defaultSku && (
                <ProductImage
                    id={defaultSku.skuId}
                    marginRight={4}
                    size={32}
                />
            )}
            <span
                css={{ flex: 1 }}
                dangerouslySetInnerHTML={{
                    __html: value
                }}
            />
        </li>
    );
}

export default wrapFunctionalComponent(SearchItem, 'SearchItem');
