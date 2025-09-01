/* eslint-disable object-curly-newline */
import Flag from 'components/Flag/Flag';
import SwatchImage from 'components/ProductPage/Swatches/SwatchImage';
import { Box } from 'components/ui';
import React from 'react';
import { colors, modal } from 'style/config';
import marketingFlagsUtil from 'utils/MarketingFlags';
import swatchUtils from 'utils/Swatch';
import { wrapFunctionalComponent } from 'utils/framework';

function ShadeFilter({ isSelected, label, value, image, onClick, sku, swatchType, isColorMatch }) {
    const newSku = isColorMatch
        ? {
            ...sku,
            match: 'match'
        }
        : sku;
    const isOutOfStock = sku.isOutOfStock && !sku.isComingSoonTreatment;
    const flags = marketingFlagsUtil.getShadeFilterFlags(newSku);

    return (
        <Box
            onClick={() => onClick(value)}
            data-at={Sephora.debug.dataAt('color_option')}
            is='div'
            display='flex'
            alignItems='center'
            paddingY={1}
            paddingX={[modal.paddingX[0] - 2, 3]}
            css={{
                outline: 0,
                transition: 'background-color .2s',
                '.no-touch &:hover, :focus': { backgroundColor: colors.nearWhite }
            }}
        >
            <SwatchImage
                src={image}
                type={swatchUtils.getSwatchType(swatchType)}
                hasOutline={true}
                isActive={isSelected}
                isOutOfStock={isOutOfStock}
                marginRight={1}
                marginLeft={`-${swatchUtils.SWATCH_BORDER}px`}
                flexShrink={0}
            />
            <div>
                {label}{' '}
                {flags.map(flag => (
                    <Flag
                        data-at={Sephora.debug.dataAt('filter_flag')}
                        key={flag.text}
                        children={flag.text}
                        backgroundColor={flag.backgroundColor}
                        marginRight={1}
                    />
                ))}
            </div>
        </Box>
    );
}

export default wrapFunctionalComponent(ShadeFilter, 'ShadeFilter');
