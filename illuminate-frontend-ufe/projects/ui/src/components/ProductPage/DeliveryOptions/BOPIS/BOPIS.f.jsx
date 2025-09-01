/* eslint-disable complexity */
import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Text, Link, Icon, Flex
} from 'components/ui';
import CurbsidePickupIndicator from 'components/CurbsidePickupIndicator';
import ConciergeCurbsidePickupIndicator from 'components/ConciergeCurbsidePickupIndicator';
import { renderModal } from 'utils/globalModals';

function BOPIS(props) {
    const { reserveAndPickupClick } = props;
    const {
        availabilityText,
        storeNameText,
        pickupMessage,
        checkOtherStoresText,
        curbsidePickupText,
        curbsideConciergeText,
        aboutBuyOnlineAndPickUpLink,
        atText
    } = props.textResources;

    return (
        <>
            {props.disabledText ? (
                <Text
                    is='p'
                    color='gray'
                    children={props.disabledText}
                />
            ) : (
                <>
                    <Text
                        is='p'
                        marginBottom='2px'
                    >
                        <Text
                            data-at={Sephora.debug.dataAt('pickup_stock_level_label')}
                            fontWeight={props.availabilityStatus && 'bold'}
                            color={props.availabilityTextColor}
                            children={availabilityText}
                        />
                        {` ${atText} `}
                        <Link
                            onClick={e => props.showStoreListModal(e, null, { callback: reserveAndPickupClick, isFromChangeMethod: true })}
                            arrowDirection='down'
                            fontWeight='bold'
                            children={storeNameText}
                        />
                    </Text>
                    <Text
                        is='p'
                        data-at={Sephora.debug.dataAt('pickup_not_offered_label')}
                        color={props.pickupMessageColor}
                        children={pickupMessage}
                    />
                    {checkOtherStoresText && (
                        <p>
                            <Link
                                data-at={Sephora.debug.dataAt('check_other_stores_link')}
                                color='blue'
                                padding={2}
                                margin={-2}
                                onClick={e => props.showStoreListModal(e, null, { callback: reserveAndPickupClick, isFromChangeMethod: true })}
                                children={checkOtherStoresText}
                            />
                        </p>
                    )}
                    <Flex
                        alignItems='center'
                        fontSize='sm'
                        color='gray'
                        gap={2}
                        flexWrap='wrap'
                    >
                        {props.storePickupIndicator && (
                            <Flex
                                gap={1}
                                alignItems='center'
                            >
                                <Icon
                                    name='checkmark'
                                    size='1em'
                                />
                                {props.storePickupIndicator}
                            </Flex>
                        )}
                        {props.showCurbsidePickupIndicator && (
                            <CurbsidePickupIndicator
                                dataAt='curbside_indicator_label'
                                iconColor='gray'
                                children={curbsidePickupText}
                            />
                        )}
                        {props.showConciergeCurbsidePickupIndicator && (
                            <ConciergeCurbsidePickupIndicator
                                dataAt={
                                    Sephora.isMobile()
                                        ? 'concierge_curbside_indicator_stores_modal_label'
                                        : 'concierge_curbside_indicator_flyout_label'
                                }
                                iconName='checkmark'
                                iconColor='gray'
                                children={curbsideConciergeText}
                            />
                        )}
                    </Flex>
                    {aboutBuyOnlineAndPickUpLink && (
                        <Text
                            is='p'
                            marginTop={2}
                        >
                            <Link
                                display='block'
                                color='blue'
                                onClick={e => {
                                    const bccSpecInfo = {
                                        type: 'information',
                                        info: props.bccMediaSpecInfo
                                    };

                                    renderModal(props.aboutBopisModal, () => {
                                        props.showBCCMediaModal(e, bccSpecInfo);
                                    });

                                    const { sid } = props.aboutBopisModal;

                                    // When the props contains an SID, the fallback function
                                    // doesn't fire, and the analytics are not triggered.
                                    if (props.onClickAnalytics && sid) {
                                        props.onClickAnalytics(e, { bccSpecInfo });
                                    }
                                }}
                                padding={2}
                                margin={-2}
                                children={aboutBuyOnlineAndPickUpLink}
                            />
                        </Text>
                    )}
                </>
            )}
        </>
    );
}

BOPIS.propTypes = {
    currentProduct: PropTypes.object,
    preferredStoreInfo: PropTypes.object,
    reserveAndPickupClick: PropTypes.func,
    showStoreListModal: PropTypes.func,
    disabledText: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    displayOrderCutoffCountdown: PropTypes.bool,
    showBCCMediaModal: PropTypes.func,
    bccMediaSpecInfo: PropTypes.string,
    pickupStoreName: PropTypes.string,
    availabilityStatus: PropTypes.string,
    availabilityLabel: PropTypes.string,
    availabilityTextColor: PropTypes.string,
    pickupMessageColor: PropTypes.string,
    showCurbsidePickupIndicator: PropTypes.bool,
    showConciergeCurbsidePickupIndicator: PropTypes.bool,
    storePickupIndicator: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    textResources: PropTypes.object
};

export default wrapFunctionalComponent(BOPIS, 'BOPIS');
