import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import {
    Grid, Button, Box, Text
} from 'components/ui';
import TextInput from 'components/Inputs/TextInput/TextInput';
import { CategoryType, CategoryTypeCA } from 'components/RichProfile/MyAccount/TaxClaim/constants';
import { space } from 'style/config';
import DisabledVetsOfOklahomaInputs from 'components/RichProfile/MyAccount/TaxClaim/Steps/TaxExemptionInfoStep/DisabledVetsOfOklahomaInputs';
import OklahomaViewInfo from 'components/RichProfile/MyAccount/TaxClaim/Steps/TaxExemptionInfoStep/OklahomaViewInfo';
import FirstNationMemberInput from 'components/RichProfile/MyAccount/TaxClaim/Steps/TaxExemptionInfoStep/FirstNationMemberInput';
import IssueExpirationDateComponent from 'components/RichProfile/MyAccount/TaxClaim/Steps/TaxExemptionInfoStep/IssueExpirationDateComponent';
import NonProfitReligiousCharitableOrgsInputs from 'components/RichProfile/MyAccount/TaxClaim/Steps/TaxExemptionInfoStep/NonProfitReligiousCharitableOrgsInputs';
import ResellerInputs from 'components/RichProfile/MyAccount/TaxClaim/Steps/TaxExemptionInfoStep/ResellerInputs';
import StateLocalEducationalInputs from 'components/RichProfile/MyAccount/TaxClaim/Steps/TaxExemptionInfoStep/StateLocalEducationalInputs';
import NPRCOViewInfo from 'components/RichProfile/MyAccount/TaxClaim/Steps/TaxExemptionInfoStep/NPRCOViewInfo';
import ResellerViewInfo from 'components/RichProfile/MyAccount/TaxClaim/Steps/TaxExemptionInfoStep/ResellerViewInfo';
import SLGEIViewInfo from 'components/RichProfile/MyAccount/TaxClaim/Steps/TaxExemptionInfoStep/SLGEIViewInfo';
import IndigenousAmericanInputs from './TaxExemptionInfoStep/IndigenousAmericanInputs';
import FreightForwarder from 'components/RichProfile/MyAccount/TaxClaim/Steps/TaxExemptionInfoStep/FreightForwarder';
import IAViewInfo from 'components/RichProfile/MyAccount/TaxClaim/Steps/TaxExemptionInfoStep/IAViewInfo';
import FirstNationMemberView from 'components/RichProfile/MyAccount/TaxClaim/Steps/TaxExemptionInfoStep/FirstNationMemberView';
import { fontSizes, colors } from 'style/config';

import TaxAddress from 'components/RichProfile/MyAccount/TaxClaim/TaxAddress';
import TaxClaimUtils from 'utils/TaxClaim';
import Empty from 'constants/empty';

class TaxExemptionInfoStepEdit extends BaseClass {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { userGeneralData, handleFirstNameChange, handleLastNameChange, handleEmailChange } = this.props;

        if (userGeneralData) {
            handleFirstNameChange(userGeneralData.firstName);
            handleLastNameChange(userGeneralData.lastName);
            handleEmailChange(userGeneralData.email);
        }

