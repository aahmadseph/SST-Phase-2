/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Flex, Icon, Link } from 'components/ui';
import UpdateError from 'components/RwdCheckout/Shared/UpdateError';
import ShipMethodDescription from 'components/RwdCheckout/Sections/ShipOptions/ShipMethodDescription';
import languageLocale from 'utils/LanguageLocale';
import resourceWrapper from 'utils/framework/resourceWrapper';
import { HEADER_VALUE } from 'constants/authentication';

const { getLocaleResourceFile } = languageLocale;

class ShipOptionsDisplay extends BaseClass {
    handleSignInClick = () => {
        this.props.showSignInModal({ isOpen: true, extraParams: { headerValue: HEADER_VALUE.USER_CLICK } });
    };

    handleCreateAccountClick = () => {
        const { userEmail } = this.props;
        this.props.showRegisterModal({
            isOpen: true,
            userEmail
        });
    };

    render() {
        const getText = resourceWrapper(getLocaleResourceFile('components/RwdCheckout/Sections/ShipOptions/locales', 'ShipOptions'));
        const {
            shippingMethod,
            allItemsAreReplen,
            orderHasReplen,
            hasSDUInBasket,
            hasSignInForFreeShipMessage,
            isPhysicalGiftCard,
            shippingGroup,
            shippingGroupType,
            middleZone
        } = this.props;

        const {
            promiseDate,
            promiseDateCutOffDescription,
            promiseDateLabel,
            shippingMethodType,
            shippingMethodDescription,
            isComplete,
            shippingFee,
            shippingMethodValuePrice
        } = shippingMethod;

        let orderInfo;

        if (Sephora.isAgent) {
            orderInfo = this.props.order;
        }

        return isComplete ? (
            <div>
                {hasSignInForFreeShipMessage && (
                    <Flex
                        alignItems='center'
                        backgroundColor='nearWhite'
                        paddingY={1}
                        paddingX={4}
                        lineHeight='tight'
                        borderRadius={2}
                    >
                        <Icon
                            name='truck'
                            marginRight={3}
                            css={{ flexShrink: 0 }}
                        />
                        <span>
                            {getText(
                                'freeShipSignIn',
                                false,
                                <Link
                                    color='blue'
                                    underline={true}
                                    onClick={this.handleSignInClick}
                                    children={getText('signIn')}
                                />,
                                <Link
                                    color='blue'
                                    underline={true}
                                    onClick={this.handleCreateAccountClick}
                                    children={getText('createAccount')}
                                />,
                                <strong>{getText('freeStandardShipping')}</strong>
                            )}
                        </span>
                    </Flex>
                )}
                <ShipMethodDescription
                    orderHasReplen={orderHasReplen}
                    allItemsAreReplen={allItemsAreReplen}
                    promiseDate={promiseDate}
                    promiseDateCutOffDescription={promiseDateCutOffDescription}
                    promiseDateLabel={promiseDateLabel}
                    shippingMethodValuePrice={shippingMethodValuePrice}
                    shippingFee={shippingFee}
                    shippingMethodType={shippingMethodType}
                    shippingMethodDescription={shippingMethodDescription}
                    hasSDUInBasket={hasSDUInBasket}
                    waiveShippingFee={orderInfo?.waiveShippingFee}
                    isPhysicalGiftCard={isPhysicalGiftCard}
                    shippingGroup={shippingGroup}
                    shippingGroupType={shippingGroupType}
                    middleZone={middleZone}
                />
            </div>
        ) : (
            <UpdateError />
        );
    }
}

export default wrapComponent(ShipOptionsDisplay, 'ShipOptionsDisplay');
