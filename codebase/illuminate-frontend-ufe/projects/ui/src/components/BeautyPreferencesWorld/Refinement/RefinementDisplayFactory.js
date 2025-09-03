import React from 'react';
import ColorIQRefinementDisplay from 'components/BeautyPreferencesWorld/Refinement/ColorIQRefinementDisplay';
import SearchableRefinementDisplay from 'components/BeautyPreferencesWorld/Refinement/SearchableRefinementDisplay';
import StandardRefinementDisplay from 'components/BeautyPreferencesWorld/Refinement/StandardRefinementDisplay';
import RefinementItemsDisplay from 'components/BeautyPreferencesWorld/Refinement/RefinementItemsDisplay';
import { Text } from 'components/ui';

const REFINEMENT_TYPES = {
    COLORIQ: 'COLORIQ',
    SEARCHABLE: 'SEARCHABLE',
    STANDARD: 'STANDARD'
};

const refinementDisplayRegistry = {
    [REFINEMENT_TYPES.COLORIQ]: ColorIQRefinementDisplay,
    [REFINEMENT_TYPES.SEARCHABLE]: SearchableRefinementDisplay,
    [REFINEMENT_TYPES.STANDARD]: StandardRefinementDisplay,
    RefinementItems: RefinementItemsDisplay
};

class RefinementDisplayFactory {
    static typeMapping = {
        COLORIQ: REFINEMENT_TYPES.COLORIQ,
        colorIq: REFINEMENT_TYPES.COLORIQ,
        SEARCHABLE: REFINEMENT_TYPES.SEARCHABLE
    };

    static getRefinementType(refinement) {
        return this.typeMapping[refinement?.selectionType] || this.typeMapping[refinement?.key] || REFINEMENT_TYPES.STANDARD;
    }

    static getDisplayComponent(refinement) {
        const type = this.getRefinementType(refinement);

        return refinementDisplayRegistry[type];
    }

    static getExpandedContentComponent(refinement) {
        const type = this.getRefinementType(refinement);

        return type === REFINEMENT_TYPES.STANDARD ? refinementDisplayRegistry.RefinementItems : refinementDisplayRegistry[type];
    }

    static _buildExpandedContentProps(refinement, props) {
        return {
            refinement,
            refinementDisplayType: props.refinementDisplayType,
            refinementItems: props.refinementItems,
            smallDisplayColumns: props.smallDisplayColumns,
            largeDisplayColumns: props.largeDisplayColumns,
            onRefinementItemClick: props.onRefinementItemSelect,
            refinementItemsSelected: props.refinementItemsSelected,
            children: props.callToAction(),
            showSkip: refinement?.showSkip,
            onSkipClick: props.onSkipClick,
            selectRefinementItems: props.selectRefinementItems,
            worldCustomerPreference: props.worldCustomerPreference,
            worldValue: props.worldValue,
            onRefinementItemSelect: props.onRefinementItemSelect,
            onRefinementSave: props.onRefinementSave,
            refinementSelectionInstructions: props.refinementSelectionInstructions,
            isExpanded: props.isExpanded,
            colorIQ: props.colorIQ
        };
    }

    static _handleColorIQExpandedContent(refinement, props) {
        const ExpandedContentComponent = this.getExpandedContentComponent(refinement);

        return React.createElement(ExpandedContentComponent, this._buildExpandedContentProps(refinement, props));
    }

    static _handleSearchableContent(refinement, props) {
        const ExpandedContentComponent = this.getExpandedContentComponent(refinement);

        return React.createElement(ExpandedContentComponent, this._buildExpandedContentProps(refinement, props));
    }

    static _handleCollapsedContent(refinement, props, refinementType) {
        if (refinementType === REFINEMENT_TYPES.COLORIQ) {
            const recentColorIQ = Array.isArray(props.colorIQ)
                ? props.colorIQ.filter(
                    item => !Object.prototype.hasOwnProperty.call(item, 'isRecent') || item.isRecent === 'Y' || item.isRecent === true
                )
                : [];

            if (recentColorIQ.length === 0) {
                return null;
            }
        }

        const DisplayComponent = this.getDisplayComponent(refinement);

        return React.createElement(DisplayComponent, {
            ...props,
            initialRefinementItemsSelected: props.initialRefinementItemsSelected,
            colorIQ: props.colorIQ
        });
    }

    static getAccordionHeaderDescription(refinement, props) {
        const { isExpanded, refinementItemsSelected, refinementSelectionInstructions } = props;
        const refinementType = this.getRefinementType(refinement);

        if (isExpanded) {
            if (refinementType === REFINEMENT_TYPES.COLORIQ) {
                return this._handleColorIQExpandedContent(refinement, props);
            }

            if (refinementType === REFINEMENT_TYPES.SEARCHABLE) {
                return this._handleSearchableContent(refinement, props);
            }

            if (refinementType === REFINEMENT_TYPES.STANDARD && refinementSelectionInstructions) {
                return (
                    <Text
                        is='span'
                        color='gray'
                        fontSize='14px'
                        fontWeight='normal'
                        display='inline'
                    >
                        {refinementSelectionInstructions}
                    </Text>
                );
            }

            return null;
        }

        if (refinementType === REFINEMENT_TYPES.SEARCHABLE && refinementItemsSelected?.length > 0) {
            return React.createElement(StandardRefinementDisplay, {
                isExpanded: false,
                refinementItems: props.refinementItems,
                smallDisplayColumns: props.smallDisplayColumns,
                largeDisplayColumns: props.largeDisplayColumns,
                initialRefinementItemsSelected: refinementItemsSelected
            });
        }

        if (refinementType === REFINEMENT_TYPES.STANDARD || refinementType === REFINEMENT_TYPES.COLORIQ) {
            return this._handleCollapsedContent(refinement, props, refinementType);
        }

        return null;
    }

    static shouldShowCallToAction(refinement) {
        const type = this.getRefinementType(refinement);

        return type !== REFINEMENT_TYPES.COLORIQ;
    }

    static shouldShowInfoIcon(refinement) {
        const type = this.getRefinementType(refinement);

        return type === REFINEMENT_TYPES.COLORIQ;
    }

    static registerRefinementDisplay(type, component) {
        refinementDisplayRegistry[type] = component;
    }
}

export default RefinementDisplayFactory;

export { REFINEMENT_TYPES };
