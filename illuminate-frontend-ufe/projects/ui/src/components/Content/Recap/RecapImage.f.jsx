import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import ProductImage from 'components/Product/ProductImage';

function RecapImage({ sku, ...props }) {
    return (
        <ProductImage
            id={sku.skuId || sku?.currentSku?.skuId}
            skuImages={sku.skuImages}
            altText={`${sku.brandName} ${sku.productName}`}
            hideBadge={true}
            {...props}
        />
    );
}

RecapImage.propTypes = {
    sku: PropTypes.object.isRequired,
    size: PropTypes.oneOfType([PropTypes.number, PropTypes.array])
};

RecapImage.defaultProps = {
    size: [122, 166]
};

export default wrapFunctionalComponent(RecapImage, 'RecapImage');
