/* eslint-disable complexity */
/* eslint-disable class-methods-use-this */
import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import AccordionRefinement from 'components/BeautyPreferencesWorld/Refinement/AccordionRefinement';
import RefinementDisplayFactory from 'components/BeautyPreferencesWorld/Refinement/RefinementDisplayFactory';
import TooltipModal from 'components/Header/BeautyPreferences/TooltipModal';
import { Button, Flex } from 'components/ui';
import bpRedesignedUtils from 'utils/BeautyPreferencesRedesigned';
import languageLocale from 'utils/LanguageLocale';
import InfoButton from 'components/InfoButton/InfoButton';
import UIUtils from 'utils/UI';
import store from 'store/Store';
import Actions from 'Actions';
import { HEADER_VALUE } from 'constants/authentication';

const { isSMUI } = UIUtils;
const getText = languageLocale.getLocaleResourceFile('components/BeautyPreferencesWorld/Refinement/locales', 'Refinement');

class Refinement extends BaseClass {
    state = {
        refinementItemsSelected: [],
        tooltipModalIsOpen: false
    };

    componentDidMount() {
        this.setState({
            refinementItemsSelected: this.props.initialRefinementItemsSelected || []
        });
    }

    componentDidUpdate(prevProps) {
        const isNewCustomerPreference = !this.areArraysSame(prevProps.initialRefinementItemsSelected, this.props.initialRefinementItemsSelected);

        if (isNewCustomerPreference) {
            this.setState({
                refinementItemsSelected: this.props.initialRefinementItemsSelected || []
            });
        }
    }

    onRefinementItemSelect = (e, refinementItem) => {
        const refinementKey = refinementItem?.key;

        if (refinementKey) {
            const isRefinementSelected = this.state.refinementItemsSelected.includes(refinementKey);

            if (isRefinementSelected) {
                this.unSelectRefinementItem(refinementKey);
            } else {
                this.selectRefinementItem(refinementKey);
            }
        }
    };

    unSelectRefinementItem = refinementKey => {
        const newRefinementItems = this.state.refinementItemsSelected.filter(key => key !== refinementKey);
        this.setState({ refinementItemsSelected: newRefinementItems });
    };

    selectRefinementItem = refinementKey => {
        if (this.isRefinementSingleSelect() || this.isRefinementItemNotSureOrNotPreference(refinementKey)) {
            this.setState({
                refinementItemsSelected: [refinementKey]
            });

            return;
        }

        const refinementItemsWithoutNotSureOrNotPreference = this.state.refinementItemsSelected.filter(
            itemKey => !this.isRefinementItemNotSureOrNotPreference(itemKey)
        );

        this.setState({
            refinementItemsSelected: [...refinementItemsWithoutNotSureOrNotPreference, refinementKey]
        });
    };

    selectRefinementItems = refinementItems => {
        if (!Array.isArray(refinementItems)) {
            throw new Error('Refinement items selected are not array');
        }

        this.setState({
            refinementItemsSelected: refinementItems
        });
    };

    areArraysSame = (array1, array2) => {
        if (array1.length !== array2.length) {
            return false;
        }

        const sorted1 = [...array1].sort();
        const sorted2 = [...array2].sort();

        return sorted1.every((val, i) => val === sorted2[i]);
    };

    handleSignInClick = () => {
        store.dispatch(Actions.showSignInModal({ isOpen: true, extraParams: { headerValue: HEADER_VALUE.USER_CLICK } }));
    };

    callToAction = () => {
        if (!RefinementDisplayFactory.shouldShowCallToAction(this.props.refinement)) {
            return null;
        }

        if (this.props.isAnonymous) {
            return this.renderAnonymousCTA();
        } else {
            return this.renderLoggedInCTA();
        }
    };

    renderAnonymousCTA = () => {
        const hasSelection = !!this.state.refinementItemsSelected?.length > 0;

        return (
            <Flex
                justifyContent='center'
                gridColumn='1 / -1'
                gap='4'
            >
                <Button
                    css={styles.skipButton}
                    variant='primary'
                    size={isSMUI() ? 'sm' : 'md'}
                    disabled={!hasSelection}
                    onClick={this.handleSignInClick}
                >
                    {getText('signInToSave')}
                </Button>
            </Flex>
        );
    };

