import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';

import { Box, Button, Text } from 'components/ui';
import BccRwdProductList from 'components/Bcc/BccRwdProductList';
import AddToBasketButton from 'components/AddToBasketButton';

import BasketUtils from 'utils/Basket';
import auth from 'utils/Authentication';
import anaConstants from 'analytics/constants';
import { HEADER_VALUE } from 'constants/authentication';

const {
    ADD_TO_BASKET_TYPES: { ADD_BUTTON_TYPE }
} = BasketUtils;

function signInHandler(analyticsContext) {
    return e => {
        e.preventDefault();
        digitalData.page.attributes.previousPageData.linkData = 'rewards bazaar:sign in';
        auth.requireAuthentication(
            null,
            null,
            {
                context: analyticsContext,
                nextPageContext: analyticsContext
            },
            null,
            false,
            HEADER_VALUE.USER_CLICK
        ).catch(() => {});
    };
}

function renderBiSigninModule(phase) {
    return () => {
        return (
            <Box
                marginBottom={4}
                marginTop={-4}
            >
                {phase}
            </Box>
        );
    };
}

function renderBiButton(props) {
    return ({ analyticsContext, sku }) => {
        return (
            <>
                {sku.biType && <Text fontWeight='bold'>{sku.biType.toLowerCase()}</Text>}
                <Box
                    marginTop='auto'
                    paddingTop={3}
                >
                    {props.isAnonymous ? (
                        <Button
                            variant='secondary'
                            size='sm'
                            onClick={signInHandler(analyticsContext)}
                        >
                            {props.translations.signInToAccess}
                        </Button>
                    ) : (
                        <AddToBasketButton
                            isRewardItem
                            analyticsContext={analyticsContext || anaConstants.CONTEXT.BASKET_REWARDS}
                            variant={ADD_BUTTON_TYPE.SECONDARY}
                            isAddButton={true}
                            size='sm'
                            sku={sku}
                            isBIRBReward={true}
                            onlyUseTextProp={props.translations.add}
                            containerTitle={anaConstants.CAROUSEL_NAMES.REWARD_BAZAAR}
                        />
                    )}
                </Box>
            </>
        );
    };
}

function BccRwdRewardsList(props) {
    return (
        <BccRwdProductList
            skuList={props.biRewards}
            titleText={'Beauty Insider Rewards'}
            showMoreText={props.translations.viewAll}
            showMoreUrl={'/rewards'}
            page={props.page}
            showSkeleton={props.showSkeleton}
            renderSubHeader={renderBiSigninModule(props.biSigninModulePhase())}
            renderBiButton={renderBiButton(props)}
            showAddButton={false}
            showLovesButton={false}
            showMarketingFlags={false}
            showRankingNumbers={false}
            showPrice={false}
            showRatingWithCount={false}
            showQuickLookOnMobile={true}
            ignoreTargetUrlForBox
        />
    );
}

BccRwdRewardsList.propTypes = {
    componentName: PropTypes.string.isRequired,
    biRewards: PropTypes.array.isRequired,
    // from connect
    translations: PropTypes.object.isRequired,
    isAnonymous: PropTypes.bool.isRequired,
    showSkeleton: PropTypes.bool.isRequired,
    phase: PropTypes.func.isRequired
};

export default wrapFunctionalComponent(BccRwdRewardsList, 'BccRwdRewardsList');
