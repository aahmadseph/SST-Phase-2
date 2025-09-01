/* eslint-disable class-methods-use-this */

import React from 'react';
import { Text, Grid } from 'components/ui';
import BaseClass from 'components/BaseClass';
import Checkout from 'services/api/checkout';
import FrameworkUtils from 'utils/framework';
import localeUtils from 'utils/LanguageLocale';
import { getLocationHoursText, computeOperatingHours } from 'utils/AccessPoints';
import Empty from 'constants/empty';

const { getAccessPointHours, getAccessPoints } = Checkout;
const { wrapComponent } = FrameworkUtils;
const getText = localeUtils.getLocaleResourceFile('components/SharedComponents/AccessPoint/FetchLocationHours/locales', 'FetchLocationHours');

class FetchLocationHours extends BaseClass {
    state = {
        isLoading: true,
        locationHoursText: getText('loadingLocationHours'),
        operatingHoursRows: []
    };

    fetchLocation = () => {
        const { postalCode: zipCode, altPickLocationID, country } = this.props.halAddress;
        const isCanada = country === 'CA';

        if (!isCanada && zipCode && altPickLocationID) {
            getAccessPointHours({
                zipCode,
                altPickLocationID
            })
                .then(location => {
                    const { operatingHours } = location;

                    this.setState({
                        locationHoursText: getLocationHoursText(operatingHours)
                    });
                })
                .catch(() => {
                    this.setState({
                        locationHoursText: ''
                    });
                });
        } else if (isCanada && zipCode) {
            getAccessPoints({
                zipCode,
                country
            }).then(response => {
                const locations = response.data;
                const location = locations.find(loc => loc.locationId === altPickLocationID) || Empty.Object;
                const operatingHours = location.operatingHours || Empty.Array;

                this.setState({
                    operatingHoursRows: computeOperatingHours(operatingHours)
                });
            });
        }
    };

    componentDidMount() {
        this.fetchLocation();
    }

    render() {
        const { operatingHoursRows } = this.state;
        const { isOrderConfirmation } = this.props;

        if (operatingHoursRows.length) {
            return (
                <Grid
                    marginTop={4}
                    columns='1fr auto'
                    gap={1}
                    css={{
                        width: isOrderConfirmation ? '80%' : '70%'
                    }}
                >
                    {operatingHoursRows.map(row => {
                        return (
                            <React.Fragment key={row.label}>
                                <span>{row.label}</span>
                                <span>{row.value}</span>
                            </React.Fragment>
                        );
                    })}
                </Grid>
            );
        }

        return <Text css={{ textTransform: 'none' }}>{this.state.locationHoursText}</Text>;
    }
}

FetchLocationHours.defaultProps = {
    halAddress: {},
    isOrderConfirmation: false
};

export default wrapComponent(FetchLocationHours, 'FetchLocationHours', true);