    renderLoggedInCTA = () => {
        const disableSave = this.areArraysSame(this.props.initialRefinementItemsSelected, this.state.refinementItemsSelected);
        const { isBeautyInsider, onJoinBeautyInsider } = this.props;
        const styles = {
            skipButton: {
                alignSelf: 'center'
            },
            skipLinkButton: {
                textDecoration: 'none',
                borderBottom: '0',
                borderBottomColor: 'transparent',
                borderBottomStyle: 'none',
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' }
            },
            ctaContainer: {
                justifyContent: 'center',
                gridColumn: '1 / -1',
                gap: '0',
                columnGap: '2px'
            }
        };

        return (
            <Flex css={styles.ctaContainer}>
                {this.props.refinement?.showSkip && (
                    <Button
                        variant='link'
                        css={styles.skipLinkButton}
                        onClick={e => this.props.onRefinementSkip?.({ e, ...this.props, ...this.state })}
                    >
                        {getText('skipThisQuestion')}
                    </Button>
                )}
                {!isBeautyInsider && !this.props.isAnonymous ? (
                    <Button
                        variant='primary'
                        disabled={disableSave}
                        onClick={onJoinBeautyInsider}
                    >
                        {getText('joinBeautyInsiderToSave')}
                    </Button>
                ) : (
                    <Button
                        css={styles.skipButton}
                        disabled={disableSave}
                        variant={disableSave ? 'secondary' : 'primary'}
                        size={isSMUI() ? 'sm' : 'md'}
                        onClick={e =>
                            this.props.onRefinementSave?.({
                                e,
                                ...this.props,
                                ...this.state
                            })
                        }
                    >
                        {getText('saveAndContinue')}
                    </Button>
                )}
            </Flex>
        );
    };

    isRefinementSingleSelect = () => {
        return this.props.refinement?.selectionType === bpRedesignedUtils.SELECTION_TYPES.SINGLE;
    };

    isRefinementItemNotSureOrNotPreference = refinementKey => {
        return refinementKey?.includes('notSure') || refinementKey?.includes('noPreference');
    };

    isColorIQContent = () => this.props.refinement?.selectionType === 'COLORIQ' || this.props.refinement?.key === 'colorIq';

    refinementSelectionInstructions = () => {
        const isSingleSelect = this.isRefinementSingleSelect();

        if (this.props.refinement?.syncedWorlds?.length) {
            const worldTitles = [];
            this.props.refinement.syncedWorlds.forEach(worldKey => {
                const worldInfo = bpRedesignedUtils.getMasterListRefinementWorldByKey(worldKey);

                if (worldInfo) {
                    worldTitles.push(worldInfo.value);
                }
            });

            if (worldTitles.length) {
                const words = worldTitles.join(getText('and'));

                return getText(isSingleSelect ? 'appliesToOne' : 'appliesToAll', [words]);
            }
        }

        return getText(isSingleSelect ? 'selectOne' : 'selectAll');
    };

    showTooltipModal = () => {
        this.setState({ tooltipModalIsOpen: true });
    };

    closeTooltipModal = () => {
        this.setState({ tooltipModalIsOpen: false });
    };

    accordionHeaderDescription = () => {
        const factoryProps = {
            ...this.props,
            refinementItemsSelected: this.state.refinementItemsSelected,
            onRefinementItemSelect: this.onRefinementItemSelect,
            callToAction: this.callToAction,
            onSkipClick: e => this.props.onRefinementSkip?.({ e, refinement: this.props.refinement, ...this.state }),
            selectRefinementItems: this.selectRefinementItems,
            refinementSelectionInstructions: this.refinementSelectionInstructions()
        };

        return RefinementDisplayFactory.getAccordionHeaderDescription(this.props.refinement, factoryProps);
    };

