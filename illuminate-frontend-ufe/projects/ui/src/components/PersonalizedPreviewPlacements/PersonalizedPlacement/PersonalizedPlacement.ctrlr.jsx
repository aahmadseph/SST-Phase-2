import BaseClass from 'components/BaseClass';
import React from 'react';
import { wrapComponent } from 'utils/framework';
import InfoButton from 'components/InfoButton/InfoButton';
import { Box } from 'components/ui';
import personalizedPreviewPlacementsApi from 'services/api/personalizedPreviewPlacements';
import VariationCarousel from 'components/PersonalizedPreviewPlacements/VariationCarousel/VariationCarousel';
import userUtils from 'utils/User';
import localeUtils from 'utils/LanguageLocale';
import { DebouncedResize } from 'constants/events';

const getText = localeUtils.getLocaleResourceFile('components/PersonalizedPreviewPlacements/PersonalizedPlacement/locales', 'PersonalizedPlacement');
class PersonalizedPlacement extends BaseClass {
    state = {
        variations: [],
        ruleIds: [],
        variationDates: {}, // Store dates for each variation
        models: [],
        isVariationCarouselOpen: false,
        isRuleDetailBoxOpen: false,
        rule: null,
        isPrioritizationTypeStandard: false,
        parentWidth: null,
        contentType: null
    };

    infoButtonRef = React.createRef();

    setParentWidth = () => {
        this.setState({
            parentWidth: this.infoButtonRef.current?.parentElement?.clientWidth
        });
    };

    setupPersistentBanner = () => {
        if (this.props.isPersistentBanner) {
            window.addEventListener(DebouncedResize, this.setParentWidth);
            this.setParentWidth();
        }
    };

    cleanupPersistentBanner = () => {
        if (this.props.isPersistentBanner) {
            window.removeEventListener(DebouncedResize, this.setParentWidth);
        }
    };

    getPersistentBannerPosition = parentWidth => {
        const iconPlacement = parentWidth - 50;

        return iconPlacement > 1248 ? 1248 : iconPlacement;
    };

    getCurrentVariationDates = () => {
        const { variations, variationDates } = this.state;
        const { nonTargettedVariations, activePage } = this.props;
        const nullDates = { startDate: null, endDate: null };
        const isAnonymous = userUtils.isAnonymous();

        if (isAnonymous) {
            return this.getAnonymousUserDates({
                variations,
                variationDates,
                nonTargettedVariations,
                activePage,
                nullDates
            });
        }

        return this.getLoggedInUserDates(nullDates);
    };

    getAnonymousUserDates = ({
        variations, variationDates, nonTargettedVariations, activePage, nullDates
    }) => {
        // no carousel
        if (activePage === undefined || activePage === null) {
            return variationDates[variations[0]] || nullDates;
        }

        // no variations or active page is within non-targeted variations
        if (variations.length === 0 || activePage <= nonTargettedVariations.length) {
            return nullDates;
        }

        // Calculate the actual variation index (accounting for non-targeted variations)
        const nonTargetedCount = nonTargettedVariations?.length || 0;
        const variationIndex = activePage - 1 - nonTargetedCount;

        // Get the current variation
        const currentVariation = variations[variationIndex];

        if (currentVariation && variationDates[currentVariation]) {
            return variationDates[currentVariation];
        }

        // Fallback to empty dates if no specific dates found
        return nullDates;
    };

    getLoggedInUserDates = nullDates => {
        const { isNBCEnabled, isNBOEnabled } = this.props;

        // NBC
        if (isNBCEnabled) {
            const { cxsED, cxsSD } = this.props.wrappedComponentProps;

            return { startDate: cxsSD, endDate: cxsED };
        }

        // NBO + promo
        if (isNBOEnabled && this.props.wrappedComponentProps.promo) {
            const { cxsED, cxsSD } = this.props.wrappedComponentProps.promo;

            return { startDate: cxsSD, endDate: cxsED };
        }

        // Regular personalization
        return this.getRegularLoginUserDates(nullDates);
    };

