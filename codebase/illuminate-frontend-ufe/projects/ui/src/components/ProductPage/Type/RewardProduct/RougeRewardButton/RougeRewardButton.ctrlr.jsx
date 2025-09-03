/* eslint-disable class-methods-use-this */

import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import localeUtils from 'utils/LanguageLocale';
import resourceWrapper from 'utils/framework/resourceWrapper';

import store from 'store/Store';

import { mediaQueries } from 'style/config';
import { Grid, Text, Link } from 'components/ui';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import AddToBasketButton from 'components/AddToBasketButton';

import rrcUtils from 'utils/RrcTermsAndConditions';
import actions from 'actions/Actions';
import skuHelpers from 'utils/skuHelpers';
import basketUtils from 'utils/Basket';

import userUtils from 'utils/User';
import anaConstants from 'analytics/constants';

const { ADD_TO_BASKET_TYPES } = basketUtils;

const getText = resourceWrapper(
    localeUtils.getLocaleResourceFile('components/ProductPage/Type/RewardProduct/RougeRewardButton/locales', 'RougeRewardButton')
);

class RougeRewardButton extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            acceptTerms: false,
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
        const areTermsAndConditionsAccepted = rrcUtils.areRRCTermsConditionsAccepted() || false;
        const areTermsAndConditionsChecked = rrcUtils.areRRCTermsConditionsChecked() || false;
        const isInBasket = skuHelpers.isInBasket(this.props.product.currentSku.skuId);

        this.setState({
            acceptTerms: areTermsAndConditionsAccepted,
            checkedTerms: areTermsAndConditionsChecked,
            showError: !areTermsAndConditionsChecked,
            isRRCInBasket: isInBasket
        });
    };

    handleTermsClick = event => {
        event.preventDefault();
        store.dispatch(
            actions.showRougeRewardCardModal({
                isOpen: true,
                sku: this.props.product.currentSku
            })
        );
    };

    handleAcceptTerms = () => {
        rrcUtils.persistAcceptance(this.state.checkedTerms);
    };

    handleCheckTerms = event => {
        rrcUtils.persistAcceptanceCheck(event.target.checked);
    };

    render() {
        const {
            product, biExclusiveMsg, addToBasketCallback, buttonWidth, dataAt
        } = this.props;
        const { currentSku } = product;
        const isInBasket = this.state.isRRCInBasket;
        const canUserGetReward = userUtils.isRouge() && (userUtils.isBiPointsBiQualifiedFor(currentSku) || isInBasket);
        const disabled = !currentSku.isEligible || !this.state.checkedTerms || userUtils.isAnonymous() || !canUserGetReward;
        const showCheckbox = canUserGetReward && !this.state.acceptTerms && !isInBasket;

        return (
            <Grid
                {...(showCheckbox || biExclusiveMsg
                    ? {
                        marginTop: [-2, null, 0],
                        columns: [null, null, 'auto 1fr'],
                        alignItems: 'center',
                        textAlign: ['center', null, 'left'],
                        gap: [null, null, 5]
                    }
                    : null)}
            >
                <AddToBasketButton
                    data-at={Sephora.debug.dataAt(dataAt)}
                    width={buttonWidth}
                    isRRCModal={true}
                    product={product}
                    productId={product.productId}
                    sku={currentSku}
                    onSuccess={this.handleAcceptTerms}
                    analyticsContext={anaConstants.CONTEXT.BASKET_PRODUCT}
                    callback={addToBasketCallback}
                    variant={isInBasket ? ADD_TO_BASKET_TYPES.PRIMARY : ADD_TO_BASKET_TYPES.SPECIAL}
                    disabled={disabled}
                    quantity={product.currentSkuQuantity}
                />
                {showCheckbox || biExclusiveMsg ? (
                    <div css={{ [mediaQueries.smMax]: { order: -1 } }}>
                        {showCheckbox ? (
                            <Checkbox
                                display='inline-flex'
                                fontSize={['sm', null, 'base']}
                                paddingY={2}
                                onClick={this.handleCheckTerms}
                                checked={this.state.checkedTerms}
                                name='rouge_reward_card'
                            >
                                <span>
                                    {getText('checkboxContentDefaultText', false)}{' '}
                                    <Link
                                        color='blue'
                                        underline={true}
                                        padding={2}
                                        margin={-2}
                                        onClick={this.handleTermsClick}
                                        children={getText('checkboxContentDefaultLink', false)}
                                    />
                                </span>
                            </Checkbox>
                        ) : (
                            <Text
                                is='p'
                                lineHeight='tight'
                                fontSize={['xs', 'sm']}
                                paddingY={2}
                                maxWidth={[null, null, '16em']}
                                children={biExclusiveMsg}
                            />
                        )}
                    </div>
                ) : null}
            </Grid>
        );
    }
}

export default wrapComponent(RougeRewardButton, 'RougeRewardButton', true);
