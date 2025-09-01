/* eslint-disable class-methods-use-this */
import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import AccountLayout from 'components/RichProfile/MyAccount/AccountLayout/AccountLayout';
import AutoReplenishmentPageContent from 'components/RichProfile/MyAccount/AutoReplenishment/AutoReplenishmentPageContent';

class AutoReplenishmentMain extends BaseClass {
    componentDidMount() {
        if (Sephora.configurationSettings.isAutoReplenishEmptyHubEnabled) {
            this.props.loadContentfulContent();
        }
    }

    render() {
        const { localization } = this.props;

        return (
            <AccountLayout
                section='account'
                page='autoReplenishment'
                title={localization.autoReplenish}
            >
                <AutoReplenishmentPageContent />
            </AccountLayout>
        );
    }
}

AutoReplenishmentMain.propTypes = {
    loadContentfulContent: PropTypes.func,
    localization: PropTypes.object
};

AutoReplenishmentMain.defaultProps = {
    loadContentfulContent: () => {},
    localization: {}
};

export default wrapComponent(AutoReplenishmentMain, 'AutoReplenishmentMain', true);
