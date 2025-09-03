/* eslint-disable complexity */
import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Box, Flex, Text, Link
} from 'components/ui';
import SDUBanner from 'components/ProductPage/DeliveryOptions/SDUBanner';
import SDULandingPageModal from 'components/GlobalModals/SDULandingPageModal';
import InfoButton from 'components/InfoButton/InfoButton';
import Markdown from 'components/Markdown/Markdown';
import { renderModal } from 'utils/globalModals';
import helpersUtils from 'utils/Helpers';

const { replaceDoubleAsterisks } = helpersUtils;

function SameDayDelivery(props) {
    const {
        forText,
        locationText,
        changeLocationText,
        availabilityText,
        aboutSameDayDeliveryLink,
        sameDayUnavailableMessage,
        sddRougeFreeShipMessage,
        sddRougeTestV2FreeShippingMessage
    } = props.textResources;

    return (
        <>
            {sameDayUnavailableMessage && (
                <Text
                    is='p'
                    marginBottom={1}
                    color='gray'
                    children={sameDayUnavailableMessage}
                />
            )}

            <Text
                is='p'
                marginBottom='2px'
            >
                <Text
                    data-at={Sephora.debug.dataAt('pdp_see_availability_label')}
                    fontWeight={props.sameDayAvailabilityStatus && 'bold'}
                    color={props.availabilityTextColor}
                    children={availabilityText}
                />
                {` ${forText} `}
                <Link
                    onClick={() =>
                        props.showShippingDeliveryLocationModal({
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
            <Flex
                flexDirection='column'
                gap={2}
            >
                {changeLocationText && (
                    <p>
                        <Link
                            color='blue'
                            onClick={() =>
                                props.showShippingDeliveryLocationModal({
                                    isOpen: true,
                                    callback: ({ sameDayAvailable }) => {
                                        props.sameDayDeliveryClick(sameDayAvailable, true);
                                    },
                                    sduZipcodeModal: false
                                })
                            }
                            padding={2}
                            margin={-2}
                            children={changeLocationText}
                        />
                    </p>
                )}
                {props.displayedSameDayDeliveryMessage && (
                    <Text
                        is='p'
                        color='green'
                        fontSize='sm'
                    >
                        <Markdown
                            is='span'
                            css={styles.sddMessageMarkdown}
                            content={replaceDoubleAsterisks(props.sameDayDeliveryMessageCountdown || props.displayedSameDayDeliveryMessage)}
                        />
                    </Text>
                )}
                {sddRougeFreeShipMessage && (
                    <Box
                        is='p'
                        backgroundColor='white'
                        paddingX={3}
                        paddingY={2}
                        borderWidth={1}
                        borderColor='lightGray'
                        borderRadius={2}
                        children={sddRougeFreeShipMessage}
                    />
                )}
                {sddRougeTestV2FreeShippingMessage && !props.isSDUAddedToBasket ? (
                    <Box
                        is='p'
                        backgroundColor='white'
                        paddingX={3}
                        paddingY={2}
                        borderWidth={1}
                        borderColor='lightGray'
                        borderRadius={2}
                    >
                        <Text
                            marginRight={1}
                            children={sddRougeTestV2FreeShippingMessage}
                        />
                        <InfoButton
                            size={16}
                            onClick={props.showSDDRougeTestV2InfoModal}
                        />
                    </Box>
                ) : (
                    <SDUBanner
                        isSDUAddedToBasket={props.isSDUAddedToBasket}
                        skuTrialEligibility={props.skuTrialEligibility}
                        skuTrialPeriod={props.skuTrialPeriod}
                        renderSDULandingPage={props.toggleSDULandingPage}
                    />
                )}
                {props.renderSDULandingPage && (
                    <SDULandingPageModal
                        isOpen={props.renderSDULandingPage}
                        onDismiss={props.toggleSDULandingPage}
                        mediaId={props.sduMediaId}
                        skuTrialPeriod={props.skuTrialPeriod}
                        isSDUAddedToBasket={props.isSDUAddedToBasket}
                        isUserSDUTrialEligible={props.isUserSDUTrialEligible}
                        isCanada={props.isCanada}
                        skipConfirmationModal={false}
                        isUserSDUTrialAllowed={props.isUserSDUTrialAllowed}
                    />
                )}
                {aboutSameDayDeliveryLink && (
                    <p>
                        <Link
                            color='blue'
                            onClick={e =>
                                renderModal(props.sddFulFillmentServiceInfoModal, () => {
                                    props.showBCCMediaModal(e, {
                                        type: 'information',
                                        info: props.bccMediaSpecInfo
                                    });
                                })
                            }
                            padding={2}
                            margin={-2}
                            children={aboutSameDayDeliveryLink}
                        />
                    </p>
                )}
            </Flex>
        </>
    );
}

const styles = {
    sddMessageMarkdown: {
        '& > :first-child': {
            display: 'inline'
        }
    }
};
SameDayDelivery.propTypes = {
    currentProduct: PropTypes.object,
    sameDayNotAvailableForZip: PropTypes.bool,
    sameDayAvailable: PropTypes.bool,
    sameDayDeliveryClick: PropTypes.func,
    serviceUnavailable: PropTypes.bool,
    showBCCMediaModal: PropTypes.func,
    bccMediaSpecInfo: PropTypes.string,
    displayOrderCutoffCountdown: PropTypes.bool,
    isSDUAddedToBasket: PropTypes.bool,
    skuTrialEligibility: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    skuTrialPeriod: PropTypes.string,
    toggleSDULandingPage: PropTypes.func,
    renderSDULandingPage: PropTypes.bool,
    isUserSDUTrialEligible: PropTypes.bool,
    preferredZipCode: PropTypes.string,
    showSddAsAvailable: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    sameDayDeliveryMessage: PropTypes.string,
    availabilityTextColor: PropTypes.string,
    sameDayAvailabilityStatus: PropTypes.string,
    isUserSDUTrialAllowed: PropTypes.bool,
    isCanada: PropTypes.bool,
    sduMediaId: PropTypes.string,
    textResources: PropTypes.object,
    fromChooseOptionsModal: PropTypes.bool
};

export default wrapFunctionalComponent(SameDayDelivery, 'SameDayDelivery');
