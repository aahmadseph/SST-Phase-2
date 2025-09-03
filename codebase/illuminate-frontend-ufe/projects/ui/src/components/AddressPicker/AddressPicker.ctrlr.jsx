import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Grid, Link } from 'components/ui';
import Radio from 'components/Inputs/Radio/Radio';
import AddressActions from 'actions/AddressActions';
import Address from 'components/AddressPicker/Address';
import userUtils from 'utils/User';
import localeUtils from 'utils/LanguageLocale';

const getText = localeUtils.getLocaleResourceFile('components/AddressPicker/locales', 'AddressPicker');

class AddressPicker extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            addresses: [],
            displayedAddresses: [],
            viewMore: false,
            selectedAddressId: {}
        };
    }

    componentDidMount() {
        const profileId = userUtils.getProfileId();
        this.getAddresses(profileId);

        if (this.props.selectedAddressId) {
            this.setState({ selectedAddressId: this.props.selectedAddressId });
        }
    }

    getAddresses = profileId => {
        AddressActions.getSavedAddresses(profileId, this.setAddresses);
    };

    setAddresses = addresses => {
        this.setState({ addresses });

        if (this.state.viewMore) {
            this.setState({ displayedAddresses: addresses });
        } else {
            this.setState({ displayedAddresses: addresses.slice(0, 3) });
        }
    };

    toggleViewMore = () => {
        this.setState({ viewMore: !this.state.viewMore }, () => this.setAddresses(this.state.addresses));
    };

    handleRadioChange = selectedAddressId => () => {
        this.setState({ selectedAddressId });
        this.props.onRadioChange(selectedAddressId);
    };

    render() {
        return (
            <Grid gap={3}>
                {this.state.displayedAddresses && this.state.displayedAddresses.length
                    ? this.state.displayedAddresses.map(
                        address =>
                            address.addressId.indexOf('sg') === 0 || (
                                <Grid
                                    gutter={3}
                                    key={address.addressId}
                                    width='fill'
                                >
                                    <Radio
                                        alignItems='flex-start'
                                        name='selectedAddress'
                                        value={address.addressId}
                                        checked={address.addressId === this.state.selectedAddressId}
                                        onChange={this.handleRadioChange(address.addressId)}
                                        hasFocusStyles={false}
                                    >
                                        <Address
                                            address={address}
                                            showDefault={this.props.showDefault}
                                        />
                                    </Radio>
                                </Grid>
                            )
                    )
                    : null}

                <Link
                    color='blue'
                    paddingY={2}
                    marginY={-2}
                    onClick={this.toggleViewMore}
                >
                    {this.state.viewMore ? getText('viewLess') : getText('viewMore')}
                </Link>
            </Grid>
        );
    }
}

export default wrapComponent(AddressPicker, 'AddressPicker', true);
