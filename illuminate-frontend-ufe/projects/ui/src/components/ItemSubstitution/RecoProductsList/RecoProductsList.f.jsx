import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import ItemSubstitutionRecommendation from 'components/ItemSubstitution/ItemSubstitutionRecommendation';

function RecoProductsList(props) {
    const { recoProducts, selectedProductId, fulfillmentType, firstChoiceItem } = props;

    if (!recoProducts?.length) {
        return null;
    }

    return (
        <>
            {recoProducts.map(productRec => (
                <ItemSubstitutionRecommendation
                    key={productRec.currentSku.skuId}
                    productRec={productRec}
                    selectedProductId={selectedProductId}
                    fulfillmentType={fulfillmentType}
                    firstChoiceItem={firstChoiceItem}
                />
            ))}
        </>
    );
}

export default wrapFunctionalComponent(RecoProductsList, 'RecoProductsList');