        this.props.handleSetDefaultAddressChange(false);
    }

    getIssueExpirationDateProps = props => ({
        issueDate: props.wizardFormData.issueDate,
        expirationDate: props.wizardFormData.expirationDate,
        wizardFormErrors: props.wizardFormErrors,
        handleInitialDateChange: props.handleInitialDateChange,
        handleEndDateChange: props.handleEndDateChange,
        updateStep4Data: props.updateStep4Data,
        formErrors: props.formErrors,
        clearErrors: props.clearErrors,
        selectedCategory: props.selectedCategory
    });

    renderInputsByCategory = (selectedCategory, props) => {
        const commonProps = this.getIssueExpirationDateProps(props);

        switch (selectedCategory) {
            case CategoryType.INDIGENOUS_AMERICAN:
                return (
                    <>
                        <IndigenousAmericanInputs
                            updateStep4Data={props.updateStep4Data}
                            tribeName={props.tribeName}
                            tribeIdNumber={props.tribeIdNumber}
                            reserveName={props.reserveName}
                            issueDate={props.issueDate}
                            expirationDate={props.expirationDate}
                            wizardFormErrors={props.wizardFormErrors}
                            handleTribeNameChange={props.handleTribeNameChange}
                            handleTribeIdNumberChange={props.handleTribeIdNumberChange}
                            handleTribeReserveNameChange={props.handleTribeReserveNameChange}
                            handleIssueDateChange={props.handleIssueDateChange}
                            handleExpirationDateChange={props.handleExpirationDateChange}
                            clearErrors={props.clearErrors}
                            formErrors={props.formErrors}
                            taxClaimGetText={props.taxClaimGetText}
                            wizardFormData={props.wizardFormData}
                        />
                        <IssueExpirationDateComponent
                            {...commonProps}
                            title={props.taxClaimGetText('datesLabel')}
                        />

                        {TaxClaimUtils.isTaxExemptionEnabled() ? (
                            <TaxAddress
                                setDefaultAddress={props.setDefaultAddress}
                                updateStep4Data={props.updateStep4Data}
                                onSelection={props.handleTaxExemptionSelection}
                                taxAddressFormErrors={props.taxAddressFormErrors}
                                taxExemptionSelection={props.taxExemptionSelection}
                                handleStreetAddressChange={value => this.props.handleTaxAddressChange('address1', value)}
                                handleAddress2Change={value => this.props.handleTaxAddressChange('address2', value)}
                                handleCityChange={value => this.props.handleTaxAddressChange('city', value)}
                                handleStateChange={value => this.props.handleTaxAddressChange('state', value)}
                                handlePostalCodeChange={value => this.props.handleTaxAddressChange('postalCode', value)}
                                handleSetDefaultAddressChange={value => this.props.handleSetDefaultAddressChange(value)}
                                addAddressErrors={props.addAddressErrors}
                                handleAddAddressChange={props.handleAddAddressChange}
                                handleAddressIdChange={props.handleAddressIdChange}
                                taxClaimGetText={props.taxClaimGetText}
                                setDefaultShippingAddress={props.setDefaultShippingAddress}
                            />
                        ) : null}
                    </>
                );
            case CategoryType.NON_PROFIT_RELIGIOUS_CHARITABLE:
                return (
                    <NonProfitReligiousCharitableOrgsInputs
                        updateStep4Data={props.updateStep4Data}
                        organizationPosition={props.organizationPosition}
                        organizationName={props.organizationName}
                        organizationUrl={props.organizationUrl}
                        stateIssuedTaxExemptNumber={props.stateIssuedTaxExemptNumber}
                        phoneNumber={props.phoneNumber}
                        streetAddress={props.address1}
                        address2={props.address2}
                        city={props.city}
                        state={props.state}
                        postalCode={props.postalCode}
                        handleOrganizationPositionChange={props.handleOrganizationPositionChange}
                        handleOrganizationNameChange={props.handleOrganizationNameChange}
                        handleOrganizationUrlChange={props.handleOrganizationUrlChange}
                        handleStateIssuedTaxExemptNumberChange={props.handleStateIssuedTaxExemptNumberChange}
                        handlePhoneNumberChange={props.handlePhoneNumberChange}
                        handleStreetAddressChange={value => this.props.handleAddressChange('address1', value)}
                        handleAddress2Change={value => this.props.handleAddressChange('address2', value)}
                        handleCityChange={value => this.props.handleAddressChange('city', value)}
                        handleStateChange={value => this.props.handleAddressChange('state', value)}
                        handlePostalCodeChange={value => this.props.handleAddressChange('postalCode', value)}
                        handleAddressErrorsFromStepFour={this.props.handleAddressErrorsFromStepFour}
                        addressErrors={props.addressErrors}
                        wizardFormErrors={props.wizardFormErrors}
                        clearErrors={props.clearErrors}
                        selectedCategory={props.selectedCategory}
                        userGeneralData={props.userGeneralData}
                        firstName={props.ccfirstName || props.firstName}
                        lastName={props.cclastName || props.lastName}
                        creditCardIssued={props.creditCardIssued}
                        handleCCFirstNameChange={props.handleCCFirstNameChange}
                        handleCCLastNameChange={props.handleCCLastNameChange}
                        handleCreditCardIssuedChange={props.handleCreditCardIssuedChange}
                        formErrors={props.formErrors}
                        handleTaxExemptionSelection={props.handleTaxExemptionSelection}
                        taxAddressFormErrors={props.taxAddressFormErrors}
                        taxExemptionSelection={props.taxExemptionSelection}
                        addAddressErrors={props.addAddressErrors}
                        handleAddAddressChange={props.handleAddAddressChange}
                        handleAddressIdChange={props.handleAddressIdChange}
                    />
                );
            case CategoryType.RESELLER:
                return (
                    <ResellerInputs
                        updateStep4Data={props.updateStep4Data}
                        organizationPosition={props.organizationPosition}
                        organizationName={props.organizationName}
                        organizationType={props.organizationType}
                        organizationUrl={props.organizationUrl}
                        stateIssuedTaxExemptNumber={props.stateIssuedTaxExemptNumber}
                        phoneNumber={props.phoneNumber}
                        streetAddress={props.address1}
                        address2={props.address2}
                        city={props.city}
                        state={props.state}
                        postalCode={props.postalCode}
                        handleOrganizationPositionChange={props.handleOrganizationPositionChange}
                        handleOrganizationNameChange={props.handleOrganizationNameChange}
                        handleOrganizationTypeChange={props.handleOrganizationTypeChange}
                        handleOrganizationUrlChange={props.handleOrganizationUrlChange}
                        handleStateIssuedTaxExemptNumberChange={props.handleStateIssuedTaxExemptNumberChange}
                        handlePhoneNumberChange={props.handlePhoneNumberChange}
                        handleStreetAddressChange={value => this.props.handleAddressChange('address1', value)}
                        handleAddress2Change={value => this.props.handleAddressChange('address2', value)}
                        handleCityChange={value => this.props.handleAddressChange('city', value)}
                        handleStateChange={value => this.props.handleAddressChange('state', value)}
                        handlePostalCodeChange={value => this.props.handleAddressChange('postalCode', value)}
                        handleAddressErrorsFromStepFour={this.props.handleAddressErrorsFromStepFour}
                        addressErrors={props.addressErrors}
                        wizardFormErrors={props.wizardFormErrors}
                        clearErrors={props.clearErrors}
                        selectedCategory={props.selectedCategory}
                        userGeneralData={props.userGeneralData}
                        firstName={props.ccfirstName || props.firstName}
                        lastName={props.cclastName || props.lastName}
                        creditCardIssued={props.creditCardIssued}
                        handleCCFirstNameChange={props.handleCCFirstNameChange}
                        handleCCLastNameChange={props.handleCCLastNameChange}
                        handleCreditCardIssuedChange={props.handleCreditCardIssuedChange}
                        formErrors={props.formErrors}
                        handleTaxExemptionSelection={props.handleTaxExemptionSelection}
                        taxAddressFormErrors={props.taxAddressFormErrors}
                        taxExemptionSelection={props.taxExemptionSelection}
                        addAddressErrors={props.addAddressErrors}
                        handleAddAddressChange={props.handleAddAddressChange}
                        handleAddressIdChange={props.handleAddressIdChange}
                    />
                );

            case CategoryType.STATE_LOCAL_EDUCATIONAL:
                return (
                    <StateLocalEducationalInputs
                        updateStep4Data={props.updateStep4Data}
                        organizationPosition={props.organizationPosition}
                        organizationName={props.organizationName}
                        organizationUrl={props.organizationUrl}
                        stateIssuedTaxExemptNumber={props.stateIssuedTaxExemptNumber}
                        phoneNumber={props.phoneNumber}
                        streetAddress={props.address1}
                        address2={props.address2}
                        city={props.city}
                        state={props.state}
                        postalCode={props.postalCode}
                        handleOrganizationPositionChange={props.handleOrganizationPositionChange}
                        handleOrganizationNameChange={props.handleOrganizationNameChange}
                        handleOrganizationUrlChange={props.handleOrganizationUrlChange}
                        handleStateIssuedTaxExemptNumberChange={props.handleStateIssuedTaxExemptNumberChange}
                        handlePhoneNumberChange={props.handlePhoneNumberChange}
                        handleStreetAddressChange={value => this.props.handleAddressChange('address1', value)}
                        handleAddress2Change={value => this.props.handleAddressChange('address2', value)}
                        handleCityChange={value => this.props.handleAddressChange('city', value)}
                        handleStateChange={value => this.props.handleAddressChange('state', value)}
                        handlePostalCodeChange={value => this.props.handleAddressChange('postalCode', value)}
                        handleAddressErrorsFromStepFour={this.props.handleAddressErrorsFromStepFour}
                        addressErrors={props.addressErrors}
                        wizardFormErrors={props.wizardFormErrors}
                        clearErrors={props.clearErrors}
                        selectedCategory={props.selectedCategory}
                        userGeneralData={props.userGeneralData}
                        firstName={props.ccfirstName || props.firstName}
                        lastName={props.cclastName || props.lastName}
                        creditCardIssued={props.creditCardIssued}
                        handleCCFirstNameChange={props.handleCCFirstNameChange}
                        handleCCLastNameChange={props.handleCCLastNameChange}
                        handleCreditCardIssuedChange={props.handleCreditCardIssuedChange}
                        formErrors={props.formErrors}
                        handleTaxExemptionSelection={props.handleTaxExemptionSelection}
                        taxAddressFormErrors={props.taxAddressFormErrors}
                        taxExemptionSelection={props.taxExemptionSelection}
                        addAddressErrors={props.addAddressErrors}
                        handleAddAddressChange={props.handleAddAddressChange}
                        handleAddressIdChange={props.handleAddressIdChange}
                    />
                );

            case CategoryType.DISABLED_VETERANS_OKLAHOMA:
                return (
                    <>
                        <DisabledVetsOfOklahomaInputs
                            clearErrors={props.clearErrors}
                            updateStep4Data={props.updateStep4Data}
                            veteranExemptionNumber={props.veteranExemptionNumber}
                            veteranEffectiveDate={props.veteranEffectiveDate}
                            handleVeteranEffectiveDateChange={props.handleVeteranEffectiveDateChange}
                            handleVeteranExemptionNumberChange={props.handleVeteranExemptionNumberChange}
                            streetAddress={props.address1}
                            address2={props.address2}
                            city={props.city}
                            state={props.state}
                            postalCode={props.postalCode}
                            handleStreetAddressChange={value => this.props.handleAddressChange('address1', value)}
                            handleAddress2Change={value => this.props.handleAddressChange('address2', value)}
                            handleCityChange={value => this.props.handleAddressChange('city', value)}
                            handleStateChange={value => this.props.handleAddressChange('state', value)}
                            handlePostalCodeChange={value => this.props.handleAddressChange('postalCode', value)}
                            addressErrors={props.addressErrors}
                            wizardFormErrors={props.wizardFormErrors}
                            wizardFormData={props.wizardFormData}
                            handleAddressErrorsFromStepFour={this.props.handleAddressErrorsFromStepFour}
                            selectedCategory={selectedCategory}
                            formErrors={props.formErrors}
                            isTaxExemptionEnabled={TaxClaimUtils.isTaxExemptionEnabled()}
                        />

                        {TaxClaimUtils.isTaxExemptionEnabled() ? (
                            <TaxAddress
                                setDefaultAddress={props.setDefaultAddress}
                                updateStep4Data={props.updateStep4Data}
                                onSelection={props.handleTaxExemptionSelection}
                                taxAddressFormErrors={props.taxAddressFormErrors}
                                taxExemptionSelection={props.taxExemptionSelection}
                                handleStreetAddressChange={value => this.props.handleTaxAddressChange('address1', value)}
                                handleAddress2Change={value => this.props.handleTaxAddressChange('address2', value)}
                                handleCityChange={value => this.props.handleTaxAddressChange('city', value)}
                                handleStateChange={value => this.props.handleTaxAddressChange('state', value)}
                                handlePostalCodeChange={value => this.props.handleTaxAddressChange('postalCode', value)}
                                handleSetDefaultAddressChange={value => this.props.handleSetDefaultAddressChange(value)}
                                addAddressErrors={props.addAddressErrors}
                                handleAddAddressChange={props.handleAddAddressChange}
                                handleAddressIdChange={props.handleAddressIdChange}
                                taxClaimGetText={props.taxClaimGetText}
                                setDefaultShippingAddress={props.setDefaultShippingAddress}
                            />
                        ) : null}
                    </>
                );
            case CategoryTypeCA.FIRST_NATION_MEMBERS:
                return (
                    <>
                        <FirstNationMemberInput
                            registrationNumber={props.wizardFormData.registrationNumber}
                            aliasName={props.wizardFormData.aliasName}
                            registryGroupNumber={props.wizardFormData.registryGroupNumber}
                            registryBandName={props.wizardFormData.registryBandName}
                            nameOfReservation={props.wizardFormData.nameOfReservation}
                            wizardFormErrors={props.wizardFormErrors}
                            handleRegistrationNumberChange={props.handleRegistrationNumberChange}
                            handleAliasChange={props.handleAliasChange}
                            handleRegistryGroupChange={props.handleRegistryGroupChange}
                            handleRegistryBandChange={props.handleRegistryBandChange}
                            handleNameOfReservationChange={props.handleNameOfReservationChange}
                            updateStep4Data={props.updateStep4Data}
                            formErrors={props.formErrors}
                            clearErrors={props.clearErrors}
                        />
                        <IssueExpirationDateComponent
                            {...commonProps}
                            title={props.taxClaimGetText('datesLabel')}
                        />

                        {TaxClaimUtils.isTaxExemptionEnabled() ? (
                            <TaxAddress
                                setDefaultAddress={props.setDefaultAddress}
                                updateStep4Data={props.updateStep4Data}
                                onSelection={props.handleTaxExemptionSelection}
                                taxAddressFormErrors={props.taxAddressFormErrors}
                                taxExemptionSelection={props.taxExemptionSelection}
                                handleStreetAddressChange={value => this.props.handleTaxAddressChange('address1', value)}
                                handleAddress2Change={value => this.props.handleTaxAddressChange('address2', value)}
                                handleCityChange={value => this.props.handleTaxAddressChange('city', value)}
                                handleStateChange={value => this.props.handleTaxAddressChange('state', value)}
                                handlePostalCodeChange={value => this.props.handleTaxAddressChange('postalCode', value)}
                                handleSetDefaultAddressChange={value => this.props.handleSetDefaultAddressChange(value)}
                                addAddressErrors={props.addAddressErrors}
                                handleAddAddressChange={props.handleAddAddressChange}
                                handleAddressIdChange={props.handleAddressIdChange}
                                taxClaimGetText={props.taxClaimGetText}
                                setDefaultShippingAddress={props.setDefaultShippingAddress}
                            />
                        ) : null}
                    </>
                );
            case CategoryType.EXPORT_SALE_FREIGHT_FORWARDER:
                return (
                    <>
                        <FreightForwarder.FreightForwarderInputsWrapped
                            clearErrors={props.clearErrors}
                            updateStep4Data={props.updateStep4Data}
                            wizardFormData={props.wizardFormData}
                            formErrors={props.formErrors}
                            selectedCategory={selectedCategory}
                            handleFreightForwarderNameChange={this.props.handleFreightForwarderNameChange}
                            handleFreightCertNumberChange={this.props.handleFreightCertNumberChange}
                            freightName={this.props.freightName}
                            freightCertNumber={this.props.freightCertNumber}
                        />
                        <IssueExpirationDateComponent
                            {...commonProps}
                            title={props.taxClaimGetText('dateLabelFreightForwarder')}
                        />
                    </>
                );
            default:
                return null;
        }
    };

    renderTextInput = (name, label, value) => {
        const autoComplete = name === 'email' ? 'email' : name === 'firstName' ? 'given-name' : 'family-name';
        const disabled = ['firstName', 'lastName', 'email'].includes(name);

        return (
            <TextInput
                name={name}
                label={label}
                autoComplete={autoComplete}
                autoCorrect='off'
                required={true}
                hideAsterisk={true}
                maxLength={50}
                value={value}
                type={name === 'email' ? 'email' : 'text'}
                disabled={disabled}
            />
        );
    };

    handlePhoneNumberChange = event => {
        const value = event.target.value;
        const { selectedCategory } = this.props;
        this.props.handlePhoneNumberChange(value);
        this.props.updateStep4Data(selectedCategory, 'phoneNumber', value);
    };

    render() {
        const {
            nextStep, userGeneralData, taxClaimGetText, selectedCategory, hasStep4FormErrors
        } = this.props;

        const shouldRequirePhoneNumber =
            TaxClaimUtils.isTaxExemptionEnabled() &&
            [CategoryType.INDIGENOUS_AMERICAN, CategoryType.DISABLED_VETERANS_OKLAHOMA, CategoryTypeCA.FIRST_NATION_MEMBERS].includes(
                selectedCategory
            );
        const hasPhoneErrors = this.props.taxAddressFormErrors.includes('taxPhoneNumberEmpty');

        return (
            <>
                {hasStep4FormErrors ? (
                    <Text
                        css={styles.error}
                        role='alert'
                        aria-live='assertive'
                    >
                        {taxClaimGetText('fixErrorsBelow')}
                    </Text>
                ) : null}
                <div>
                    <Grid
                        css={styles.names}
                        gap={1}
                        gridTemplateColumns='1fr 1fr'
                    >
                        <Box>{this.renderTextInput('firstName', 'First Name', userGeneralData?.firstName || '')}</Box>
                        <Box>{this.renderTextInput('lastName', 'Last Name', userGeneralData?.lastName || '')}</Box>
                        <Box css={!shouldRequirePhoneNumber ? styles.email2rows : Empty.Object}>
                            {this.renderTextInput('email', 'Email', userGeneralData?.email || '')}
                        </Box>
                        {shouldRequirePhoneNumber ? (
                            <Box>
                                <TextInput
                                    label={taxClaimGetText('phoneNumberLabel')}
                                    value={this.props.phoneNumber}
                                    onChange={this.handlePhoneNumberChange}
                                    invalid={hasPhoneErrors}
                                    hideAsterisk
                                />
                            </Box>
                        ) : null}
                    </Grid>
                    <Box>{this.renderInputsByCategory(selectedCategory, this.props)}</Box>
                </div>
                <Grid justifyContent='flex-start'>
                    <Button
                        css={styles.nextButton}
                        variant='primary'
                        onClick={nextStep}
                        width='177px'
                    >
                        {taxClaimGetText('nextAction')}
                    </Button>
                </Grid>
            </>
        );
    }
}

