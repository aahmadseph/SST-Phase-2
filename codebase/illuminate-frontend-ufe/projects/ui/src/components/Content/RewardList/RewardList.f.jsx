import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import content from 'constants/content';
import { Box, Button, Text } from 'components/ui';
import ProductList from 'components/Content/ProductList';
import AddToBasketButton from 'components/AddToBasketButton';
import basketUtils from 'utils/Basket';
import auth from 'utils/Authentication';
import anaConstants from 'analytics/constants';
import constants from 'constants/content';
import { sendCmsComponentEvent } from 'analytics/utils/cmsComponents';
import { HEADER_VALUE } from 'constants/authentication';

const {
    CMS_COMPONENT_EVENTS: { ITEM_CLICK }
} = anaConstants;

const {
    COMPONENT_TYPES: { REWARD_LIST }
} = constants;

const { CONTEXTS, COMPONENT_SPACING, PRODUCT_LIST_GROUPING } = content;
const { ADD_TO_BASKET_TYPES: ADD_BUTTON_TYPE } = basketUtils;

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

function renderBiButton(props, sid) {
    const { title } = props;

    return ({ analyticsContext, sku }) => {
        const triggerClick = function () {
            sendCmsComponentEvent({
                title,
                sid,
                items: [sku],
                eventName: ITEM_CLICK,
                component: REWARD_LIST
            });
        };

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
                            maxHeight={'initial'}
                            paddingY={1}
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
                            triggerAnalytics={triggerClick}
                        />
                    )}
                </Box>
            </>
        );
    };
}

const RewardList = ({
    sid, marginTop, marginBottom, context, ...props
}) => {
    return (
        <Box
            id={sid}
            marginTop={marginTop}
            marginBottom={marginBottom}
        >
            <ProductList
                skuList={props.biRewards}
                title={props.translations.beautyInsiderRewards}
                action={{
                    targetUrl: '/rewards'
                }}
                actionLabel={props.translations.viewAll}
                page={props.page}
                showSkeleton={props.showSkeleton}
                renderSubHeader={renderBiSigninModule(props.biSigninModulePhase())}
                renderBiButton={renderBiButton(props, sid)}
                showQuickLookOnMobile={true}
                ignoreTargetUrlForBox
                context={context}
                sid={sid}
                componentType={REWARD_LIST}
                grouping={[PRODUCT_LIST_GROUPING.SHOW_MARKETING_FLAGS]}
                rougeBadgeText={props.translations.rougeBadgeText}
                isRewardProductList={true}
            />
        </Box>
    );
};

RewardList.propTypes = {
    context: PropTypes.oneOf([CONTEXTS.CONTAINER, CONTEXTS.MODAL]).isRequired,
    sid: PropTypes.string,
    marginTop: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
    marginBottom: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
    biRewards: PropTypes.array,
    // from connect
    translations: PropTypes.object.isRequired,
    isAnonymous: PropTypes.bool.isRequired,
    showSkeleton: PropTypes.bool.isRequired,
    biSigninModulePhase: PropTypes.func.isRequired
};

RewardList.defaultProps = {
    sid: null,
    biRewards: [],
    marginTop: COMPONENT_SPACING.LG,
    marginBottom: COMPONENT_SPACING.LG
};

export default wrapFunctionalComponent(RewardList, 'RewardList');
