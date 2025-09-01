import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import RefinementItemsDisplay from 'components/BeautyPreferencesWorld/Refinement/RefinementItemsDisplay';
import { Text } from 'components/ui';
import mediaUtils from 'utils/Media';

const { Media } = mediaUtils;

function StandardRefinementDisplay({
    isExpanded,
    refinementItems,
    smallDisplayColumns,
    largeDisplayColumns,
    refinementSelectionInstructions,
    initialRefinementItemsSelected
}) {
    if (!isExpanded) {
        if (!initialRefinementItemsSelected?.length) {
            return null;
        }

        const selectedRefinements = initialRefinementItemsSelected
            .map(itemKey => refinementItems?.find(item => item.key === itemKey))
            .filter(ref => !!ref);

        if (!selectedRefinements.length) {
            return null;
        }

        return (
            <>
                <Media lessThan='md'>
                    <RefinementItemsDisplay
                        refinementDisplayType={'smiconnoborder'}
                        refinementItems={selectedRefinements}
                        smallDisplayColumns={smallDisplayColumns}
                        largeDisplayColumns={largeDisplayColumns}
                    />
                </Media>
                <Media greaterThanOrEqual='md'>
                    <RefinementItemsDisplay
                        refinementDisplayType={'iconnoborder'}
                        refinementItems={selectedRefinements}
                        smallDisplayColumns={smallDisplayColumns}
                        largeDisplayColumns={largeDisplayColumns}
                    />
                </Media>
            </>
        );
    }

    // For expanded state, show instructions
    return <Text color='gray'>{refinementSelectionInstructions}</Text>;
}

export default wrapFunctionalComponent(StandardRefinementDisplay, 'StandardRefinementDisplay');
