import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import {
    Grid, Text, Button, Divider
} from 'components/ui';
import Modal from 'components/Modal/Modal';
import Radio from 'components/Inputs/Radio/Radio';
import DateUtils from 'utils/Date';
import Chiclet from 'components/Chiclet/Chiclet';
import CheckoutUtils from 'utils/Checkout';
import LanguageLocale from 'utils/LanguageLocale';
const getText = LanguageLocale.getLocaleResourceFile('components/Checkout/Sections/SddSections/SddSection/locales', 'SddSection');
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import anaUtils from 'analytics/utils';

class DeliveryWindowModal extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            selectedDate: props.sameDaySchedules[0]
        };
    }

    render() {
        const { sameDaySchedules, deliveryWindowPrice, deliveryWindowTitle } = this.props;
        const { selectedDate, selectedDeliveryWindow } = this.state;

        return (
            <div>
                <Modal
                    width={0}
                    isOpen={true}
                    onDismiss={this.onClose}
                    hasBodyScroll={true}
                >
                    <Modal.Header>
                        <Modal.Title>
                            {deliveryWindowTitle} - {deliveryWindowPrice}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.props.schedulingError || (
                            <div>
                                <fieldset>
                                    <Text
                                        is='legend'
                                        lineHeight='tight'
                                        fontWeight='bold'
                                        children='Date'
                                    />
                                    <Grid
                                        gap={2}
                                        columns={2}
                                        marginTop={2}
                                        marginBottom={4}
                                    >
                                        <Chiclet
                                            isLarge={true}
                                            radioProps={{
                                                name: 'date',
                                                onChange: () => {
                                                    this.updateSelectedDay(sameDaySchedules[0]);
                                                },
                                                checked: selectedDate.date === sameDaySchedules[0].date
                                            }}
                                            children={this.getDaySelection(sameDaySchedules[0])}
                                        />
                                        <Chiclet
                                            isLarge={true}
                                            radioProps={{
                                                name: 'date',
                                                onChange: () => {
                                                    this.updateSelectedDay(sameDaySchedules[1]);
                                                },
                                                checked: selectedDate.date === sameDaySchedules[1].date
                                            }}
                                            children={this.getDaySelection(sameDaySchedules[1])}
                                        />
                                    </Grid>
                                </fieldset>
                                <fieldset>
                                    <Text
                                        is='legend'
                                        lineHeight='tight'
                                        fontWeight='bold'
                                        children='Time'
                                    />
                                    {selectedDate.windows.map((window, index) => (
                                        <>
                                            {index > 0 && <Divider />}
                                            <Radio
                                                paddingY={4}
                                                checked={selectedDeliveryWindow === window}
                                                onChange={() => this.updateSelectedDeliveryWindow(window)}
                                            >
                                                {window.displayTime}
                                            </Radio>
                                        </>
                                    ))}
                                </fieldset>
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Grid
                            gap={4}
                            columns={2}
                        >
                            <Button
                                onClick={this.onClose}
                                variant='secondary'
                            >
                                {getText('cancelLinkText')}
                            </Button>
                            <Button
                                disabled={this.props.schedulingError || !selectedDeliveryWindow}
                                onClick={this.setShippingMethod}
                                variant='primary'
                            >
                                {getText('confirm')}
                            </Button>
                        </Grid>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }

    getDaySelection = date => {
        const formattedDate = `${date.date}T00:00:00`;

        return `${date.day}, ${DateUtils.getDateInMMDD(formattedDate)}`;
    };

    updateSelectedDay = day => {
        this.setState({ selectedDate: day });
    };

    updateSelectedDeliveryWindow = window => {
        this.setState({ selectedDeliveryWindow: window });
    };

    onClose = () => {
        this.fireAnalytics(true);
        this.props.onCloseCallback();
    };

    fireAnalytics = isOnClose => {
        const linkData = isOnClose ? anaConsts.LinkData.SAME_DAY_TIME_SELECTOR_CLOSE : anaConsts.LinkData.SAME_DAY_TIME_SELECTION;
        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                actionInfo: linkData,
                linkName: 'D=c55',
                ...anaUtils.getLastAsyncPageLoadData()
            }
        });
    };

    setShippingMethod = () => {
        // TODO: cleanup of this data colleciton once CE data structure changes
        const shipMethodData = this.state.selectedDeliveryWindow;
        shipMethodData.orderId = 'current';
        shipMethodData.shippingGroupId = this.props.sameDayShippingGroupId;
        shipMethodData.shippingMethodId = this.props.scheduledSDDShippingMethodId;
        shipMethodData.smartWindowDate = this.state.selectedDate.date;

        CheckoutUtils.setShippingMethod(shipMethodData, this.fireAnalytics, this.props.successCallback, this.props.onCloseCallback);
    };
}

DeliveryWindowModal.defaultProps = {
    deliveryWindowTitle: '',
    sameDaySchedules: []
};
DeliveryWindowModal.propTypes = {
    deliveryWindowPrice: PropTypes.string
};

export default wrapComponent(DeliveryWindowModal, 'DeliveryWindowModal');
