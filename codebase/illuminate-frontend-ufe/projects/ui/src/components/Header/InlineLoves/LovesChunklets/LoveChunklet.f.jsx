import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Text, Flex } from 'components/ui';
import { fontSizes, colors } from 'style/config';
import localeUtils from 'utils/LanguageLocale';
import ProductImage from 'components/Product/ProductImage';
import { LOVES_URL } from 'constants/sharableList';

const LoveChunklet = ({
    list, thumbnails, thumbnailWidth, thumbnailHeight, handleLinkClick, toggleModal
}) => {
    const { shoppingListName, shoppingListItemsCount, shoppingListId } = list;
    const getText = text => localeUtils.getLocaleResourceFile('components/Header/InlineLoves/locales', 'InlineLoves')(text);

    return (
        <Flex
            onClick={e => handleLinkClick(e, `${LOVES_URL}/${shoppingListId}`, toggleModal)}
            css={styles.root}
        >
            <Flex css={styles.firstColumn}>
                <Text
                    is='p'
                    css={styles.listName}
                >
                    {shoppingListName}
                </Text>
                <Text
                    color={colors.gray}
                    is='p'
                >
                    {shoppingListItemsCount} {getText('items')}
                </Text>
            </Flex>
            <Flex>{getSkuImages({ list, thumbnails, thumbnailWidth, thumbnailHeight })}</Flex>
        </Flex>
    );
};

const getSkuImages = ({ list, thumbnails, thumbnailWidth = 32, thumbnailHeight = 32 }) => {
    const { shoppingListItems } = list;
    const images = shoppingListItems.slice(0, thumbnails).map(item => {
        const altText = item?.sku?.productName;

        return (
            <ProductImage
                id={item?.sku.skuId || item?.sku?.currentSku?.skuId}
                skuImages={item?.sku.skuImages}
                altText={altText}
                hideBadge={true}
                width={thumbnailWidth}
                height={thumbnailHeight}
            />
        );
    });

    return images.length > 0 ? images : [null];
};

const styles = {
    root: {
        boxShadow: 'rgba(0, 0, 0, 0.2) 0px 0px 6px 0px',
        margin: '16px 0',
        padding: '8px 12px',
        borderRadius: '4px'
    },
    firstColumn: {
        maxWidth: '142px',
        flexDirection: 'column',
        paddingRight: '8px'
    },
    listName: {
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        fontSize: fontSizes.sm
    }
};

export default wrapFunctionalComponent(LoveChunklet, 'LoveChunklet');
