import React from 'react';
import { fontSizes, lineHeights } from 'style/config';
import { wrapFunctionalComponent } from 'utils/framework';
import { Flex } from 'components/ui';

function ProductDisplayName(fullProps) {
    const {
        brandName, productName, fontSize = 'sm', atPrefix = 'sku_item', numberOfLines, isHovered, isBold, isRwdBasketPage
    } = fullProps;

    const lineHeight = lineHeights.tight;

    return (
        <Flex
            flexDirection={'column'}
            alignItems={isRwdBasketPage && 'flex-start'}
            css={[
                {
                    fontSize: fontSizes[fontSize],
                    lineHeight
                },
                !Sephora.isTouch && isHovered && { textDecoration: 'underline' },
                numberOfLines && {
                    overflow: 'hidden',
                    maxHeight: lineHeight * fontSizes[fontSize] * numberOfLines,
                    display: '-webkit-box',
                    WebkitLineClamp: numberOfLines,
                    WebkitBoxOrient: 'vertical',
                    textOverflow: 'ellipsis'
                }
            ]}
        >
            {brandName && (
                <span
                    css={{
                        lineHeight: 1,
                        fontWeight: 'var(--font-weight-bold)'
                    }}
                    data-at={Sephora.debug.dataAt(atPrefix + '_brand')}
                    dangerouslySetInnerHTML={{ __html: brandName }}
                />
            )}
            {brandName && productName && <br />}
            {productName && (
                <span
                    css={{ fontWeight: isBold ? 'var(--font-weight-bold)' : 'var(--font-weight-normal)' }}
                    data-at={Sephora.debug.dataAt(atPrefix + '_name')}
                    dangerouslySetInnerHTML={{ __html: productName }}
                />
            )}
        </Flex>
    );
}

export default wrapFunctionalComponent(ProductDisplayName, 'ProductDisplayName');
