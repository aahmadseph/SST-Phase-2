import Flag from 'components/Flag/Flag';
import SwatchImage from 'components/ProductPage/Swatches/SwatchImage';
import { Box } from 'components/ui';
import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';
import { colors } from 'style/config';
import marketingFlagsUtil from 'utils/MarketingFlags';
import swatchUtils from 'utils/Swatch';
import { wrapFunctionalComponent } from 'utils/framework';

const FilterItem = forwardRef((props, ref) => {
    const {
        sku = {}, desc, selected, itemType, onItemToggled, isColorMatch, paddingX
    } = props;
    const newSku = isColorMatch
        ? {
            ...sku,
            match: 'match'
        }
        : sku;
    const isOutOfStock = sku.isOutOfStock || sku.isComingSoonTreatment;
    const flags = marketingFlagsUtil.getShadeFilterFlags(newSku);

    return (
        <Box
            ref={ref}
            is='div'
            display='flex'
            alignItems='center'
            paddingY={1}
            paddingX={paddingX}
            onClick={() =>
                onItemToggled({
                    skuId: sku.skuId,
                    desc
                })
            }
            css={{
                outline: 0,
                transition: 'background-color .2s',
                '.no-touch &:hover, :focus': { backgroundColor: colors.nearWhite }
            }}
        >
            <SwatchImage
                src={sku.smallImage}
                type={swatchUtils.getSwatchType(itemType)}
                hasOutline={true}
                isActive={selected}
                isOutOfStock={isOutOfStock}
                marginRight={1}
                marginLeft={`-${swatchUtils.SWATCH_BORDER}px`}
                flexShrink={0}
                data-at={selected ? Sephora.debug.dataAt('color_swatch_selected') : Sephora.debug.dataAt('color_swatch_option')}
            />
            <div data-at={Sephora.debug.dataAt('color_swatch_name')}>
                {desc}{' '}
                {flags.map(({ text, backgroundColor }) => (
                    <Flag
                        key={text}
                        children={text}
                        backgroundColor={backgroundColor}
                        marginRight={1}
                    />
                ))}
            </div>
        </Box>
    );
});

FilterItem.defaultProps = {
    paddingX: 3
};

FilterItem.propTypes = { onItemToggled: PropTypes.func.isRequired };

export default wrapFunctionalComponent(FilterItem, 'FilterItem');
