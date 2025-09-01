import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createSelector } from 'reselect';

import Actions from 'actions/Actions';
import HappeningActions from 'actions/HappeningActions';
import ExperienceDetailsActions from 'actions/ExperienceDetailsActions';

import happeningSelector from 'selectors/page/happening/happeningSelector';
import { happeningUserDataSelector } from 'selectors/page/happening/happeningUserDataSelector';

import framework from 'utils/framework';
import withLocationInfo from 'utils/HappeningLocation';
import JavascriptUtils from 'utils/javascript';
import locationUtils from 'utils/Location';

import Loader from 'components/Loader/Loader';
import Reservations from 'components/HappeningNonContent/Reservations';
import ServiceBooking from 'components/HappeningNonContent/ServiceBooking';
import WaitlistBooking from 'components/HappeningNonContent/WaitlistBooking';

const { wrapHOC, wrapHOCComponent } = framework;
const { isObjectEmpty } = JavascriptUtils;
const { isMyReservationsPage, isServiceBookingPage, isWaitlistBookingPage } = locationUtils;

const fields = createSelector(happeningSelector, happeningUserDataSelector, (happeningContent, user) => ({
    ...happeningContent,
    user
}));

const functions = {
    getMyReservationsCSC: HappeningActions.getMyReservationsCSC,
    getServiceBookingCSC: HappeningActions.getServiceBookingCSC,
    getWaitlistBookingCSC: HappeningActions.getWaitlistBookingCSC,
    setCompactHeaderAndFooter: HappeningActions.setCompactHeaderAndFooter,
    openInfoWindow: ExperienceDetailsActions.openInfoWindow,
    showInfoModal: Actions.showInfoModal,
    showInterstice: Actions.showInterstice
};

const getComponentToRender = ({
    content,
    user,
    openInfoWindow,
    showInfoModal,
    setCompactHeaderAndFooter,
    showInterstice,
    getMyReservationsCSC,
    getWaitlistBookingCSC
}) => {
    const componentToRender = [];

    if (isMyReservationsPage()) {
        const props = {
            content,
            user,
            getMyReservationsCSC
        };

        componentToRender.push(
            <Reservations
                key={'Reservations'}
                {...props}
            />
        );
    }

    if (isServiceBookingPage()) {
        const props = {
            content,
            openInfoWindow,
            user,
            showInfoModal,
            setCompactHeaderAndFooter,
            showInterstice
        };

        componentToRender.push(
            <ServiceBooking
                key={'ServiceBooking'}
                {...props}
            />
        );
    }

    if (isWaitlistBookingPage()) {
        const props = {
            content,
            user,
            showInfoModal,
            getWaitlistBookingCSC
        };

        componentToRender.push(
            <WaitlistBooking
                key={'WaitlistBooking'}
                {...props}
            />
        );
    }

    return componentToRender.length ? componentToRender : null;
};

const withHappeningNonContentProps = compose(
    wrapHOC(connect(fields, functions)),
    wrapHOC(WrappedComponent => {
        class ReservationsProps extends Component {
            getServiceBookingCSC = () =>
                withLocationInfo((storeId, storeZipCode) => {
                    this.props.getServiceBookingCSC(storeId, storeZipCode);
                });

            componentDidMount() {
                const { isInitialized, getMyReservationsCSC } = this.props;

                if (!isInitialized && isMyReservationsPage()) {
                    getMyReservationsCSC();
                }

                if (!isInitialized && isServiceBookingPage()) {
                    this.getServiceBookingCSC();
                }

                if (!isInitialized && isWaitlistBookingPage()) {
                    this.props.getWaitlistBookingCSC();
                }
            }

            // Please make any future updates at the component level
            // componentDidUpdate(prevProps) {}

            render() {
                const { content, user, ...props } = this.props;
                const contentNotReady = isObjectEmpty(content);

                if (contentNotReady) {
                    return (
                        <Loader
                            isShown={true}
                            isInline={true}
                        />
                    );
                }

                return (
                    <WrappedComponent
                        {...props}
                        component={getComponentToRender({
                            ...this.props,
                            ...this.state
                        })}
                    />
                );
            }
        }

        return wrapHOCComponent(ReservationsProps, 'ReservationsProps', [WrappedComponent]);
    })
);

export { withHappeningNonContentProps };