    getRegularLoginUserDates = nullDates => {
        const { variationDates } = this.state;

        return Object.values(variationDates)[0] || nullDates;
    };

    triggerErrorModal = message => {
        this.props.showInfoModal({
            isOpen: true,
            title: 'Error',
            message,
            showCloseButton: true
        });
    };

    extractConditionsFromRule = ruleText => {
        const regex = /\{([^{}]+?)\}/g;
        const conditions = [];
        let match;

        while ((match = regex.exec(ruleText)) !== null) {
            const condition = match[1].trim();
            conditions.push(condition);
        }

        return conditions;
    };

    createRuleObject = data => {
        const conditions = this.extractConditionsFromRule(data?.rule);

        return {
            conj: data?.rootNode?.conj,
            conditions: conditions,
            name: data?.name,
            isPrioritizationTypeStandard: this.state.isPrioritizationTypeStandard,
            dates: {
                startDate: data?.startDate,
                endDate: data?.endDate
            }
        };
    };

    createScoreBasedRule = model => {
        const condition = `model = ${model}`;

        return {
            name: getText('scoreBasedPriority'),
            conditions: [condition],
            isPrioritizationTypeStandard: this.state.isPrioritizationTypeStandard
        };
    };

    processRuleSetData = (data, isAnonymous) => {
        const variations = [];
        const ruleIds = [];
        const models = [];

        data?.rules?.forEach(item => {
            if (isAnonymous) {
                if (!variations.includes(item?.variation)) {
                    variations.push(item?.variation);
                    ruleIds.push(item?.ruleId);
                    models.push(item?.model);
                }
            } else {
                if (item?.ruleId === this.props.personalizedComponent?.ruleId) {
                    variations.push(item?.variation);
                    ruleIds.push(item?.ruleId);
                    models.push(item?.model);
                }
            }
        });

        return { variations, ruleIds, models };
    };

    handleRuleSetSuccess = isAnonymous => {
        if (!isAnonymous) {
            this.getRuleData(this.props.personalizedComponent?.ruleId);
        }
    };

    getRuleSet = isAnonymous => {
        const contextIds = [];

        if (!isAnonymous) {
            if (this.props.isNBCEnabled || (this.props.isNBOEnabled && this.props.wrappedComponentProps.promo)) {
                this.getRuleData('', null);

                return;
            }
        }

        if (this.props.isNBCEnabled) {
            // get all context IDs from non-targeted variations
            // // add context IDs from non-targeted variations
            if (this.props.nonTargettedVariations && this.props.nonTargettedVariations.length > 0) {
                this.props.nonTargettedVariations.forEach(variation => {
                    if (variation?.personalization?.context && !contextIds.includes(variation.personalization.context)) {
                        contextIds.push(variation.personalization.context);
                    }
                });
            }
        } else {
            const contextId = isAnonymous ? this.props.contextId : this.props.personalizedComponent?.context;

            if (!isAnonymous && !this.props.personalizedComponent?.ruleId) {
                this.triggerErrorModal(getText('noRuleFound'));

                return;
            }

            if (!contextId) {
                this.triggerErrorModal(getText('noRuleFound'));

                return;
            }

            contextIds.push(contextId);
        }

        const apiToCall = this.props.isNBCEnabled
            ? personalizedPreviewPlacementsApi.getRuleSetByContextIds
            : personalizedPreviewPlacementsApi.getRuleSetByContextId;
        const param = this.props.isNBCEnabled ? contextIds : contextIds[0];

        apiToCall(param)
            .then(data => {
                // collect all rules from ruleset and pass to processRuleSetData
                const rules = data.map(item => item.rules).flat();

                const { variations, ruleIds, models } = this.processRuleSetData({ rules }, isAnonymous);
                const firstRuleSet = data[0];

                // Create variation dates mapping
                const variationDates = {};
                data.forEach(ruleset => {
                    if (ruleset?.rules) {
                        ruleset.rules.forEach(rule => {
                            if (rule?.variation) {
                                variationDates[rule.variation] = {
                                    startDate: ruleset.startDate,
                                    endDate: ruleset.endDate
                                };
                            }
                        });
                    }
                });

                this.handleRuleSetSuccess(isAnonymous);

                this.setState(
                    {
                        variations,
                        ruleIds,
                        models,
                        variationDates,
                        isVariationCarouselOpen: isAnonymous,
                        isPrioritizationTypeStandard: firstRuleSet?.prioritizationType === 'STANDARD',
                        contentType: firstRuleSet?.contentType
                    },
                    () => {
                        firstRuleSet?.contentType !== 'promotionList' &&
                            this.props.setPersonalizedVariations(this.props.contextId, this.state.variations, () => {
                                this.triggerErrorModal(getText('noBannerData'));
                                this.setState({ isVariationCarouselOpen: false });
                            });
                        firstRuleSet?.contentType === 'promotionList' && this.placementApiCall(firstRuleSet?.rules?.[0]?.ruleId);
                    }
                );
            })
            .catch(() => {
                this.triggerErrorModal(getText('noRuleSets'));
                this.setState({ isVariationCarouselOpen: false });
            });
    };

