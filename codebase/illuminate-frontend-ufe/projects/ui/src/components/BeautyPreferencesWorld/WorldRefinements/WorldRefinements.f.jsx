import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import Refinement from 'components/BeautyPreferencesWorld/Refinement/Refinement';
import bpRedesignedUtils from 'utils/BeautyPreferencesRedesigned';

function WorldRefinements({
    refinements,
    refinementOpened,
    toggleRefinementOpened,
    isSmallView,
    onRefinementSave,
    onRefinementSkip,
    worldCustomerPreference,
    worldValue,
    biAccount,
    colorIQ,
    isBeautyInsider,
    onJoinBeautyInsider,
    isAnonymous
}) {
    if (!Array.isArray(refinements)) {
        return null;
    }

    return (
        <React.Fragment>
            {refinements.map((refinement, index) => {
                const refinementItems = bpRedesignedUtils.sortArrayObjectsByOrderId(refinement.items || []).filter(item => item.visableInBP);
                const refinementDisplayType = isSmallView ? refinement.smallDisplayType : refinement.largeDisplayType;
                const smallDisplayColumns = bpRedesignedUtils.getFirstValidNumberFromString(refinement.smallDisplayType);
                const largeDisplayColumns = bpRedesignedUtils.getFirstValidNumberFromString(refinement.largeDisplayType);
                const refinementItemsSelected = worldCustomerPreference[refinement.key] || [];

                return (
                    <Refinement
                        key={refinement.key}
                        refinement={refinement}
                        isExpanded={refinementOpened === refinement.key}
                        refinementDisplayType={refinementDisplayType}
                        refinementItems={refinementItems}
                        smallDisplayColumns={smallDisplayColumns}
                        largeDisplayColumns={largeDisplayColumns}
                        onAccordionRefinementClick={() => toggleRefinementOpened(refinement.key)}
                        onRefinementSave={onRefinementSave}
                        onRefinementSkip={onRefinementSkip}
                        initialRefinementItemsSelected={refinementItemsSelected}
                        worldCustomerPreference={worldCustomerPreference}
                        worldValue={worldValue}
                        biAccount={biAccount}
                        colorIQ={colorIQ}
                        isBeautyInsider={isBeautyInsider}
                        isAnonymous={isAnonymous}
                        onJoinBeautyInsider={onJoinBeautyInsider}
                        isLastRefinement={index === refinements.length - 1}
                    />
                );
            })}
        </React.Fragment>
    );
}

export default wrapFunctionalComponent(WorldRefinements, 'WorldRefinements');
