/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';

import store from 'store/Store';
import rrcUtils from 'utils/RrcTermsAndConditions';
import actions from 'actions/Actions';
import skuHelpers from 'utils/skuHelpers';

import { Text, Button, Link } from 'components/ui';
import AddToBasketButton from 'components/AddToBasketButton';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import BasketUtils from 'utils/Basket';
import userUtils from 'utils/User';
import rougeExclusive from 'utils/rougeExclusive';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import resourceWrapper from 'utils/framework/resourceWrapper';
import anaConstants from 'analytics/constants';

const { ADD_TO_BASKET_TYPES: ADD_BUTTON_TYPE } = BasketUtils;
const { getLocaleResourceFile } = LanguageLocaleUtils;

class RougeRewardCardButtons extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            // Indicates if user has accepted terms
            acceptTerms: false,
            // Indicates if user has clicked on “I accept T&C“
            checkedTerms: false,
            showError: false,
            isRRCInBasket: false
        };
    }

    componentDidMount() {
        this.updateTermsValues();
        store.setAndWatch('termsConditions', this, this.updateTermsValues);

        store.setAndWatch('basket', this, this.updateTermsValues);
    }

    updateTermsValues = () => {
        if (!this || !this.props || !this.props.currentSku) {
            return;
        }

        const areTermsAndConditionsAccepted = rrcUtils.areRRCTermsConditionsAccepted() || false;
        const areTermsAndConditionsChecked = rrcUtils.areRRCTermsConditionsChecked() || false;
        const isInBasket = skuHelpers.isInBasket(this.props.currentSku.skuId);

        this.setState({
            acceptTerms: areTermsAndConditionsAccepted,
            checkedTerms: areTermsAndConditionsChecked,
            showError: !areTermsAndConditionsChecked,
            isRRCInBasket: isInBasket
        });
    };

    handleTermsClick = e => {
        e.preventDefault();
        store.dispatch(
            actions.showRougeRewardCardModal({
                isOpen: true,
                sku: this.props.currentSku
            })
        );
    };

    acceptTerms = () => {
        if (!this || !this.state) {
            return;
        }

        const areTermsAndConditionsAccepted = this.state.checkedTerms;

        this.setState({
            acceptTerms: areTermsAndConditionsAccepted,
            showError: !areTermsAndConditionsAccepted
        });

        store.dispatch(
            actions.showRougeRewardCardModal({
                isOpen: false,
                sku: null
            })
        );
        store.dispatch(actions.showQuickLookModal({ isOpen: false }));

        // If the user has accepted Terms And Conditions, save it to the localStorage so
        // she does not have to accept them again
        if (rrcUtils.areRRCTermsConditionsChecked()) {
            rrcUtils.persistAcceptance(areTermsAndConditionsAccepted);
        }
    };

    handleAcceptTerms = e => {
        rrcUtils.persistAcceptanceCheck(e.target.checked);
    };

    doneCallback = () => {
        this.acceptTerms();

        if (this.props.callback) {
            this.props.callback();
        }
    };

    canUserGetReward = () => {
        const isInBasket = this.state.isRRCInBasket;
        const { currentSku } = this.props;

        return userUtils.isRouge() && (userUtils.isBiPointsBiQualifiedFor(currentSku) || isInBasket);
    };

    shouldDisableButton = () => {
        const { currentSku } = this.props;
        const { checkedTerms } = this.state;

        const isEligible = typeof currentSku?.isEligible === 'undefined' ? true : currentSku.isEligible;

        const isSkuNotEligible = !isEligible;
        const areTermsNotChecked = !checkedTerms;
        const isUserAnonymous = userUtils.isAnonymous();
        const cannotGetReward = !this.canUserGetReward();

        const disableDueToEligibility = isSkuNotEligible && !rougeExclusive.isRougeExclusiveEnabled;

        return disableDueToEligibility || areTermsNotChecked || isUserAnonymous || cannotGetReward;
    };

    render() {
        const getText = resourceWrapper(getLocaleResourceFile('components/GlobalModals/RougeRewardCardModal/locales', 'RougeRewardCardButtons'));
        const { currentSku, originalContext } = this.props;
        const isInBasket = this.state.isRRCInBasket;
        const disableButton = this.shouldDisableButton();

        return (
            <>
                <Checkbox
                    paddingY={3}
                    onClick={this.handleAcceptTerms}
                    checked={this.state.checkedTerms}
                    name='rouge_reward_card'
                >
                    {`${getText('checkboxContentIsModalCheckbox')} `}
                    <Link
                        color='blue'
                        target='_blank'
                        href={'/beauty/terms-conditions-beauty-insider'}
                        children={getText('beautyInsiderTC')}
                    />
                    {'. '}
                    <Text
                        dangerouslySetInnerHTML={{
                            __html: getText('rougeRewardValid')
                        }}
                    />
                </Checkbox>

                {isInBasket ? (
                    <Button
                        variant='special'
                        block={true}
                        onClick={this.doneCallback}
                        disabled={disableButton}
                        children={getText('done', false)}
                    />
                ) : (
                    <AddToBasketButton
                        block={true}
                        isRRCModal={true}
                        sku={currentSku}
                        variant={isInBasket ? ADD_BUTTON_TYPE.PRIMARY : ADD_BUTTON_TYPE.SPECIAL}
                        disabled={disableButton && !isInBasket}
                        onSuccess={this.acceptTerms}
                        originalContext={originalContext}
                        analyticsContext={anaConstants.CONTEXT.ROUGE_REWARD_CARD_BANNER}
                    />
                )}

                {this.state.showError && this.canUserGetReward() && !isInBasket && (
                    <Text
                        is='p'
                        fontSize='sm'
                        lineHeight='tight'
                        color={this.state.showError && 'error'}
                        marginTop={2}
                        textAlign='center'
                    >
                        {this.state.showError && getText('youMustAcceptTermsConditions', false)}
                    </Text>
                )}
            </>
        );
    }
}

export default RougeRewardCardButtons;