    getRuleIdForUser = (ruleForLoggedInUser, index = null) => {
        const isAnonymous = userUtils.isAnonymous();
        const offset = this.props.nonTargettedPreviewIndex ? 0 : this.props.nonTargettedVariations.length;

        if (isAnonymous) {
            if (index) {
                return this.state.ruleIds[index - 1 - offset];
            } else {
                return this.state.ruleIds[this.props.activePage - 1 - offset];
            }
        } else {
            return ruleForLoggedInUser;
        }
    };

    handleRuleDataSuccess = data => {
        const rule = this.createRuleObject(data);

        this.setState({
            rule,
            isVariationCarouselOpen: true,
            isRuleDetailBoxOpen: true
        });
    };

    handleRuleDataError = () => {
        this.triggerErrorModal(getText('noRuleData'));
        this.setState({
            isVariationCarouselOpen: false,
            isRuleDetailBoxOpen: false
        });
    };

    placementApiCall = ruleId => {
        personalizedPreviewPlacementsApi
            .getRuleDetails(ruleId)
            .then(data => {
                if (data?.statusCode === 400) {
                    this.handleRuleDataError();
                } else {
                    this.handleRuleDataSuccess(data);
                }
            })
            .catch(() => {
                this.triggerErrorModal(getText('noRuleData'));
            });
    };

    getRuleData = (ruleForLoggedInUser, index = null) => {
        // todo
        if (this.state.isPrioritizationTypeStandard) {
            const ruleId = this.getRuleIdForUser(ruleForLoggedInUser, index);
            this.placementApiCall(ruleId);
        } else {
            const rule = this.createScoreBasedRule(this.state.models[this.props.activePage - 1]);

            this.setState({
                rule,
                isVariationCarouselOpen: true,
                isRuleDetailBoxOpen: true
            });
        }
    };

    checkVariationExists = rule => {
        return this.props.p13n.variations?.[this.props.contextId]?.find(item => item?.sys?.id === rule);
    };

    setVariation = rule => {
        const variationData = {
            [this.props.contextId]: rule
        };

        // If rule is null, it means we're resetting - just set the variation to null
        if (!rule) {
            this.props.setActiveVariation(variationData);

            // reset non-targeted preview when resetting variation
            if (this.props.nonTargettedClick) {
                this.props.nonTargettedClick(-1);
            }

            return true;
        }

        const hasVariation = this.checkVariationExists(rule);

        if (!hasVariation && rule) {
            this.triggerErrorModal(getText('noBannerDataForVariation'));
            this.closeVariationCarousel();

            return false;
        }

        this.props.setActiveVariation(variationData);

        return true;
    };

