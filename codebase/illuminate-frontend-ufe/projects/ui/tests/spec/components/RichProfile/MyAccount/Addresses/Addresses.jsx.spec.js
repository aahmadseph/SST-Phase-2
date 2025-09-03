import React from 'react';
import { shallow } from 'enzyme';
import { AddressesComponent as Addresses } from 'components/RichProfile/MyAccount/Addresses/Addresses';

describe('Addresses component', () => {
    it('should render the correct amount of saved addresses', () => {
        // Arrange
        const wrapper = shallow(<Addresses />);
        // Act
        wrapper.setState({
            addresses: [
                {
                    address1: '396 Reservation Rd',
                    address2: 'Apt 1',
                    addressId: '90092160426'
                },
                {
                    address1: '616 Mier Dr',
                    address2: '',
                    addressId: '90095120104'
                },
                {
                    address1: 'THREE Centerpointe Dr',
                    address2: '',
                    addressId: '90094900452'
                },
                {
                    address1: '36803 Shitann Rd',
                    address2: '',
                    addressId: '90095120172'
                }
            ],
            isAddAddress: false,
            isEditMode: false,
            isUserReady: true,
            user: {
                login: 'testuser'
            }
        });

        // Assert
        expect(wrapper.find('Address').length).toBe(4);
    });

    it('should render "edit" Link component with data-at attribute', () => {
        // Arrange
        const wrapper = shallow(<Addresses />);

        // Act
        wrapper.setState({
            addresses: [
                {
                    address1: '396 Reservation Rd',
                    address2: 'Apt 1',
                    addressId: '90092160426'
                }
            ],
            isUserReady: true,
            user: {
                login: 'testuser'
            }
        });

        // Assert
        expect(wrapper.find('[data-at="saved_addresses_edit_button"]').exists()).toBe(true);
    });

    it('should render "Add shipping address" Link component with data-at attribute', () => {
        // Arrange
        const wrapper = shallow(<Addresses />);

        // Act
        wrapper.setState({
            addresses: [
                {
                    address1: '396 Reservation Rd',
                    address2: 'Apt 1',
                    addressId: '90092160426'
                }
            ],
            isUserReady: true,
            user: {
                login: 'testuser'
            }
        });

        // Assert
        expect(wrapper.find('[data-at="saved_addresses_add_shipping_address_button"]').exists()).toBe(true);
    });
});
