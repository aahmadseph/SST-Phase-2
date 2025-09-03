const React = require('react');
const { any } = jasmine;
const { shallow } = require('enzyme');
const AddressForm = require('components/Addresses/AddressForm/AddressForm').default;
const TextInput = require('components/Inputs/TextInput/TextInput').default;
const { FIELD_LENGTHS } = require('utils/FormValidator').default;

/**
 * ----------------------
 * Form Elements Location
 * ----------------------
 * ErrorList
 * FirstName | LastName
 * Country   | Phone
 * Address1
 * (AVS component)
 * Address2 Link
 * (Address2 --hidden--)
 * PostalCode | City | State/Province
 * Email --guestCheckout only--
 */

describe('AddressForm component', () => {
    let wrapper;
    let isDesktopStub;
    let setStateStub;
    let currentFieldName;
    let stateAVS;
    let propsAVS;
    const eventStub = {
        target: {
            name: 'name',
            value: 'value'
        }
    };

    const getField = (shallowComponent, fieldName) => shallowComponent.findWhere(n => n.prop('name') === fieldName);

    const evaluateExistence = exist => {
        it(`should ${exist === 0 ? 'not ' : ''}exist`, () => {
            const field = getField(wrapper, currentFieldName);
            expect(field.length).toEqual(exist);
        });
    };

    const itShouldExist = () => evaluateExistence(1);
    const itShouldNotExist = () => evaluateExistence(0);

    const itShouldHaveCorrectProp = (prop, value) => {
        it(`should ${prop === 'required' ? 'be' : 'have correct'} ${prop}`, () => {
            const field = getField(wrapper, currentFieldName);
            expect(field.prop(prop)).toEqual(value);
        });
    };

    const itShoudlNotBeRequired = () => {
        it('it should not be required', () => {
            const field = getField(wrapper, currentFieldName);
            expect(field.prop('required')).toBeFalsy();
        });
    };

    const itShouldBeRequired = () => itShouldHaveCorrectProp('required', true);
    const itShouldHaveCorrectLabel = label => itShouldHaveCorrectProp('label', label);
    const itShouldHaveCorrectMaxLength = maxLength => itShouldHaveCorrectProp('maxLength', maxLength);
    const itShouldHaveCorrectValue = (stateProp, value, context) => {
        describe(`when state address.${stateProp} changes`, () => {
            beforeEach(() => {
                wrapper.setState({ address: { [stateProp]: value } });
            });
            itShouldHaveCorrectProp('value', value, context);
        });
    };

    const itShouldCallUpdateEditStoreOnChange = () => {
        it('should call updateEditStore onChange', () => {
            const updateEditStoreStub = spyOn(wrapper.instance(), 'updateEditStore');
            wrapper.update();
            const field = getField(wrapper, currentFieldName);
            field.simulate('change', eventStub);
            expect(updateEditStoreStub).toHaveBeenCalledWith(eventStub.target.name, eventStub.target.value);
        });
    };

    const itShouldHaveCorrectWidth = (width, mobileWidth = null) => {
        let fieldWrapper;
        let field;

        it('should have correct size when it has a grid and is desktop', () => {
            isDesktopStub.and.returnValue(true);
            wrapper.setProps({ hasGridLayout: true });
            field = getField(wrapper, currentFieldName);
            fieldWrapper = wrapper.findWhere(n => n.name() === 'LegacyGridCell' && n.contains(field.get(0)));
            expect(fieldWrapper.props().width).toEqual(width);
        });

        it('should have a correct width for Mobile or if it does not have a LegacyGrid Layout', () => {
            field = getField(wrapper, currentFieldName);
            fieldWrapper = wrapper.findWhere(n => n.name() === 'LegacyGridCell' && n.contains(field.get(0)));
            expect(fieldWrapper.props().width).toEqual(mobileWidth);
        });
    };

    beforeEach(() => {
        stateAVS = {
            loqateAddresses: [
                {
                    Id: 'id',
                    Type: 'Address',
                    Description: 'description',
                    Highlight: '0-1',
                    Text: 'text'
                }
            ],
            hasAddress1Focus: true
        };
        propsAVS = {
            isBillingAddress: false,
            isCheckout: true
        };
        isDesktopStub = spyOn(Sephora, 'isDesktop');
        wrapper = shallow(<AddressForm country='US' />);
    });

    // First Name and Last Name
    ['firstName', 'lastName'].forEach((fieldName, i, arr) => {
        describe(`${fieldName} field`, () => {
            const labels = {
                firstName: 'First Name',
                lastName: 'Last Name'
            };

            beforeEach(() => {
                currentFieldName = fieldName;
            });

            itShouldExist();
            itShouldHaveCorrectValue(fieldName, `${fieldName} value`);
            itShouldBeRequired();
            itShouldHaveCorrectLabel(labels[fieldName]);
            itShouldHaveCorrectMaxLength(FIELD_LENGTHS.name);
            itShouldCallUpdateEditStoreOnChange();
            itShouldHaveCorrectWidth('50%');

            it(`should be next to ${arr[(i + 1) % 2]} when it has a LegacyGrid Layout and is Desktop`, () => {
                const currentField = getField(wrapper, currentFieldName);
                //siblingField = lastName when evaluating firstName and viceversa
                const siblingField = getField(wrapper, arr[(i + 1) % 2]);
                //shared parent should be a LegacyGrid and contain both fields
                const sharedParent = wrapper.findWhere(
                    n => n.name() === 'LegacyGrid' && n.contains(currentField.get(0)) && n.contains(siblingField.get(0))
                );

                expect(sharedParent.length).toEqual(1);
            });

            //for firstName only
            if (fieldName === 'firstName') {
                it('should show as the first one on the form', () => {
                    const textInputs = wrapper.find(TextInput);
                    expect(textInputs.get(0).props.name).toEqual(fieldName);
                });
            }

            describe('for Billing Address on Checkout', () => {
                beforeEach(() => {
                    wrapper.setProps({
                        isCheckout: true,
                        isBillingAddress: true
                    });
                });
                itShouldNotExist();
            });
        });
    });

    describe('Country field', () => {
        beforeEach(() => {
            currentFieldName = 'country';
        });
        itShouldExist();
        itShouldHaveCorrectLabel('Country');
        itShouldHaveCorrectValue('country', 'country value');
        itShouldHaveCorrectWidth('50%');

        it('should not exist if isCountryFieldHidden is true', () => {
            wrapper.setProps({ isCountryFieldHidden: true });
            const country = getField(wrapper, currentFieldName);
            expect(country.length).toEqual(0);
        });
    });

    describe('Address1 field', () => {
        beforeEach(() => {
            currentFieldName = 'address1';
        });
        itShouldExist();
        itShouldHaveCorrectLabel('Street Address');
        itShouldHaveCorrectValue('address1', 'address1 value');
        itShouldBeRequired();
        itShouldHaveCorrectMaxLength(FIELD_LENGTHS.addressAdsRestricted);

        itShouldHaveCorrectProp('autoComplete', 'address-line1');

        describe('Address1 field without a restricted address', () => {
            beforeEach(() => {
                wrapper.setState({ isAddressVerified: true });
            });
            itShouldHaveCorrectMaxLength(FIELD_LENGTHS.address);
        });

        describe('when AVS is enabled and address1 is focused', () => {
            beforeEach(() => {
                Sephora.configurationSettings.enableAddressValidation = true;
                stateAVS.hasAddress1Focus = true;
                wrapper.setState(stateAVS);
                wrapper.setProps(propsAVS);
            });

            it('should not allow autocomplete', () => {
                const field = getField(wrapper, 'address1');
                expect(field.prop('autoComplete')).not.toEqual('address-line1');
            });
        });
    });

    describe('Link that controls Address2 section', () => {
        let link;
        beforeEach(() => {
            link = wrapper.findWhere(n => n.name() === 'Link' && n.prop('aria-controls') === 'address2_section');
        });

        it('should exist', () => {
            expect(link.length).toEqual(1);
        });

        it('should not be hidden when showAddress2Input is false', () => {
            const linkWrapper = link.parent();
            expect(linkWrapper.props().style).toEqual(null);
        });

        it('should be hidden when showAddress2Input is true', () => {
            wrapper.setState({ showAddress2Input: true });
            const linkWrapper = wrapper.findWhere(n => n.name() === 'Link' && n.prop('aria-controls') === 'address2_section').parent();
            expect(linkWrapper.props().style.display).toEqual('none');
        });

        it('should call setState on click with correct args', () => {
            setStateStub = spyOn(wrapper.instance(), 'setState');
            wrapper.update();
            link.simulate('click');
            expect(setStateStub).toHaveBeenCalledWith({ showAddress2Input: true }, any(Function));
        });
    });

    describe('Address2 section', () => {
        let address2Section;
        beforeEach(() => {
            address2Section = wrapper.findWhere(n => n.name() === 'LegacyGrid' && n.prop('id') === 'address2_section');
        });

        it('should exist', () => {
            expect(address2Section.length).toEqual(1);
        });

        it('should be hidden when showAddress2Input is false', () => {
            expect(address2Section.props().style.display).toEqual('none');
        });

        it('should not be hidden when showAddress2Input is true', () => {
            wrapper.setState({ showAddress2Input: true });
            address2Section = wrapper.findWhere(n => n.name() === 'LegacyGrid' && n.prop('id') === 'address2_section');
            expect(address2Section.props().style).toEqual(null);
        });

        describe('Address2 field', () => {
            beforeEach(() => {
                currentFieldName = 'address2';
            });

            itShouldExist();
            itShouldHaveCorrectLabel('Door buzzer, building code, Apt#...etc');
            itShouldHaveCorrectValue('address2', 'address2 value');
            itShouldCallUpdateEditStoreOnChange();
            itShouldHaveCorrectMaxLength(FIELD_LENGTHS.addressAdsRestricted);
            itShouldHaveCorrectWidth('50%');
        });
    });

    describe('PostalCode field', () => {
        beforeEach(() => {
            currentFieldName = 'postalCode';
        });

        itShouldExist();
        itShouldHaveCorrectLabel('ZIP/Postal Code');
        itShouldHaveCorrectValue('postalCode', 'address2 value');
        itShouldHaveCorrectMaxLength(FIELD_LENGTHS.zipCode);
        itShouldHaveCorrectWidth('25%', '11em');
        itShouldBeRequired();

        describe('for International', () => {
            beforeEach(() => {
                wrapper.setState({ isInternational: true });
            });

            itShouldHaveCorrectLabel('Postal Code');
            itShouldHaveCorrectMaxLength(null);
        });

        describe('for Canada', () => {
            beforeEach(() => {
                wrapper.setState({ address: { country: 'CA' } });
            });

            itShouldHaveCorrectLabel('Postal Code');
            itShouldHaveCorrectMaxLength(FIELD_LENGTHS.postalCode);
        });

        describe('when zipCodeInvalid exists', () => {
            const zipCodeValue = 'Invalid zip code';
            beforeEach(() => {
                wrapper.setState({ zipCodeInvalid: zipCodeValue });
            });

            itShouldHaveCorrectProp('invalid', zipCodeValue);
            itShouldHaveCorrectProp('message', zipCodeValue);
        });

        describe('when cityStateZipInvalid exists', () => {
            const cityStateZipValue = 'Invalid city state zip';
            beforeEach(() => {
                wrapper.setState({ cityStateZipInvalid: cityStateZipValue });
            });

            itShouldHaveCorrectProp('invalid', cityStateZipValue);
            itShouldHaveCorrectProp('message', cityStateZipValue);
        });
    });

    describe('City field', () => {
        beforeEach(() => {
            wrapper.setState({ displayCityStateInputs: true });
            currentFieldName = 'city';
        });

        itShouldExist();
        itShouldHaveCorrectLabel('City');
        itShouldBeRequired();
        itShouldHaveCorrectValue('city', 'city value');
        itShouldHaveCorrectMaxLength(FIELD_LENGTHS.city);
        itShouldHaveCorrectWidth('37.5%');

        it('should be next to city and state/province when it has a LegacyGrid Layout and is Desktop', () => {
            const city = getField(wrapper, currentFieldName);
            const postalCode = getField(wrapper, 'postalCode');
            const stateProvince = wrapper.findWhere(n => n.prop('name') === 'state');

            //shared parent should be a LegacyGrid and contain all the fields
            const sharedParent = wrapper.findWhere(
                n => n.name() === 'LegacyGrid' && n.contains(postalCode.get(0)) && n.contains(stateProvince.get(0)) && n.contains(city.get(0))
            );

            expect(sharedParent.length).toEqual(1);
        });

        describe('for International', () => {
            beforeEach(() => {
                wrapper.setState({ isInternational: true });
            });
            itShouldExist();
        });

        describe('when "isInternational" and "displayCityStateInputs" are false', () => {
            beforeEach(() => {
                wrapper.setState({
                    displayCityStateInputs: false,
                    isInternational: false
                });
            });
            itShouldNotExist();
        });
    });

    describe('State/Province field', () => {
        beforeEach(() => {
            currentFieldName = 'state';
        });

        it('should be hidden if isInternational and displayCityStateInputs are false', () => {
            const field = getField(wrapper, 'state');
            expect(field.props().customStyle.root.display).toEqual('none');
        });

        describe('for International', () => {
            beforeEach(() => {
                wrapper.setState({ isInternational: true });
            });

            itShouldExist();
            itShouldHaveCorrectLabel('Region');
            itShoudlNotBeRequired();
            itShouldHaveCorrectMaxLength(FIELD_LENGTHS.stateRegion);
            itShouldHaveCorrectValue('state', 'international state value');
            itShouldCallUpdateEditStoreOnChange();
        });

        describe('when displayCityStateInputs is true', () => {
            beforeEach(() => {
                wrapper.setState({ displayCityStateInputs: true });
            });

            itShouldExist();
            itShouldHaveCorrectLabel('State/Region');
            itShouldBeRequired();
            itShouldHaveCorrectValue('state', 'state/region value');
            itShouldHaveCorrectWidth('37.5%');

            it('should be a Select type', () => {
                const field = getField(wrapper, 'state');
                expect(field.name()).toEqual('Select');
            });

            describe('for Canada', () => {
                beforeEach(() => {
                    wrapper.setState({ address: { country: 'CA' } });
                });
                itShouldHaveCorrectLabel('Province');
            });
        });
    });

    describe('Phone field', () => {
        beforeEach(() => {
            currentFieldName = 'phone';
        });

        itShouldExist();
        itShouldHaveCorrectLabel('Phone');
        itShouldBeRequired();
        itShouldHaveCorrectMaxLength(FIELD_LENGTHS.formattedPhone);
        itShouldHaveCorrectValue('formattedPhone', 'formatted phone value', 'for formatted phone');
        itShouldHaveCorrectValue('phone', 'phone value');
        itShouldHaveCorrectWidth('50%');

        it('should be next to country when it has a LegacyGrid Layout and is Desktop', () => {
            const phone = getField(wrapper, currentFieldName);
            const country = getField(wrapper, 'country');

            //shared parent should be a LegacyGrid and contain all the fields
            const sharedParent = wrapper.findWhere(n => n.name() === 'LegacyGrid' && n.contains(phone.get(0)) && n.contains(country.get(0)));

            expect(sharedParent.length).toEqual(1);
        });

        it('text input should have element ref defined because phone number formatter depends on it', () => {
            const textInput = shallow(<TextInput />).instance();

            expect(Object.prototype.hasOwnProperty.call(textInput, 'inputElementRef')).toBeTrue();
        });

        describe('when isPhoneFieldHidden is true', () => {
            beforeEach(() => {
                wrapper.setProps({ isPhoneFieldHidden: true });
            });
            itShouldNotExist();
        });

        describe('for International', () => {
            beforeEach(() => {
                wrapper.setState({ isInternational: true });
            });
            itShouldHaveCorrectMaxLength(FIELD_LENGTHS.internationalPhone);
        });
    });

    describe('Email field', () => {
        beforeEach(() => {
            currentFieldName = 'email';
        });

        itShouldNotExist();

        describe('for guest Checkout', () => {
            beforeEach(() => {
                wrapper.setProps({ isGuestCheckout: true });
            });

            itShouldExist();
            itShouldBeRequired();
            itShouldHaveCorrectValue('email', 'email value');
            itShouldHaveCorrectMaxLength(FIELD_LENGTHS.email);
            itShouldCallUpdateEditStoreOnChange();
            itShouldHaveCorrectWidth('50%');

            describe('when order has a physical giftcard', () => {
                beforeEach(() => {
                    wrapper.setProps({ orderHasPhysicalGiftCard: true });
                });
                itShouldNotExist();
            });
        });
    });

    describe('AVS component', () => {
        it(
            'should exist when AVS is enabled, it is not international, it is not billingAddress' +
                'has Loqate address results and is address1 in focus',
            () => {
                Sephora.configurationSettings.enableAddressValidation = true;
                wrapper.setState(stateAVS);
                wrapper.setProps(propsAVS);
                expect(wrapper.find('Box[is="ul"]').length).toEqual(1);
            }
        );

        it('should not exist when AVS is disabled', () => {
            Sephora.configurationSettings.enableAddressValidation = false;
            wrapper.setState(stateAVS);
            wrapper.setProps(propsAVS);
            expect(wrapper.find('Box[is="ul"]').length).toEqual(0);
        });

        it('should not exist for billingAddress', () => {
            Sephora.configurationSettings.enableAddressValidation = true;
            propsAVS.isBillingAddress = true;
            wrapper.setState(stateAVS);
            wrapper.setProps(propsAVS);
            expect(wrapper.find('Box[is="ul"]').length).toEqual(0);
        });

        it('should not exist for international', () => {
            Sephora.configurationSettings.enableAddressValidation = true;
            stateAVS.isInternational = true;
            wrapper.setState(stateAVS);
            wrapper.setProps(propsAVS);
            expect(wrapper.find('Box[is="ul"]').length).toEqual(0);
        });

        it('should not be visible when Loqate results are empty', () => {
            Sephora.configurationSettings.enableAddressValidation = true;
            stateAVS.loqateAddresses = [];
            wrapper.setState(stateAVS);
            wrapper.setProps(propsAVS);
            expect(wrapper.find('Box[is="ul"]').props('style').style.display).toEqual('none');
        });

        describe('Address Item', () => {
            it('should not have an arrow', () => {
                Sephora.configurationSettings.enableAddressValidation = true;
                wrapper.setState(stateAVS);
                wrapper.setProps(propsAVS);
                expect(wrapper.find('Box[is="ul"]').find('Chevron').length).toEqual(0);
            });

            it('should have an arrow when it has multiple units', () => {
                Sephora.configurationSettings.enableAddressValidation = true;
                stateAVS.loqateAddresses[0].Type = 'Building';
                wrapper.setState(stateAVS);
                wrapper.setProps(propsAVS);
                expect(wrapper.find('Box[is="ul"]').find('Chevron').length).toEqual(1);
            });
        });
    });

    describe('ErrorList', () => {
        it('should exist', () => {
            expect(wrapper.find('ErrorList').length).toEqual(1);
        });
    });

    describe('should render data-at attribute for', () => {
        it('first name input element', () => {
            // Arrange/Act
            const inputElement = wrapper.find('TextInput[data-at="first_name_input"]');

            // Assert
            expect(inputElement.exists()).toBe(true);
        });

        it('last name input element', () => {
            // Arrange/Act
            const inputElement = wrapper.find('TextInput[data-at="last_name_input"]');

            // Assert
            expect(inputElement.exists()).toBe(true);
        });

        it('phone input element', () => {
            // Arrange/Act
            const inputElement = wrapper.find('TextInput[data-at="phone_number_input"]');

            // Assert
            expect(inputElement.exists()).toBe(true);
        });

        it('e-mail input element', () => {
            // Arrange
            const props = {
                country: 'US',
                isGuestCheckout: true
            };

            // Act
            wrapper = shallow(<AddressForm {...props} />);
            const inputElement = wrapper.find('TextInput[data-at="email_input"]');

            // Assert
            expect(inputElement.exists()).toBe(true);
        });

        it('address input element', () => {
            // Arrange/Act
            const inputElement = wrapper.find('TextInput[data-at="street_address_input"]');

            // Assert
            expect(inputElement.exists()).toBe(true);
        });

        it('zip code input element', () => {
            // Arrange/Act
            const inputElement = wrapper.find('TextInput[data-at="zip_postal_code_input"]');

            // Assert
            expect(inputElement.exists()).toBe(true);
        });
    });
});
