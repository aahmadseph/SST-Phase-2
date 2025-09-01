/* eslint-disable object-curly-newline */

/* eslint-disable camelcase */
import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import ConstructorCarousel from 'components/ConstructorCarousel';
import { CONSTRUCTOR_PODS, INGREDIENT_PREFERENCES } from 'constants/constructorConstants';

function CleanHighlightProducts({ itemId, closeParentModal }) {
    const params = {
        itemIds: itemId,
        filters: { 'Ingredient Preferences': INGREDIENT_PREFERENCES.CLEAN_AT_SEPHORA }
    };

    return (
        <ConstructorCarousel
            podId={CONSTRUCTOR_PODS.CLEAN_HIGHLIGHT}
            params={params}
            closeParentModal={closeParentModal}
        />
    );
}

export default wrapFunctionalComponent(CleanHighlightProducts, 'CleanHighlightProducts');
