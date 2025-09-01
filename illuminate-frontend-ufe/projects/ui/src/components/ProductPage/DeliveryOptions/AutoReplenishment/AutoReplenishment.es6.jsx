/* eslint-disable complexity */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import PropTypes from 'prop-types';
import {
    Link, Text, Box, Flex
} from 'components/ui';
import deliveryFrequency from 'utils/DeliveryFrequency';
import { globalModals, renderModal } from 'utils/globalModals';
const { AUTO_REPLENISH_PRODUCT_INFO } = globalModals;

const { formatSavingAmountString, formatFrequencyType, formatCurrency } = deliveryFrequency;

class AutoReplenishment extends BaseClass {
    constructor(props) {
        super(props);

        this.state = { showAutoReplenishmentDetails: false };
    }

    componentDidUpdate() {
        if (!this.props.autoReplenishChecked && this.state.showAutoReplenishmentDetails) {
            this.setState({ showAutoReplenishmentDetails: false });
        }
    }

    expandAutoReplenishDetails() {
        this.setState({ showAutoReplenishmentDetails: true });
    }

    render() {
        const {
            currentSku,
            listPrice,
            quantity,
            isReplenishmentEligible,
            replenishmentFreqNum,
            replenishmentFreqType,
            isAutoReplenMostCommon,
            openDeliveryFrequencyModal,
            bccMediaSpecInfo,
            textResources
        } = this.props;

        const {
            aboutAutoReplenish,
            deliveryEveryText,
            mostCommonText,
            autoReplenishLegalOptInText,
            subscriptionNotAvailableText,
            autoReplenishFirstTimeLegalDetails,
            autoReplenishPromoLegalCopyShown,
            autoReplenishLegalMoreDetailsText
        } = textResources;

        const { showAutoReplenishmentDetails } = this.state;

        const { acceleratedPromotion, replenishmentAdjuster } = currentSku;

        return (
            <>
                <Flex
                    flexWrap='wrap'
                    marginBottom={1}
                    alignItems='baseline'
                >
                    {isReplenishmentEligible && replenishmentAdjuster && (
                        <Box
                            width={['100%', 'auto']}
                            marginTop={['.125em', 0]}
                        >
                            <Text
                                color='red'
                                fontWeight='bold'
                                children={`${formatSavingAmountString(currentSku, quantity, false, false, true, acceleratedPromotion)} `}
                            />
                            <del children={`${formatCurrency(listPrice, quantity)}`} />
                        </Box>
                    )}
                </Flex>
                {isReplenishmentEligible ? (
                    <>
                        <Link
                            onClick={() => openDeliveryFrequencyModal(true)}
                            arrowDirection='down'
                            padding={1}
                            margin={-1}
                        >
                            {deliveryEveryText}{' '}
                            <Text fontWeight='bold'>
                                {replenishmentFreqNum}&nbsp;
                                {formatFrequencyType(replenishmentFreqNum, replenishmentFreqType)}&nbsp;
                                {isAutoReplenMostCommon && `(${mostCommonText})`}
                            </Text>
                        </Link>
                        {acceleratedPromotion && (
                            <Text
                                is='p'
                                marginTop={3}
                                fontSize='sm'
                                color='gray'
                            >
                                {`${autoReplenishPromoLegalCopyShown} `}
                                {!showAutoReplenishmentDetails && (
                                    <Link
                                        onClick={() => this.expandAutoReplenishDetails()}
                                        fontSize='sm'
                                        color='blue'
                                        children={autoReplenishFirstTimeLegalDetails}
                                    />
                                )}
                            </Text>
                        )}
                        {showAutoReplenishmentDetails && (
                            <Text
                                is='p'
                                marginTop={3}
                                fontSize='sm'
                                color='gray'
                                children={autoReplenishLegalMoreDetailsText}
                            />
                        )}
                        <Text
                            is='p'
                            marginTop={3}
                            fontSize='sm'
                            color='gray'
                            children={autoReplenishLegalOptInText}
                        />
                    </>
                ) : (
                    <Text
                        is='p'
                        color='gray'
                        children={subscriptionNotAvailableText}
                    />
                )}
                {aboutAutoReplenish && (
                    <Text
                        is='p'
                        marginTop={2}
                    >
                        <Link
                            display='block'
                            color='blue'
                            onClick={e =>
                                renderModal(this.props.globalModals[AUTO_REPLENISH_PRODUCT_INFO], () =>
                                    this.props.showBCCMediaModal(e, {
                                        type: 'information',
                                        info: bccMediaSpecInfo
                                    })
                                )
                            }
                            padding={2}
                            margin={-2}
                            children={aboutAutoReplenish}
                        />
                    </Text>
                )}
            </>
        );
    }
}

AutoReplenishment.propTypes = {
    currentSku: PropTypes.object,
    listPrice: PropTypes.number,
    isReplenishmentEligible: PropTypes.bool,
    replenishmentFreqNum: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    replenishmentFreqType: PropTypes.string,
    isAutoReplenMostCommon: PropTypes.bool,
    openDeliveryFrequencyModal: PropTypes.func,
    textResources: PropTypes.object
};

export default wrapComponent(AutoReplenishment, 'AutoReplenishment');
