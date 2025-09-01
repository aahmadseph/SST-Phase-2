/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import Pill from 'components/Pill';
import BeautyMatchTooltip from 'components/ProductPage/BeautyMatchTooltip';
import userUtils from 'utils/User';
import biProfile from 'utils/BiProfile';
import store from 'store/Store';
import communityUtils from 'utils/Community';
import Actions from 'Actions';
import Location from 'utils/Location';

class BeautyMatchFilter extends BaseClass {
    state = {
        isBiUser: false,
        checked: false,
        checkboxClicked: false,
        hasAllTraits: false,
        hasWarnings: false
    };

    componentDidMount() {
        store.setAndWatch('user', this, () => {
            this.setState({ isBiUser: userUtils.isBI() });
        });
        this.setState({ hasAllTraits: biProfile.hasAllTraits() });
    }

    componentWillReceiveProps(updatedProps) {
        const { selectedFilters, filtersConfiguration } = updatedProps;

        if (this.state.checked && biProfile.hasAllTraits()) {
            const biInfo = biProfile.getBiProfileInfo();
            const filtersThatShouldBeApplied = this.getBmMappedFilters(biInfo, filtersConfiguration);
            let needsToDeselect = false;
            Object.keys(filtersThatShouldBeApplied).forEach(filterId => {
                if (!selectedFilters[filterId] || filtersThatShouldBeApplied[filterId].find(x => selectedFilters[filterId].indexOf(x) < 0)) {
                    needsToDeselect = true;
                }
            });

            if (needsToDeselect === true) {
                this.setState({ checked: false });
            }
        }
    }

    toggleBeautyMatches = () => {
        if (!biProfile.hasAllTraits()) {
            this.setState({
                /* in order to show beauty traits popover
                when user hasn't completed the beauty traits */
                checkboxClicked: true,
                hasAllTraits: false
            });

            return;
        }

        // next code should execute if user is signed-in and has all BI traits, biProfile.getBiProfileInfo() should be defined at this point
        this.setState(
            {
                checkboxClicked: true,
                checked: !this.state.checked,
                hasAllTraits: true
            },
            () => this.applyBeautyTraits(this.state.checked)
        );
    };

    applyBeautyTraits = isActive => {
        const biInfo = biProfile.getBiProfileInfo();
        const { applyFilters, name, filtersConfiguration, selectedFilters } = this.props;
        const filtersToMerge = this.getBmMappedFilters(biInfo, filtersConfiguration);
        let filtersToApply = {};

        if (isActive) {
            filtersToApply = filtersToMerge;
            filtersToApply[name] = [true];
        } else {
            Object.keys(filtersToMerge).forEach(filterId => {
                if (selectedFilters[filterId]) {
                    filtersToApply[filterId] = selectedFilters[filterId].filter(x => filtersToMerge[filterId].indexOf(x) < 0);
                }
            });
            filtersToApply[name] = [];
        }

        applyFilters(filtersToApply);
    };

    getBmMappedFilters = (biInfo, filtersConfiguration) => {
        const filtersToApply = {};

        if (biInfo) {
            filtersConfiguration
                .filter(filter => biInfo[filter.id] && filter.contextual)
                .forEach(filter => {
                    const traitsMappedFromConfiguration = biInfo[filter.id].split(', ').filter(trait => filter.options.find(o => o.value === trait));

                    if (traitsMappedFromConfiguration.length > 0) {
                        filtersToApply[filter.id] = traitsMappedFromConfiguration;
                    }
                });
        }

        return filtersToApply;
    };

    toggle = () => {
        const isAnonymous = userUtils.isAnonymous();

        if (!isAnonymous && !biProfile.hasAllTraits()) {
            store.dispatch(
                Actions.showBeautyTraitsModal({
                    isOpen: true,
                    checkStatusCallback: this.checkUserStatusAndTraits
                })
            );
        } else {
            this.checkUserStatusAndTraits();
        }
    };

    checkUserStatusAndTraits = () => {
        communityUtils
            .ensureUserIsReadyForSocialAction(communityUtils.PROVIDER_TYPES.lithium)
            .then(() => {
                if (!biProfile.hasAllTraits()) {
                    Location.setLocation('/profile/BeautyPreferences');
                } else {
                    this.toggleBeautyMatches();
                }
            })
            .catch(() => {
                // User must be BI and must have nickname to edit profile
                if (userUtils.isBI() && userUtils.isSocial() && !biProfile.hasAllTraits()) {
                    this.toggleBeautyMatches();
                }
            });
    };

    render() {
        const { label, isActive } = this.props;
        const { checked, hasAllTraits } = this.state;
        const isSelected = checked && hasAllTraits;

        return (
            <>
                <Pill
                    data-at={Sephora.debug.dataAt('filter_pill')}
                    isActive={isSelected}
                    fontSize='sm'
                    onClick={() => this.toggle()}
                >
                    {label}
                    <BeautyMatchTooltip
                        clicked={this.state.checked}
                        isActive={isActive}
                    />
                </Pill>
            </>
        );
    }
}

export default wrapComponent(BeautyMatchFilter, 'BeautyMatchFilter', true);
