import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Grid } from 'components/ui';
import RecapImage from 'components/Content/Recap/RecapImage';

const IMAGE_SIZE = [59, 79];

function RecapGrid({ skuList = [] }) {
    if (skuList.length === 1) {
        const sku = skuList[0];

        return (
            <RecapImage
                key={`recap_product_${sku.skuId}`}
                sku={sku}
            />
        );
    }

    return (
        <Grid
            width={IMAGE_SIZE}
            gap={[1, 2]}
            children={skuList.slice(0, 4).map(sku => {
                return (
                    <RecapImage
                        key={`recap_product_${sku.skuId}`}
                        sku={sku}
                        size={IMAGE_SIZE}
                    />
                );
            })}
        />
    );
}

RecapGrid.propTypes = {
    skuList: PropTypes.array.isRequired
};

export default wrapFunctionalComponent(RecapGrid, 'RecapGrid');
