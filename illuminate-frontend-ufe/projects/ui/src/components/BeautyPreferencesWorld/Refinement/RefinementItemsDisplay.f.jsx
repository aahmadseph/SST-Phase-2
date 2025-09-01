import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import RefinementItem from 'components/BeautyPreferencesWorld/RefinementItem/RefinementItem';
import { Grid } from 'components/ui';

function RefinementItemsDisplay({
    refinementDisplayType,
    refinementItems = [],
    smallDisplayColumns,
    largeDisplayColumns,
    onRefinementItemClick,
    refinementItemsSelected = [],
    children,
    refinement
}) {
    return (
        <Grid columns={[`repeat(${smallDisplayColumns ?? 3}, 1fr)`, `repeat(${largeDisplayColumns ?? 3}, 1fr)`]}>
            {refinementItems.map(refinementItem => (
                <RefinementItem
                    refinement={refinement}
                    key={refinementItem.key}
                    refinementItem={refinementItem}
                    displayType={refinementDisplayType}
                    onRefinementItemClick={e => onRefinementItemClick(e, refinementItem)}
                    isSelected={refinementItemsSelected.includes(refinementItem.key)}
                />
            ))}
            {children}
        </Grid>
    );
}

export default wrapFunctionalComponent(RefinementItemsDisplay, 'RefinementItemsDisplay');
