/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import { Divider } from 'components/ui';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import Storage from 'utils/localStorage/Storage';
import OrderUtils from 'utils/Order';
import store from 'store/Store';

class GuestSavePointsCheckbox extends BaseClass {
    constructor() {
        super();
        this.state = {
            savePoints: null,
            availableBiPoints: 0
        };
    }

    componentDidMount() {
        this.setState({
            savePoints: Storage.local.getItem(LOCAL_STORAGE.SAVE_POINTS_FOR_GUEST),
            availableBiPoints: OrderUtils.getGuestAvailableBiPoints()
        });

        store.setAndWatch('order.orderDetails.items', this, () => {
            this.setState({ availableBiPoints: OrderUtils.getGuestAvailableBiPoints() });
        });
    }

    handleClick = event => {
        Storage.local.setItem(LOCAL_STORAGE.SAVE_POINTS_FOR_GUEST, event.target.checked);
        this.setState({ savePoints: event.target.checked });
    };

    render() {
        const { joinOurFreeProgramText, getText, guestProfile } = this.props;

        return (
            <div>
                <Divider marginY={5} />
                <Checkbox
                    checked={this.state.savePoints}
                    onClick={this.handleClick}
                    children={
                        <div>
                            <b data-at={Sephora.debug.dataAt('save_bi_points')}>{getText('saveMyPointsText', [this.state.availableBiPoints])}</b>
                            <br />
                            <span>
                                {guestProfile.isEmailRegistered ? getText('emailRegisteredText', [guestProfile.email]) : joinOurFreeProgramText}
                            </span>
                        </div>
                    }
                />
            </div>
        );
    }
}

export default wrapComponent(GuestSavePointsCheckbox, 'GuestSavePointsCheckbox', true);
