import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Flex, Text } from 'components/ui';
import Icon from 'components/Icon';
import { colors } from 'style/config';
import basketUtils from 'utils/Basket';
import AddToBasketActions from 'actions/AddToBasketActions';
import Empty from 'constants/empty';

const { BASKET_TYPES } = AddToBasketActions;

const SignInCheckoutDisclaimerBanner = ({ localization, basket }) => {
    const { frictionlessCheckout } = Sephora.configurationSettings;
    const standardAndAutoreplenishBasket = basket.itemsByBasket?.find(item => item.basketType === BASKET_TYPES.STANDARD_BASKET) || Empty.Array;
    const hasAutoreplenishItems = (standardAndAutoreplenishBasket?.items || Empty.Array).some(item => item.isReplenishment);

    const hasBopisItems = !!basketUtils.getBOPISItemsCount(basket);
    const hasSDDItems = basketUtils.hasSameDayItems(basket);
    const showBanner = hasBopisItems || hasSDDItems || hasAutoreplenishItems;

    if (!frictionlessCheckout?.global?.isEnabled || !showBanner) {
        return null;
    }

    return (
        <Flex
            backgroundColor={colors.nearWhite}
            p={2}
            borderRadius={1}
            my={3}
            flexDirection='row'
            alignItems='center'
            justifyContent='space-between'
            gap={1}
        >
            <Icon name='infoFilled' />
            <Text
                fontSize='sm'
                children={localization.disclaimerBannerText}
            />
        </Flex>
    );
};

export default wrapFunctionalComponent(SignInCheckoutDisclaimerBanner, 'SignInCheckoutDisclaimerBanner');