    closeVariationCarousel = () => {
        this.setState({
            isVariationCarouselOpen: false
        });
    };

    closeRuleBox = () => {
        this.setState({
            isRuleDetailBoxOpen: false
        });
    };

    handleInfoButtonClick = () => {
        this.getRuleSet(userUtils.isAnonymous());
    };

    handleNonTargetedItemClick = index => {
        const nonTargetedIndex = index;

        if (this.props.nonTargettedClick) {
            this.props.nonTargettedClick(nonTargetedIndex);
        }
    };

    handleTargetedItemClick = index => {
        const targetedIndex = index - (this.props.nonTargettedVariations?.length || 0);
        const variationIsSet = this.setVariation(this.state.variations[targetedIndex - 1]);

        if (this.props.nonTargettedClick) {
            this.props.nonTargettedClick(-1);
        }

        if (this.props.activePage !== targetedIndex && this.state.isRuleDetailBoxOpen && variationIsSet) {
            this.getRuleData('', targetedIndex);
        }
    };

    // targetted and non targetted item click handler
    handleCarouselItemClick = index => {
        if (this.props.nonTargettedVariations && index <= this.props.nonTargettedVariations?.length) {
            this.handleNonTargetedItemClick(index);
        } else {
            this.handleTargetedItemClick(index);
        }
    };

    componentDidMount() {
        this.setupPersistentBanner();
        this.props.setSidData(this.props.sid);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.sid !== this.props.sid) {
            this.props.updateSidData({
                prevSid: prevProps.sid,
                currentSid: this.props.sid
            });
        }
    }

    componentWillUnmount() {
        this.cleanupPersistentBanner();
    }

    renderInfoButton = () => {
        const { isPersistentBanner } = this.props;
        const persistentBannerLeft = this.getPersistentBannerPosition(this.state.parentWidth);

        return (
            <InfoButton
                buttonType='personalizedInfo'
                position='absolute'
                top={!isPersistentBanner && 12}
                left={isPersistentBanner ? persistentBannerLeft : 12}
                bottom={isPersistentBanner && 2}
                size={[24, 34]}
                onClick={this.handleInfoButtonClick}
            />
        );
    };

    renderVariationCarousel = () => {
        if (!this.state.isVariationCarouselOpen) {
            return null;
        }

        return (
            <VariationCarousel
                sid={this.props.sid}
                onClose={() => {
                    this.closeVariationCarousel();
                    this.closeRuleBox();
                }}
                position={this.infoButtonRef.current?.getBoundingClientRect()}
                nonTargettedPreviewIndex={this.props.nonTargettedPreviewIndex}
                isNBCEnabled={this.props.isNBCEnabled}
                variations={[...(this.props.nonTargettedVariations || []), ...this.state.variations]}
                contentType={this.state.contentType}
                isNBOEnabled={this.props.isNBNOEnabled}
                dividerIndex={this.props.nonTargettedVariations ? this.props.nonTargettedVariations?.length : 0}
                activePage={this.props.activePage}
                resetVariation={() => {
                    this.closeRuleBox();
                    this.setVariation(null);
                }}
                viewRuleClick={this.getRuleData}
                onClick={this.handleCarouselItemClick}
                isRuleDetailBoxOpen={this.state.isRuleDetailBoxOpen}
                rule={{ ...this.state.rule, dates: this.getCurrentVariationDates() }}
                OnRuleClose={this.closeRuleBox}
            />
        );
    };

    render() {
        return (
            <Box
                position='relative'
                zIndex='1000'
                ref={this.infoButtonRef}
            >
                {this.renderInfoButton()}
                {this.renderVariationCarousel()}
            </Box>
        );
    }
}

export default wrapComponent(PersonalizedPlacement, 'PersonalizedPlacement');
