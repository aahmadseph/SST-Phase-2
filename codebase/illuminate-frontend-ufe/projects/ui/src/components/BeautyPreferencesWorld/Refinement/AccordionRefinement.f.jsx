import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import Accordion from 'components/Accordion/Accordion';

function AccordionRefinement({
    refinementKey,
    refinementValue,
    isExpanded,
    accordionHeaderDescription = null,
    onAccordionRefinementClick,
    ExpandedContentComponent,
    expandedContentProps,
    isLastRefinement = false,
    hasSavedHeaderContent = false,
    allowCollapsedAutoHeight = false
}) {
    if (!refinementKey || !refinementValue) {
        return null;
    }

    return (
        <Accordion
            key={refinementKey}
            id={refinementKey}
            title={refinementValue}
            isExpanded={isExpanded}
            onClick={onAccordionRefinementClick}
            descriptionChildren={accordionHeaderDescription}
            // Render bottom divider only for the last refinement
            showBottomDivider={isLastRefinement}
            hasSavedHeaderContent={hasSavedHeaderContent}
            allowCollapsedAutoHeight={allowCollapsedAutoHeight}
        >
            {isExpanded && ExpandedContentComponent && <ExpandedContentComponent {...expandedContentProps} />}
        </Accordion>
    );
}

export default wrapFunctionalComponent(AccordionRefinement, 'AccordionRefinement');