    render() {
        const {
            refinement,
            isExpanded,
            refinementDisplayType,
            refinementItems,
            smallDisplayColumns,
            largeDisplayColumns,
            onAccordionRefinementClick,
            worldCustomerPreference,
            worldValue
        } = this.props;

        const refinementKey = refinement.key;
        const refinementValue = refinement.value;
        const refinementType = RefinementDisplayFactory.getRefinementType(refinement);

        // Create title with info icon if needed
        const accordionTitle = RefinementDisplayFactory.shouldShowInfoIcon(refinement) ? (
            <Flex alignItems='center'>
                {refinementValue}
                <InfoButton
                    marginLeft={1}
                    onClick={e => {
                        e.stopPropagation();
                        this.showTooltipModal();
                    }}
                    verticalAlign='middle'
                    size={16}
                />
            </Flex>
        ) : (
            refinementValue
        );

        // Get the component for the expanded view from the factory (only for STANDARD types)
        const ExpandedContentComponent =
            refinementType === 'SEARCHABLE' || refinementType === 'COLORIQ' ? null : RefinementDisplayFactory.getExpandedContentComponent(refinement);

        const expandedContentProps = ExpandedContentComponent
            ? {
                refinement,
                refinementDisplayType,
                refinementItems,
                smallDisplayColumns,
                largeDisplayColumns,
                onRefinementItemClick: this.onRefinementItemSelect,
                refinementItemsSelected: this.state.refinementItemsSelected,
                children: this.callToAction(),
                showSkip: refinement?.showSkip,
                onSkipClick: e => this.props.onRefinementSkip?.({ e, refinement, ...this.state }),
                selectRefinementItems: this.selectRefinementItems,
                refinementSelectionInstructions: this.refinementSelectionInstructions(),
                worldCustomerPreference,
                worldValue
            }
            : null;

        // Determine if there is any saved content to display in the header (chips/summary)
        const hasSavedHeaderContent = Array.isArray(this.state.refinementItemsSelected) && this.state.refinementItemsSelected.length > 0;

        // For ColorIQ, consider recent entries as “saved header content” for height behavior
        const isColorIQSection = refinementType === 'COLORIQ';
        const colorIQData = this.props.colorIQ;
        const recentColorIQ = Array.isArray(colorIQData)
            ? colorIQData.filter(item => !Object.prototype.hasOwnProperty.call(item, 'isRecent') || item.isRecent === 'Y' || item.isRecent === true)
            : [];
        // Allow collapsed header to auto-size when ColorIQ has saved value(s)
        const allowCollapsedAutoHeight = isColorIQSection && recentColorIQ.length > 0;

        return (
            <>
                <AccordionRefinement
                    refinementKey={refinementKey}
                    refinementValue={accordionTitle}
                    isExpanded={isExpanded}
                    onAccordionRefinementClick={onAccordionRefinementClick}
                    accordionHeaderDescription={this.accordionHeaderDescription()}
                    ExpandedContentComponent={ExpandedContentComponent}
                    expandedContentProps={expandedContentProps}
                    isLastRefinement={this.props.isLastRefinement}
                    hasSavedHeaderContent={hasSavedHeaderContent}
                    // apply flexible collapsed height for ColorIQ with saved answer
                    allowCollapsedAutoHeight={allowCollapsedAutoHeight}
                />

                {/* Color IQ Tooltip Modal */}
                {RefinementDisplayFactory.shouldShowInfoIcon(refinement) && (
                    <TooltipModal
                        close={this.closeTooltipModal}
                        isOpen={this.state.tooltipModalIsOpen}
                        buttonWidth='100%'
                    />
                )}
            </>
        );
    }
}

Refinement.propTypes = {
    isBeautyInsider: PropTypes.bool,
    onJoinBeautyInsider: PropTypes.func,
    isLastQuestionForWorld: PropTypes.bool,
    isLastRefinement: PropTypes.bool
};

Refinement.defaultProps = {
    isBeautyInsider: false,
    onJoinBeautyInsider: () => {},
    isLastQuestionForWorld: false,
    isLastRefinement: false
};

const styles = {
    skipButton: {
        alignSelf: 'center'
    }
};

export default wrapComponent(Refinement, 'Refinement', true);
