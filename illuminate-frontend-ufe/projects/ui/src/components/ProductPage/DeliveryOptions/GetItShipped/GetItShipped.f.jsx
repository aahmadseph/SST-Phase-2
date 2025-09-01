/* eslint-disable complexity */
import React from 'react';
import PropTypes from 'prop-types';
import { Link, Box, Text } from 'components/ui';
import userUtils from 'utils/User';
import { getBiFreeShippingText } from 'utils/getBiFreeShippingText';
import { wrapFunctionalComponent } from 'utils/framework';

import languageLocale from 'utils/LanguageLocale';
import resourceWrapper from 'utils/framework/resourceWrapper';
import { renderModal } from 'utils/globalModals';
import { HEADER_VALUE } from 'constants/authentication';

const getText = resourceWrapper(languageLocale.getLocaleResourceFile('components/ProductPage/DeliveryOptions/locales', 'DeliveryOptions'));

function GetItShipped(props) {
    const {
        isStoreOnly,
        textResources,
        shipToHome,
        getItShippedDeliveryMessage,
        locationText,
        showShippingDeliveryLocationModal,
        shouldDisplayEdd,
        shippingAndHandlingModal,
        showBCCMediaModal,
        fromChooseOptionsModal
    } = props;
    const { signInText, shippingAndReturnsText, createAccountText, freeStandardShippingText } = textResources;
    const isAnonymous = userUtils.isAnonymous();

    return (
        <>
            <Box>
                {shouldDisplayEdd && shipToHome?.shipToHomeMessage?.length ? (
                    <Text
                        is='p'
                        marginBottom='2px'
                    >
                        <Text
                            fontWeight={'bold'}
                            color={'green'}
                            children={getItShippedDeliveryMessage}
                        />
                        {` ${getText('to')} `}
                        <Link
                            onClick={() =>
                                showShippingDeliveryLocationModal({
                                    isOpen: true,
                                    callback: ({ sameDayAvailable }) => {
                                        props.sameDayDeliveryClick(sameDayAvailable, true);
                                    },
                                    sduZipcodeModal: false,
                                    sku: props.currentProduct?.currentSku
                                })
                            }
                            arrowDirection='down'
                            padding={2}
                            margin={-2}
                            fontWeight='bold'
                            children={locationText}
                        ></Link>
                    </Text>
                ) : null}
                {isAnonymous ? (
                    <span>
                        {getText(
                            'freeShipSignIn',
                            false,
                            <Link
                                color='blue'
                                underline={true}
                                onClick={() => props.showSignInModal({ isOpen: true, extraParams: { headerValue: HEADER_VALUE.USER_CLICK } })}
                                children={signInText}
                            />,
                            <Link
                                color='blue'
                                underline={true}
                                onClick={() => props.showRegisterModal({ isOpen: true })}
                                children={createAccountText}
                            />,
                            <strong css={{ display: 'inline-flex' }}>{freeStandardShippingText}</strong>
                        )}
                    </span>
                ) : (
                    <Text
                        is='p'
                        fontSize='sm'
                        children={getBiFreeShippingText(null, true, fromChooseOptionsModal)}
                        marginBottom={[3, 3, 1]}
                        css={{
                            whiteSpace: 'normal'
                        }}
                    />
                )}
            </Box>
            {!isStoreOnly && (
                <Link
                    color='blue'
                    padding={2}
                    margin={-2}
                    data-at={Sephora.debug.dataAt('pdp_shipping_information_link')}
                    onClick={e => {
                        const bccSpecInfo = {
                            type: 'shipping'
                        };

                        renderModal(shippingAndHandlingModal, () => {
                            showBCCMediaModal(e, bccSpecInfo);
                        });

                        const { sid } = shippingAndHandlingModal;

                        // When the props contains an SID, the fallback function
                        // doesn't fire, and the analytics are not triggered.
                        if (props.onClickAnalytics && sid) {
                            props.onClickAnalytics(e, { bccSpecInfo });
                        }
                    }}
                    children={shippingAndReturnsText}
                />
            )}
        </>
    );
}

GetItShipped.propTypes = {
    currentProduct: PropTypes.object,
    currentSku: PropTypes.object,
    shippingMethodNotAvailable: PropTypes.bool,
    serviceUnavailable: PropTypes.bool,
    sameDayNotAvailableForZip: PropTypes.bool,
    quantity: PropTypes.number,
    isUserSduTrialEligible: PropTypes.bool,
    showBCCMediaModal: PropTypes.func,
    basket: PropTypes.object,
    isStoreOnly: PropTypes.bool,
    showSignInModal: PropTypes.func,
    showRegisterModal: PropTypes.func,
    textResources: PropTypes.object,
    fromChooseOptionsModal: PropTypes.bool
};

export default wrapFunctionalComponent(GetItShipped, 'GetItShipped');