class TaxExemptionInfoStepView extends BaseClass {
    render() {
        const {
            userGeneralData,
            taxClaimGetText,
            step4VariationData,
            selectedCategory,
            wizardFormData,
            isFreightForwarderCert,
            address1,
            address2,
            city,
            state,
            postalCode
        } = this.props;
        const taxAddressData = {
            address1,
            address2,
            city,
            state,
            postalCode
        };

        const isCertificateFreightForwarder = isFreightForwarderCert();

        return (
            <div>
                <Grid
                    css={styles.viewNames}
                    gap={2}
                    maxWidth={['85%', '50%', '50%']}
                >
                    <Box>
                        <div css={styles.flexContainer}>
                            <span css={styles.viewLabel}>{taxClaimGetText('firstName')}:</span>
                            <span css={styles.viewLabelData}>{userGeneralData?.firstName}</span>
                        </div>
                    </Box>
                    <Box>
                        <div css={styles.flexContainer}>
                            <span css={styles.viewLabel}>{taxClaimGetText('lastName')}:</span>
                            <span css={styles.viewLabelData}>{userGeneralData?.lastName}</span>
                        </div>
                    </Box>
                    <Box>
                        <div css={styles.flexContainer}>
                            <span css={styles.viewLabel}>{taxClaimGetText('email')}:</span>
                            <span css={styles.viewLabelData}>{userGeneralData?.email}</span>
                        </div>
                    </Box>
                    {selectedCategory === CategoryType.INDIGENOUS_AMERICAN && (
                        <IAViewInfo
                            step4VariationData={step4VariationData}
                            taxClaimGetText={taxClaimGetText}
                            taxAddressData={taxAddressData}
                            isTaxExemptionSelectionEnabled={TaxClaimUtils.isTaxExemptionEnabled()}
                            styles={styles}
                        />
                    )}
                    {selectedCategory === CategoryType.DISABLED_VETERANS_OKLAHOMA && (
                        <OklahomaViewInfo
                            step4VariationData={step4VariationData}
                            taxClaimGetText={taxClaimGetText}
                            styles={styles}
                        />
                    )}

                    {selectedCategory === CategoryType.NON_PROFIT_RELIGIOUS_CHARITABLE && (
                        <NPRCOViewInfo
                            step4VariationData={step4VariationData}
                            taxClaimGetText={taxClaimGetText}
                            styles={styles}
                            defaultFirstName={userGeneralData?.firstName}
                            defaultLastName={userGeneralData?.lastName}
                        />
                    )}

                    {selectedCategory === CategoryType.RESELLER && (
                        <ResellerViewInfo
                            step4VariationData={step4VariationData}
                            taxClaimGetText={taxClaimGetText}
                            styles={styles}
                            defaultFirstName={userGeneralData?.firstName}
                            defaultLastName={userGeneralData?.lastName}
                        />
                    )}

                    {selectedCategory === CategoryType.STATE_LOCAL_EDUCATIONAL && (
                        <SLGEIViewInfo
                            step4VariationData={step4VariationData}
                            taxClaimGetText={taxClaimGetText}
                            styles={styles}
                            defaultFirstName={userGeneralData?.firstName}
                            defaultLastName={userGeneralData?.lastName}
                        />
                    )}

                    {selectedCategory === CategoryType.EXPORT_SALE_FREIGHT_FORWARDER && !isCertificateFreightForwarder && (
                        <FreightForwarder.FreightForwarderViewInfoWrapped
                            step4VariationData={step4VariationData.esfff}
                            taxClaimGetText={taxClaimGetText}
                            styles={styles}
                            wizardFormData={wizardFormData}
                        />
                    )}

                    {selectedCategory === CategoryTypeCA.FIRST_NATION_MEMBERS && (
                        <FirstNationMemberView
                            step4VariationData={step4VariationData.fa}
                            taxClaimGetText={taxClaimGetText}
                            styles={styles}
                            taxAddressData={taxAddressData}
                            isTaxExemptionSelectionEnabled={TaxClaimUtils.isTaxExemptionEnabled()}
                            wizardFormData={wizardFormData}
                        />
                    )}
                </Grid>
            </div>
        );
    }
}

const styles = {
    names: {
        justifyContent: 'space-between',
        flexWrap: 'nowrap',
        marginTop: space[5]
    },
    singleInput: {
        marginTop: space[5]
    },
    nextButton: {
        marginTop: space[5]
    },
    viewNames: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        marginTop: space[4],
        overflowWrap: 'break-word'
    },
    viewLabel: {
        fontWeight: 'bold',
        width: '50%'
    },
    viewLabelData: {
        width: '55%',
        marginBottom: space[1],
        paddingLeft: space[1]
    },
    flexContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%'
    },
    error: {
        fontSize: fontSizes.base,
        color: colors.red,
        marginTop: space[4],
        marginBottom: space[4]
    },
    email2rows: {
        gridColumn: 'span 2'
    }
};

const TaxExemptionInfoStepEditWrapped = wrapComponent(TaxExemptionInfoStepEdit, 'TaxExemptionInfoStepEdit', true);
const TaxExemptionInfoStepViewWrapped = wrapComponent(TaxExemptionInfoStepView, 'TaxExemptionInfoStepView', true);

export default {
    TaxExemptionInfoStepEditWrapped,
    TaxExemptionInfoStepViewWrapped
};
